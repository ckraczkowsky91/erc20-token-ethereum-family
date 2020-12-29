var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var KraczkowskyToken = artifacts.require("./KraczkowskyToken.sol");
var KraczkowskyMarketplace = artifacts.require("./KraczkowskyMarketplace.sol");

module.exports = function(deployer, accounts) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(KraczkowskyToken, 100)
    .then(() => {
      console.log('DEPLOY', deployer);
    })
    .then(function() {
    return deployer.deploy(KraczkowskyMarketplace, KraczkowskyToken.address);
    });
};
