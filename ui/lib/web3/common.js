import SocialGame from "../../contracts/SocialGame.json";
import SocialGameToken from "../../contracts/SocialGameToken.json";
import SocialHarmonyRegistry from "../../contracts/SocialHarmonyRegistry.json";
import Report from "../../contracts/Report.json";
import config from "../../components/config";
import hmy from "./hmy";

const getGameContract = (address) => {
    const game = hmy.contracts.createContract(SocialGame.abi, address);
    return game;
}

const getTokenContract = () => {
    const tokenAddress = config.addresses.token;
    return hmy.contracts.createContract(SocialGameToken.abi, tokenAddress);
}

const getReportContract = async () => {

    const reportAddress = await getTokenContract().methods.getGamesReporting().call()
    console.log(reportAddress);
    return hmy.contracts.createContract(Report.abi, reportAddress);
}

const getRegistryContract = () => {

    const registryAddress = config.addresses.registry;
    return hmy.contracts.createContract(SocialHarmonyRegistry.abi, registryAddress);
}

export {
    getGameContract,
    getTokenContract,
    getRegistryContract,
    getReportContract
}