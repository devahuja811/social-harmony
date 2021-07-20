// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./SocialGame.sol";
import "./ISocialGameToken.sol";
import "./reports/Report.sol";

/**
 * @title Social Change Game Token
 * @notice Smart Contract developed for the Harmony One Round 2 Hackathon on Gitcoin
 * @dev Contract that represents entries in the game as NFTs. Note a single token contract
 * is deployed. We track the game by its game-id and game address. Tokens of active games
 * cannot be transferred. Once a game is completed, the NFT can be used to represent the
 * participation of an address in the Social Game and can be transferred to others
 *
 * Intended usage: Track the tickets issued for all Social Change Games and act as a factory
 * to create SocialGames. SHMT tokens represent a badge of honor for how much donations were
 * made. It can also be used to endorse future games, giving the endorser some tokens back
 *
 * @author victaphu
 */
contract SocialGameToken is
    ERC721URIStorage,
    ISocialGameToken,
    IERC721Receiver,
    Ownable
{
    using Counters for Counters.Counter;

    event GameCreated(address SocialGame, uint256 gameId);

    uint256 public constant MAX_ENDORSERS = 20;
    uint256 public constant DEFAULT_PLAYERS = 100;
    uint256 public constant DEFAULT_ENTRY_COST = 1 ether;

    Counters.Counter private _tokenIds;
    Counters.Counter private _gameIds;

    // mapping of social game contract address to game id
    mapping(address => uint256) private _socialGameIds;

    address[] private _socialGameAddresses;

    // mapping of game id to active status, true for active, false for inactive
    mapping(uint256 => bool) private _gameStatus;

    // mapping of token id to game id
    mapping(uint256 => uint256) private _tokenToGameId;

    struct ERC721Details {
        address from;
        uint256 tokenId;
        address erc721Address;
    }

    // mapping of game to external erc721 token
    mapping(uint256 => ERC721Details) private _extensionERC721Token;

    // onchain reporting of events that happen
    Report private _reporting;

    address private _owner;

    constructor() ERC721("SocialHarmonyToken", "SHMT") {
        _reporting = new Report();
        _owner = msg.sender;
    }

    /**
     * @dev this factory function initialises and creates a social game. The operator is the owner of the
     * social game, and the beneficiary receives the payout. The necessary configuration options are
     * supplied as part of the arguments.
     * Capture the event {GameCreated} to read the address of the created game. Use default endorsers for the game
     *
     * @param operator the owner of the social game
     * @param beneficiary_ the benefactor of the funds for the completed game
     * @param participants_ total participants for a successful game
     * @param pricePerRound_ total price of a ticket per entry
     * @return gameId_ the id of the game played
     */
    function createSocialGame(
        address operator,
        address payable beneficiary_,
        uint256 participants_,
        uint256 pricePerRound_
    ) public returns (uint256 gameId_) {
        gameId_ = createSocialGame(
            operator,
            beneficiary_,
            participants_,
            pricePerRound_,
            MAX_ENDORSERS
        );
    }

    /**
     * @dev this factory function initialises and creates a social game. The operator is the owner of the
     * social game, and the beneficiary receives the payout. The necessary configuration options are
     * supplied as part of the arguments.
     * Capture the event {GameCreated} to read the address of the created game
     *
     * @param operator the owner of the social game
     * @param beneficiary_ the benefactor of the funds for the completed game
     * @param participants_ total participants for a successful game
     * @param pricePerRound_ total price of a ticket per entry
     * @param totalEndorsers endorsements required before a game may begin. set to 0 for no endorsements
     * @return gameId_ the id of the game played
     */
    function createSocialGame(
        address operator,
        address payable beneficiary_,
        uint256 participants_,
        uint256 pricePerRound_,
        uint256 totalEndorsers
    ) public returns (uint256 gameId_) {
        // return new instance of social game, transferring ownership

        if (_gameIds.current() == 0) { // first game is a initial offering and endorsers are set to 0
            require(
                operator == _owner,
                "ER_028"
            );
            totalEndorsers = 0;
        }
        _gameIds.increment();
        gameId_ = _gameIds.current();
        SocialGame game = new SocialGame(
            beneficiary_,
            participants_,
            pricePerRound_,
            gameId_,
            totalEndorsers,
            address(this),
            address(_reporting)
        );
        game.transferOwnership(operator);
        _socialGameIds[address(game)] = gameId_;
        _gameStatus[game.gameId()] = true;
        _reporting.grantAccess(address(game));
        _socialGameAddresses.push(address(game));        

        emit GameCreated(address(game), gameId_);
    }

    function getGameAddresses() public view returns (address[] memory games) {
        games = _socialGameAddresses;
    }

    /**
     * @dev this function mints an NFT for a given player using the token URI and the
     * game id. It represents a single entry in a given social game. This function can only
     * be called by the SocialGame with the corresponding game id (initialised using {createSocialGame})
     *
     * Requirements - caller must own the game id
     */
    function enterGame(
        address player,
        string memory tokenURI_,
        uint256 gameId
    ) external override returns (uint256 ticket_) {
        require(_socialGameIds[msg.sender] > 0, "ER_029");
        require(
            _socialGameIds[msg.sender] == gameId,
            "ER_030"
        );
        _tokenIds.increment();

        ticket_ = _tokenIds.current();
        _mint(player, ticket_); // use safe mint ...
        _setTokenURI(ticket_, tokenURI_);
        _tokenToGameId[ticket_] = gameId;
    }

    /**
     * @dev called when a social game has completed. This is called by the
     * social game itself to flag that the game has completed.
     *
     * Requirement - game must be currently active, and the caller must own a game
     */
    function gameCompleted() external override {
        uint256 gameId = _socialGameIds[msg.sender];
        require(gameId > 0, "ER_031");
        require(_gameStatus[gameId] == true, "ER_032");

        SocialGame game = SocialGame(payable(msg.sender));

        _reporting.revokeAccess(msg.sender);
       
        
        _gameStatus[gameId] = false;
        // once a game is completed the user can transfer the nft

        if (_extensionERC721Token[gameId].tokenId > 0) {
            // token id exists, lets transfer the token back to the sender
            ERC721Details memory details = _extensionERC721Token[gameId];
            IERC721 wrapped = IERC721(details.erc721Address);
            wrapped.safeTransferFrom(
                address(this),
                details.from,
                details.tokenId
            );
            // clear the details to get back some gas refund
            _extensionERC721Token[gameId] = ERC721Details(
                address(0x0),
                0,
                address(0x0)
            );
        }
    }

    /**
     * @dev Prevent transfers until the game has completed. we will know the game the token belongs to
     * by looking up its mapping.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal view override {
        if (from == address(0)) {
            return; // we are minting the token
        }

        require(_tokenToGameId[tokenId] > 0, "ER_033");
        require(
            _gameStatus[_tokenToGameId[tokenId]] == false,
            "ER_034"
        );
    }

    /**
     * https://ethereum.stackexchange.com/questions/49185/solidity-conversion-bytes-memory-to-uint
     * convert bytes to uint256
     */
    function sliceUint(bytes memory bs, uint256 start)
        internal
        pure
        returns (uint256)
    {
        require(bs.length >= start + 32, "ER_035");
        uint256 x;
        assembly {
            x := mload(add(bs, add(0x20, start)))
        }
        return x;
    }

    /**
     * @dev Return the number of games that have been played
     *
     * @return gamesPlayed_ number of games played (note not successful games, just games played)
     */
    function getGamesPlayed() external view returns (uint256 gamesPlayed_) {
        gamesPlayed_ = _gameIds.current();
    }

    /**
     * @dev Return the address for the reporting smart contract. use it to query for data
     *
     * @return reporting address of the reporting smart contract
     */
    function getGamesReporting() external view returns (address reporting) {
        reporting = address(_reporting);
    }

    /**
     * @dev transfer an ERC721 token through safeTransferFrom to the SocialGameToken address to setup
     * a social game. The supplied data argument is a concatenation of two uint256 encoded into bytes.
     * First argument is the number of participants for a game, and the second argument is the price
     * per round in the game. This is supplied to createSocialGame. When the game completes, the token
     * is transfered back to the owner.
     * Capture the GameCreated event to find the address and game id for the SocialGame contract
     *
     * Note at this point no validation is done to confirm that the caller is a ERC721 token contract
     * @param operator is the msg.sender of the caller to the ERC721 safeTransferFrom function
     * @param from address representing the previous owner of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param data bytes optional data to send along with the call
     * @return special selector as required by interface {IERC721Receiver.onERC721Received}
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // 2 x 32 byte arrays, first one is num participants, second is price per round
        // default values are provided
        uint256 numberParticipants = DEFAULT_PLAYERS;
        uint256 pricePerRound = DEFAULT_ENTRY_COST;
        uint256 endorsers = MAX_ENDORSERS;

        if (data.length == 96) {
            numberParticipants = sliceUint(data, 0); // start at 0-31 bytes for first uint
            pricePerRound = sliceUint(data, 32); // 32 bytes, 256 bits for second uint
            endorsers = sliceUint(data, 64); // 64-96 bytes, number of endorsers
        }
        // who is ultimate message.sender?
        uint256 gameId = createSocialGame(
            operator,
            payable(from),
            numberParticipants,
            pricePerRound,
            endorsers
        );
        _extensionERC721Token[gameId] = ERC721Details(
            from,
            tokenId,
            msg.sender
        );
        return this.onERC721Received.selector;
    }
}
