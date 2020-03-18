var Tokens = artifacts.require("FixedSupplyToken");

module.exports = function(deployer) {
  deployer.deploy(Tokens);
};
