Init = {
  web3Provider: null,
  contracts: {},
  personalInstance: null,
  itemInstance: null,
  OSDCTokenInstance: null,

  init: async function() {
    await Init.initWeb3();
    await Init.initContract();
    await Init.getContractInstance();
  },

  initWeb3: async function() {
    Init.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(Init.web3Provider);
  },

  initContract: async function() {
    await $.getJSON('Personal.json', function (data) {
      var PersonalArtifact = data;
      Init.contracts.Personal = TruffleContract(PersonalArtifact);
      Init.contracts.Personal.setProvider(Init.web3Provider);
    });      
    await $.getJSON('item.json', function(data) {
      var itemArtifact = data;
      Init.contracts.item = TruffleContract(itemArtifact);
      Init.contracts.item.setProvider(Init.web3Provider);
    });
    await $.getJSON('OSDCToken.json', function(data) {
      var TokenArtifact = data;
      Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);
      Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
    });
  },

  getContractInstance: async function(){
    await Init.contracts.Personal.deployed().then(function(instance){
      Init.personalInstance=instance;
    });
    await Init.contracts.item.deployed().then(function(instance){
      Init.itemInstance=instance;
    });
    await Init.contracts.FixedSupplyToken.deployed().then(function(instance){
      Init.OSDCTokenInstance=instance;
    });
  }
};