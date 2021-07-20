// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./SocialGameToken.sol";

/**
 * @title Social Change Game Registry
 * @notice Smart Contract developed for the Harmony One Round 2 Hackathon on Gitcoin
 * @dev Contract that is used to register organisations for the social harmony games dapp.
 * Use a URI that points to a JSON object containing the information for each social harmony
 * organisation. Each org will have their own public keys registered in the registry. this can
 * be used to look up the social harmony games and the game token created for that public key.
 *
 * JSON format registering the organisation (note no validation of the JSON is made on the smart contract)
 {
    "organisation": "",
    "organisationBanner":"", // url of image
    "description": "",
    "story": "",
    "icon": "",
    "heroImages": [], // URL of images to show
    "publicKey": "",
    "contactDetails": {
        "email": "",
        "site": "",
        "twitter": "",
        "facebook": "",
        "phone": ""
    }
 }
 *
 * One public key may only own one organisation. The URI and JSON can be updated as required. For the DAPP, 
 * IPFS is used to store the JSON dynamically. 
 *
 * Note that at this point anyone can add an entry into the registry. Organisations are 
 * verified by the registry owner (to be changed to allow multi-party verification). Verified organisations will
 * appear with a tick in the DAPP
 *
 * @author victaphu
 */
contract SocialHarmonyRegistry is Ownable, AccessControl {
    // mapping of address to URI of organisation
    mapping(address => string) private _tokenURIs;

    // list of organisations registered
    address[] public organisations;

    // mapping of verified organisations
    mapping(address => bool) private _verified;

    bytes32 public constant VERIFIER_GRANT_ROLE = "0x02"; // verify/revoke organisations

    uint256 public lastUpdated = 0; // latest update of the registry for caching purposes

    SocialGameToken public socialGameToken; // the token that this registry is connected to

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(VERIFIER_GRANT_ROLE, msg.sender);
    }

    function tokenURI(address organisation)
        public
        view
        virtual
        returns (string memory)
    {
        require(
            bytes(_tokenURIs[organisation]).length > 0,
            "Organisation not registered"
        );
        return _tokenURIs[organisation];
    }

    function registerURI(string memory uri) public {
        // updating the URI will also flag the item as unverified
        if (bytes(_tokenURIs[msg.sender]).length == 0) {
            organisations.push(msg.sender);
        }
        _tokenURIs[msg.sender] = uri;
        _verified[msg.sender] = false;
        lastUpdated ++;
    }

    function isVerified(address organisation)
        public
        view
        returns (bool verified_)
    {
        verified_ = _verified[organisation];
    }

    function verifyOrganisation(address organisation)
        public
        onlyRole(VERIFIER_GRANT_ROLE)
    {
        require(
            bytes(_tokenURIs[organisation]).length > 0,
            "Organisation not registered"
        );
        require(
            _verified[organisation] == false,
            "Organisation already verified"
        );
        _verified[organisation] = true;
        lastUpdated ++;
    }

    function unverifyOrganisation(address organisation)
        public
        onlyRole(VERIFIER_GRANT_ROLE)
    {
        require(
            bytes(_tokenURIs[organisation]).length > 0,
            "Organisation not registered"
        );
        require(
            _verified[organisation] == true,
            "Organisation already unverified"
        );
        _verified[organisation] = false;
        lastUpdated ++;
    }

    function getOrgsCount() public view returns (uint256 count) {
        count = organisations.length;
    }

    function getOrgs() public view returns (address[] memory orgs) {
        orgs = organisations;
    }

    function getURIs(uint256 start, uint256 pageSize)
        public
        view
        returns (address[] memory orgs, string[] memory orgURIs, bool[] memory verified)
    {
        require(start >= 0 && pageSize > 0, "invalid inputs to getURIs, page size invalid");
        require(
            (start + pageSize) <= organisations.length,
            "invalid input to getURIs"
        );

        address[] memory orgs_ = new address[](pageSize);
        string[] memory orgURIs_ = new string[](pageSize);
        bool[] memory verified_ = new bool[](pageSize);
        for (
            uint256 i = start;
            i < start + pageSize && i < organisations.length;
            ++i
        ) {
            orgs_[i - start] = organisations[i];
            orgURIs_[i - start] = _tokenURIs[organisations[i]];
            verified_[i - start] = _verified[organisations[i]];
        }

        orgs = orgs_;
        orgURIs = orgURIs_;
        verified = verified_;
    }
}
