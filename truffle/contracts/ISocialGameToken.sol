// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title Social Change Game Token Interface
 * @notice Smart Contract developed for the Harmony One Round 2 Hackathon on Gitcoin
 * @dev An interface for token management of a single Token Registry for all Social Games
 * Used by the {SocialGame} to manage tokens issued by players of the game and make
 * games as complete
 *
 * Intended usage: Track the tickets issued for all Social Change Games
 *
 * @author victaphu
 */
interface ISocialGameToken {

    /**
     * @dev called when a participant enters a game
     * This function is intended to be called by the SocialGame
     * upon registration of a participant for the game. The result is
     * minting of the token
     */
    function enterGame(
        address player,
        string memory tokenURI_,
        uint256 gameId
    ) external returns (uint256 ticket_);


    /**
     * @dev called when a particular game is completed. 
     */
    function gameCompleted() external;
}
