var receiverPays = artifacts.require("ReceiverPays");



module.exports = function(deployer) {
  deployer.deploy(receiverPays).then(function (){

  });
};