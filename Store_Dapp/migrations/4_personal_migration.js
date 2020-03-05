var Personal = artifacts.require("./Personal.sol");

module.exports = function(deployer) {
  deployer.deploy(Personal);
};
