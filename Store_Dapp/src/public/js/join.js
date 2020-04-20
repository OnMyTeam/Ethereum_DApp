Join = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    await Init.init();
    Join.getAccountInfo();
  },

  getAccountInfo: function() {
      web3.eth.getAccounts(function(error,accounts){
          Join.makeSelect(accounts);
          return Join.bindEvents();
      });
      
  },

  makeSelect: function(list) { 
      var html = '';
      html += '<option value="">Select</a>';
      for (var i = 0; i < list.length; i++) {
        html += '<option value="' + list[i] + '">' + list[i] + '</a>';
      }
      $('.custom-select').html(html);
    },

  bindEvents: function() {
      $(document).on('click', '.btn-facebook', Join.join);
      $(document).on('change', '#selectAccount', Join.changeSelect);
  },

  changeSelect: function(){
    var ether;
    var address = $('#selectAccount').val();
    $('#address').text(address);
    
    web3.eth.getBalance(address, (err, balance) => {
      ether = web3.fromWei(balance, "ether").toFixed(2);
      $('#etherValue').text(ether + " ETH");
    }); 
    
    Init.shoppingInstance.getMemberInfo({from:address}).then(function (result) {
      if (result) {
        $('#register').html("<font color='green'><b>YES</b></font>");
      }
      else {
        $('#register').html("<font color='red'>NO</font>");
      }
    }).catch(function(error){
      console.log(error);
    });        
      
  },

  join: function(){
    var address = $('#address').text();        
    Init.shoppingInstance.registerMember({from:address}).then(function(result){
        // console.log(result);
        alert("Successfully Register!");
        $('#register').html("<font color='green'><b>YES</b></font>");
        
    }).catch(function (error){
        console.log(error);
        alert("Already Registered");
    });
  }
};

$(function() {
  $(window).load(function() {
    Join.init();
  });
});
