import {getGameContract} from "./common";
/**
 * Code for a single Social Harmony Game
 */

const _gameContract = (gameAddress) => {

}

const getGameDetails = async (gameAddress) => {
    const contractInstance = getGameContract(gameAddress);
    console.log(contractInstance);
    
}

// get game uri and content
const getGameContent = async (gameAddress) => {
    // query for URI
    // get 
}

// play game
const playGame = async (gameAddress) => {
    // add entry to the game
}

// claim prize
const claimPrize = async (gameAddress) => {
    // claim the prize if you are the winner!
}

// get winners
const getWinners = async (gameAddress) => {
    // get the winners of the game
}

// get game details

export {
    getGameDetails,
    getGameContent,
    playGame,
    getWinners
}
