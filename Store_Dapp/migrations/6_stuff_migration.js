var stuff = artifacts.require("./Stuff.sol");

module.exports = function(deployer) {
  deployer.deploy(stuff);
};