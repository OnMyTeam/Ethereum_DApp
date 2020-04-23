var membership = artifacts.require("Membership");
var osdcToken = artifacts.require("OSDCToken");
var item = artifacts.require("Item");
var shopping = artifacts.require("Shopping");


module.exports = function(deployer) {
  deployer.deploy(osdcToken).then(function (){
    return deployer.deploy(membership, osdcToken.address).then(function (){
      return deployer.deploy(item).then(function (){
        return deployer.deploy(shopping, membership.address, item.address, osdcToken.address);
      })
    });
  });
};