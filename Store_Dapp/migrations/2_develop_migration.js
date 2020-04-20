// var membership = artifacts.require("Membership");
var osdcToken = artifacts.require("OSDCToken");
// var item = artifacts.require("Item");
var shopping = artifacts.require("Shopping");


module.exports = function(deployer) {
  deployer.deploy(osdcToken).then(function (){
    return deployer.deploy(shopping, osdcToken.address);
  });
};