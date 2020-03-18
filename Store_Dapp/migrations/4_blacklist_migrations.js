var Blacklist = artifacts.require("./BlackList.sol");

module.exports = function(deployer) {
  deployer.deploy(Blacklist);
};
