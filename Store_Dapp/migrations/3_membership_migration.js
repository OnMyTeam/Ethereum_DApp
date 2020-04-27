var membership = artifacts.require("Membership");
var osdcToken = artifacts.require("OSDCToken");

module.exports = function(deployer) {
   deployer.deploy(membership, osdcToken.address);
  
};