App = {
    web3Provider: null,
    contracts: {},
    myAddress: null,
  
    init: async function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      console.log(web3.currentProvider);
      return App.initContract();
    },
  
    initContract: async function() {
      await $.getJSON('SimpleAuction.json', function (data) {
        var SimpleAuctionArtifact = data;
        App.contracts.SimpleAuction = TruffleContract(SimpleAuctionArtifact);
        App.contracts.SimpleAuction.setProvider(App.web3Provider);
      }); 
      await App.contracts.SimpleAuction.deployed().then(function(instance){
        App.SimpleAuctionInstance=instance;
      });
      App.startApp();
    },

    startApp: function(){
      App.getAccountInfo();
      App.getAuctionInfo();
      App.bindEvents();
    },

    getAccountInfo: function() {
      web3.eth.getAccounts().then(function(result){
        App.makeSelectAddress(result);
      });
    },

    makeSelectAddress: function(list) {
      var html;
      html += '<option value=""> Select </a>';
      for (var i = 0; i < list.length; i++) {
        html += '<option value="' + list[i] + '">' + list[i] + '</a>';
      }
      $('.accountAddr').html(html);
    },

   
    getAuctionInfo:function(){
      App.SimpleAuctionInstance.highestBidder({from: App.myAddress}).then(function(result){
        console.log(result);
        $('#highestAddress').text(result);
      });
      App.SimpleAuctionInstance.highestBid({from: App.myAddress}).then(function(result){
        console.log(result);
        $('#highestAmount').text(result);
      });
      App.SimpleAuctionInstance.ended({from: App.myAddress}).then(function(result){
        $('#auctionEnd').text(result);
      });
    },

    bindEvents:function() {
      $(document).on('change', '#selectAccount', App.changeSelect);
      $(document).on('click', '.bidBtn', App.bid);
      $(document).on('click', '.endBtn', App.endAuction);
      $(document).on('click', '.withdrawalBtn', App.withdrawal);
    },

    changeSelect: function(){
      var address = $('#selectAccount').val();
      if(address==""){
        console.log("select");
        document.getElementById('ethValue').innerHTML="";
        return;
      }
      App.myAddress=address;
      
      web3.eth.getBalance(address, (err, balance) => {
        var ether = web3.utils.fromWei(balance, "ether") + " ETH";
        document.getElementById('ethValue').innerHTML=ether;
      }); 
    },

    
    bid: function() {
      var amount=document.getElementById('bidAmount').value;
      document.getElementById('bidAmount').value="";
      // $('#bidAmount').text("");
      App.SimpleAuctionInstance.bid({from: App.myAddress,value: amount}).then(function(result){
        console.log(result);
        alert("bid success!");
        App.getAuctionInfo();
      }).catch(function(error){
        alert(error);
      });
    },
    
    endAuction: function() {
      App.SimpleAuctionInstance.auctionEnd({from: App.myAddress}).then(function(result){
        alert("Auction is end!!");
        App.getAuctionInfo();
      }).catch(function(error){
        alert(error);
      });
    },
    
    withdrawal: function() {
      App.SimpleAuctionInstance.withdraw({from: App.myAddress}).then(function(result){
        console.log(result);
        alert("withdrawal success!");
      }).catch(function(error){
        alert(error);
      });
    },

};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});
