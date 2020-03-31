var membership = artifacts.require("Membership");
var osdcToken = artifacts.require("OSDCToken");
var item = artifacts.require("Item");


module.exports = function(deployer) {
  deployer.deploy(membership).then(function (){
      return deployer.deploy(osdcToken, membership.address).then(function (){
        return deployer.deploy(item, osdcToken.address, membership.address);
      });
  });
};