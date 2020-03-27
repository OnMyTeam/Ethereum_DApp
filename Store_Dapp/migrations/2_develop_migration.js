var perosnal = artifacts.require("Personal");
var osdcToken = artifacts.require("OSDCToken");
var item = artifacts.require("Item");


module.exports = function(deployer) {
  deployer.deploy(perosnal).then(function (){
      return deployer.deploy(osdcToken, perosnal.address).then(function (){
        return deployer.deploy(item, osdcToken.address, perosnal.address);
      });
  });
};