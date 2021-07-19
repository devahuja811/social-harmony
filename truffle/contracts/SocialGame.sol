// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/escrow/RefundEscrow.sol";
import "@openzeppelin/contracts/utils/escrow/Escrow.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "./reports/Report.sol";
import "./ISocialGameToken.sol";

/**
 * @title Social Change Game
 * @notice Smart Contract developed for the Harmony One Round 2 Hackathon on Gitcoin
 * @dev Contract to operate the Social Game, receiving entries via deposits into
 * an escrow and releasing or cancelling the game depending on configuration.
 *
 * Contract should be created as part of the {SocialGameToken}-{createSocialGame} function.
 * It can also be created if a user transfers an ERC721 token to the {SocialGameToken} contract
 *
 * Intended usage: this contract is a standalone contract that manages business logic
 * around an escrow and the number of depositors of fixed amount of tokens. An external
 * oracle is used to determine the winner of the game, and a percentage of the escrow
 * is sent to Philantropic causes (DAO). A refund option is provided that can be triggered
 * by contract owner in cases where the social game expires or other external factors occur.
 * Refunds are pull-based meaning users must initiate a recovery of funds upon refund
 *
 * Note A game may only starts when sufficient people have endorsed it. The first game does not
 * require endorsement and is used to distribute initial SocialGameTokens.
 * Endorsement is currently configured to be optional and can be disabled by setting required
 * endorsements to 0 during contract creation
 *
 * Todo properly define appropriate tokenomics; should these tokens be deflationary?
 * See https://docs.google.com/spreadsheets/d/1QR9s4YUO7YEqH933wQlDOv62hYiRj5q-pvqEHaLnOkk/edit?usp=sharing
 * for token analytics with some assumptions
 *
 * @author victaphu
 */
contract SocialGame is Ownable, IERC721Receiver {
    using Address for address payable;

    event Participated(address participant, uint256 value);
    event Refunded(address depositor);
    event EndorsementRefunded(address endorser, uint256 tokenId);
    event BeneficiaryWithdrawn(address beneficiary);
    event PrizeClaimed(address beneficiary);
    event EndorsementFeeClaimed(address endorser, uint256 value);
    event GameCompleted(address first, address second, address third);
    event GameCancelled();
    event EndorsementReceived(address endorser, uint256 tokenId);

    // this is for the beneficiary (daoFund)
    RefundEscrow private immutable _daoEscrow;

    // this is for the winners, owned by the smart contract itself
    RefundEscrow private immutable _winnersEscrow;

    uint256 public immutable pricePerRound;
    uint256 public immutable participants;
    uint256 public immutable gameId;
    uint256 public immutable requiredEndorsers;
    address[] public receivedAddressesArray;
    bool public isGameCompleted;

    // constants for the game
    uint256 public constant PRIZE_1ST = 20;
    uint256 public constant PRIZE_2ND = 10;
    uint256 public constant PRIZE_3RD = 5;
    uint256 public constant FUNDS_DAO = 60;
    uint256 public constant ENDORSE_FEE = 5;

    address payable public winner1st;
    address payable public winner2nd;
    address payable public winner3rd;

    bool private _1stPrizeClaimed;
    bool private _2ndPrizeClaimed;
    bool private _3rdPrizeClaimed;

    ISocialGameToken private _socialGameToken;
    Report private _reporting;

    // endorsements (need 20 endorsements to start the game)
    uint256 public endorsements;

    // capture the endorsers and allow for refund if the game is cancelled
    // one address endorse only once
    mapping(address => uint256) private _endorsers;

    string public metadataURI;

    /**
     * @dev immutable configuration objects initialised in the contructor,
     * including the benefactor of the escrowed funds
     */
    constructor(
        address payable beneficiary_,
        uint256 participants_,
        uint256 pricePerRound_,
        uint256 gameId_,
        uint256 requiredEndorsers_,
        address socialGameToken_,
        address reporting_
    ) {
        require(pricePerRound_ > 0, "invalid price of ticket entry");
        require(participants_ > 3, "invalid participants");

        _daoEscrow = new RefundEscrow(beneficiary_);
        _winnersEscrow = new RefundEscrow(payable(address(this)));
        participants = participants_;
        pricePerRound = pricePerRound_;
        gameId = gameId_;
        _socialGameToken = ISocialGameToken(socialGameToken_);
        _reporting = Report(reporting_);
        requiredEndorsers = requiredEndorsers_;
    }

    function setMetadataURI(string memory uri) public onlyOwner {
        metadataURI = uri;
    }

    /**
     * @dev pick a winner randomly and remove it from the list of participants
     */
    function pickWinner(uint256 value_)
        private
        returns (address payable winner)
    {
        // prevent the same address from being picked again by removing it
        // first we switch the last spot with the randomly selected spot, then
        // we pop the array to remove the last slot

        winner = payable(receivedAddressesArray[value_]);
        receivedAddressesArray[value_] = receivedAddressesArray[
            receivedAddressesArray.length - 1
        ];
        receivedAddressesArray.pop();
    }

    /**
     * @dev Call this on game completion to indicate game is completed and payouts
     * should start to happen
     *
     * Emits {GameCompleted} event
     */
    function gameCompleted() private {
        require(isGameComplete(), "Game is not complete");
        _daoEscrow.close();
        _winnersEscrow.close();
        _winnersEscrow.beneficiaryWithdraw(); // withdraw the prize to this smart contract

        bytes32 seed = vrf();
        winner1st = pickWinner(
            randomWithVRFSeed(
                receivedAddressesArray.length,
                seed,
                block.difficulty
            )
        );
        winner2nd = pickWinner(
            randomWithVRFSeed(
                receivedAddressesArray.length,
                seed,
                block.timestamp
            )
        );
        winner3rd = pickWinner(
            randomWithVRFSeed(receivedAddressesArray.length, seed, uint256(0))
        );

        _socialGameToken.gameCompleted();

        emit GameCompleted(winner1st, winner2nd, winner3rd);
    }

    /**
     * @dev create a random value using a seed (VRF) and the nounce. It is important that the
     * seed is random.
     *
     * @param maxValue_ the maximum value (used for modulo)
     * @param seed_ a random value derived from the environment
     * @param nounce_ a value that is used as a nounce to extract random values from a single seed
     * @return result random value derived from the parameters
     */
    function randomWithVRFSeed(
        uint256 maxValue_,
        bytes32 seed_,
        uint256 nounce_
    ) private pure returns (uint256 result) {
        uint256 packed = uint256(keccak256(abi.encodePacked(seed_, nounce_)));
        result = uint256(packed % maxValue_);
    }

    /**
     * @dev retrieve the number which is the VRF for each block
     * https://github.com/harmony-one/harmony/issues/3719
     *
     * @return result the VRF assocaited with the current block
     */
    function vrf() private view returns (bytes32 result) {
        bytes32 input;
        assembly {
            let memPtr := mload(0x40)
            if iszero(staticcall(not(0), 0xff, input, 32, memPtr, 32)) {
                invalid()
            }
            result := mload(memPtr)
        }
    }

    /**
     * @dev Participate in the Social Game by transferring appropriate amount.
     * Increases player count and records the address that transferred
     *
     * note: Sent value must match expected price per round, gamue must still be active, and
     * msg.sender must not have already participated.
     * Funds are sent to two escrows, a daoEscrow for the DAO, and a winnersEscrow
     * for money to be claimed by the winners
     *
     * Emits a {Participated} event
     */
    function participate() external payable virtual {
        require(msg.value == pricePerRound, "Invalid amount received");
        require(isGameCompleted == false, "Game has ended!");
        require(_daoEscrow.depositsOf(msg.sender) == 0, "Already Entered");
        require(
            endorsements == requiredEndorsers,
            "Required endorsers not met, game not started"
        );

        uint256 additional = 0;
        if (requiredEndorsers == 0) {
            additional = ENDORSE_FEE;
        }

        receivedAddressesArray.push(msg.sender);
        _daoEscrow.deposit{value: (msg.value * (FUNDS_DAO + additional)) / 100}(
            msg.sender
        );
        _winnersEscrow.deposit{
            value: (msg.value * (100 - (FUNDS_DAO + additional))) / 100
        }(msg.sender);

        uint256 value = _socialGameToken.enterGame(msg.sender, "", gameId);

        emit Participated(msg.sender, value);

        // update the player + game to indicate an entry to the game
        // key is address of the owner of the social game, and the game id
        _reporting.updateLatestReport(
            abi.encodePacked(gameId),
            abi.encodePacked(msg.sender),
            msg.value
        );

        // close this if the
        if (receivedAddressesArray.length == participants) {
            isGameCompleted = true;
            gameCompleted();
        }
    }

    /**
     * @dev allow user who contributed to get refund from both the daoEscrow and
     * winners escrow if the game has been cancelled
     *
     * Emits {Refunded} event
     */
    function refund() external payable virtual {
        require(isGameCancelled(), "Cannot refund if game is not cancelled");
        require(
            _winnersEscrow.depositsOf(msg.sender) > 0,
            "Cannot refund account, not a participant or refund claimed"
        );

        _daoEscrow.withdraw(payable(msg.sender));
        _winnersEscrow.withdraw(payable(msg.sender));

        emit Refunded(msg.sender);
    }

    /**
     * @dev allow endorser to get a refund on their ticket if the game was cancelled
     *
     * Emits {EndorserRefunded} event
     */
    function refundEndorsement() external virtual {
        require(
            isGameCancelled(),
            "Cannot refund endorsement, game is not cancelled"
        );
        require(
            _endorsers[msg.sender] > 0,
            "Not an endorser or already claimed refund"
        );

        uint256 token = _endorsers[msg.sender];
        _endorsers[msg.sender] = 0;

        IERC721 erc721 = IERC721(address(_socialGameToken));
        erc721.safeTransferFrom(address(this), msg.sender, token);

        emit EndorsementRefunded(msg.sender, token);
    }

    /**
     * @dev enable winners of the game to withdraw, only if the game is complete
     * and msg sender matches winner
     *
     * Emits {PrizeClaimed} event
     */
    function claimPrize() external virtual {
        require(
            isGameComplete(),
            "Cannot withdraw if the game is not completed"
        );
        require(
            msg.sender == winner1st ||
                msg.sender == winner2nd ||
                msg.sender == winner3rd,
            "Cannot claim the prize!"
        );
        require(
            (msg.sender == winner1st && _1stPrizeClaimed == false) ||
                (msg.sender == winner2nd && _2ndPrizeClaimed == false) ||
                (msg.sender == winner3rd && _3rdPrizeClaimed == false),
            "Winners prize already claimed"
        );

        address payable payoutAddress = payable(msg.sender);

        if (msg.sender == winner1st) {
            _1stPrizeClaimed = true;
            payoutAddress.sendValue(
                (pricePerRound * participants * PRIZE_1ST) / 100
            );
        } else if (msg.sender == winner2nd) {
            _2ndPrizeClaimed = true;
            payoutAddress.sendValue(
                (pricePerRound * participants * PRIZE_2ND) / 100
            );
        } else {
            _3rdPrizeClaimed = true;
            payoutAddress.sendValue(
                (pricePerRound * participants * PRIZE_3RD) / 100
            );
        }

        emit PrizeClaimed(msg.sender);
    }

    /**
     * @dev enable endorsers to claim their share of the endorsement fee. Endorsement is set at 5% and endorsers share
     * in a pool once the game is completed. Must revert if not part of endorsement list, or if the game is not complete
     *
     * Emits {EndorsementFeeClaimed} event
     */
    function claimEndorsementFee() external virtual {
        require(
            isGameComplete(),
            "Cannot claim endorsement fee if the game is not completed"
        );
        require(
            requiredEndorsers > 0,
            "There are no required endorsers for this game"
        );
        require(
            _endorsers[msg.sender] > 0,
            "Cannot claim endorsement fee because sender is not an endorser"
        );

        _endorsers[msg.sender] = 0;
        address payable payoutAddress = payable(msg.sender);

        uint256 refundValue = (pricePerRound * participants * ENDORSE_FEE) /
            100 /
            requiredEndorsers;

        payoutAddress.sendValue(refundValue);

        emit EndorsementFeeClaimed(msg.sender, refundValue);
    }

    /**
     * @dev helper function to determine if the msg.sender won
     * @return won whether the msg.sender is part of the winning address set
     */
    function didIWin() external view virtual returns (bool won) {
        won =
            winner1st == msg.sender ||
            winner2nd == msg.sender ||
            winner3rd == msg.sender;
    }

    /**
     * @dev enable the DAO to withdraw the funds. only if the game is complete and
     * the address of DAO matches the contructor address
     *
     * Emits {BeneficiaryWithdrawn} event
     */
    function beneficiaryWithdraw() external virtual {
        require(
            isGameCancelled() == false,
            "Cannot withdraw from DAO, game has been cancelled"
        );
        require(
            msg.sender == _daoEscrow.beneficiary(),
            "Cannot withdraw from DAO, not beneficiary"
        );
        require(
            isGameComplete(),
            "Cannot withdraw dao fund, game is not completed"
        );
        require(
            address(_daoEscrow).balance > 0,
            "Cannot withdraw from DAO fund, DAO fund already claimed"
        );

        _daoEscrow.beneficiaryWithdraw();

        emit BeneficiaryWithdrawn(msg.sender);
    }

    /**
     * @dev Called when the game is cancelled. This is called by the owner
     * and allows the depositors to get their money back
     *
     * Emits {GameCancelled} event
     */
    function gameCancelled() public onlyOwner {
        require(isGameComplete() == false, "Game is completed, cannot cancel");

        _daoEscrow.enableRefunds();
        _winnersEscrow.enableRefunds();

        // even tho game was cancelled, enable NFT transfers as users paid for the gas to mint it
        _socialGameToken.gameCompleted();

        emit GameCancelled();
    }

    /**
     * @dev check if game is complete. game complete when the participants
     * required for deposits are matched
     *
     * @return gameComplete whether the game is completed
     */
    function isGameComplete() public view returns (bool gameComplete) {
        gameComplete = isGameCompleted;
    }

    /**
     * @dev check is game is cancelled. a game is cancelled by the contract
     * owner. cancelled contracts enable refunds by the
     *
     * @return isCancelled whether the game has been cancelled
     */
    function isGameCancelled() public view returns (bool isCancelled) {
        isCancelled = _daoEscrow.state() == RefundEscrow.State.Refunding;
    }

    /**
     * @dev Get total number of participants so far
     *
     * @return participants_ current number of participants
     */
    function totalParticipants() public view returns (uint256 participants_) {
        if (isGameCompleted) {
            participants_ = participants;
        } else {
            participants_ = receivedAddressesArray.length;
        }
    }

    /**
     * @dev get dao and winners escrow values for caller of this function
     *
     * @return daoEscrow total value in dao escrow
     * @return winnersEscrow total value in winners' escrow
     */
    function getDeposits()
        public
        view
        returns (uint256 daoEscrow, uint256 winnersEscrow)
    {
        daoEscrow = _daoEscrow.depositsOf(msg.sender);
        winnersEscrow = _winnersEscrow.depositsOf(msg.sender);
    }

    // function for receiving tokens
    receive() external payable {
        require(
            msg.sender == address(_winnersEscrow),
            "cannot receive funds externally (receive)"
        );
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        require(
            msg.sender == address(_winnersEscrow),
            "cannot receive funds externally (fallback)"
        );
    }

    /**
     * @dev before a game begins it must be endorsed by 20 unique addresses holding a Social Game Token. They can endorse a
     * game by transferring their token into the address of the game. This function can only be called by the deployed
     * SocialGameToken contract that was used to create the game. The 20 endorsers is an arbitrary number for the purpose of
     * the hackathon, proper tokenecomics should be applied and numbers adjusted to better balance token inflation/deflation.
     *
     * Note the initial deployment of the social game token will trigger off an initial endorser offering. During this offering
     * there is no endorsement requirement for the game. This will seed the endorsers so that additional games can begin
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        require(
            msg.sender == address(_socialGameToken),
            "Can only receive tokens from the social token contract"
        );
        require(_endorsers[from] == 0, "Can only endorse once");
        require(
            endorsements < requiredEndorsers,
            "Sufficient endorsements received to begin game"
        );

        _endorsers[from] = tokenId;
        endorsements = endorsements + 1;

        emit EndorsementReceived(from, tokenId);

        // receive ERC721 transfer; must be from the social game token.
        return this.onERC721Received.selector;
    }
}
