var osdcToken = artifacts.require("OSDCToken");

module.exports = function(deployer) {
  deployer.deploy(osdcToken);
};