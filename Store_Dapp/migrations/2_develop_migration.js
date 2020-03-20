var perosnal = artifacts.require("Personal");
var blacklist = artifacts.require("BlackList");
var fixedtoken = artifacts.require("FixedSupplyToken");
var stuff = artifacts.require("Stuff");


module.exports = function(deployer) {

  deployer.deploy(perosnal).then(function (){
    
    return deployer.deploy(blacklist).then(function (){

      return deployer.deploy(fixedtoken, perosnal.address).then(function (){

        return deployer.deploy(stuff, fixedtoken.address, blacklist.address, perosnal.address);

      });

    });
  });
  
};