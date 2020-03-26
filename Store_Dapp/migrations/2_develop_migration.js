var perosnal = artifacts.require("Personal");
var blacklist = artifacts.require("BlackList");
var basicToken = artifacts.require("OSDCToken");
var item = artifacts.require("Item");


module.exports = function(deployer) {

  deployer.deploy(perosnal).then(function (){
    
    return deployer.deploy(blacklist).then(function (){

      return deployer.deploy(basicToken, perosnal.address).then(function (){

        return deployer.deploy(item, basicToken.address, blacklist.address, perosnal.address);

      });

    });
  });
  
};