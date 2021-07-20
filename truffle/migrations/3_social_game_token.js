const SocialGameToken = artifacts.require("SocialGameToken");

module.exports = function (deployer, network, accounts) {
  
  deployer.deploy(SocialGameToken);
};
