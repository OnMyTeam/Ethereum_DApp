App = {
  web3Provider: null,
  contracts: {},
  address: 0x0,

  init: async function() {
    await Init.init();
    App.getAccountInfo();
  },

  getAccountInfo: function() {
      web3.eth.getAccounts(function(error,accounts){
          App.makeSelect(accounts);
          return App.bindEvents();
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
      $(document).on('click', '#etherSendBtn', App.sendEther);
      $(document).on('click', '#tokenSendBtn', App.sendToken);
      $(document).on('change', '#selectAccount', App.changeSelect);
  },

  changeSelect: function(){
    var ether;
    var token;
    App.address = $('#selectAccount').val();
    $('#address').text(App.address);


    web3.eth.getBalance(App.address, (err, balance) => {
      
      ether = parseInt(web3.utils.fromWei(balance, "wei")) / 1000000000000000000;
      Init.OSDCTokenInstance.balanceOf.call(App.address, {from:App.address}).then(function(result) {
        token = result.toNumber();
        var imageHtml= '<img class="balance-icon" src="public/images/eth_logo.svg" style="height: 25px; width: 25px; border-radius: 25px;">'
        $('#etherValue').html(imageHtml + ether + " ETH");
        $('#tokenValue').text(result.toNumber());

      });
      
    }); 
     
  },

  sendEther: function(){
    var toAddress = $('#etherAddressTxt').val();
    var etherValue = $('#etherValue1').val().toString();

    if(App.address == ''){
      alert('Please select address');
      $('#selectAccount').focus();
      return;
    }else if(toAddress == ''){
      alert('Please input address');
      $('#etherAddressTxt').focus();
      return;
    }else if(etherValue == ''){
      alert('Please input Ether value');
      $('#etherValue1').focus();
      return;
    }

    const tokenPrice = new web3.utils.BN('1000000000000000000').mul(new web3.utils.BN(etherValue));

    try {
      web3.eth.sendTransaction({ from: App.address, to: toAddress, value: tokenPrice },
      function (e, r) {
        
        if(e){

          if(e.toString().indexOf('sender doesn\'t have enough funds to send tx') != -1) {
            alert("Not enough Ether");
            return;
          }
        } 
        alert('Ether transfer success!');
        $('#etherAddressTxt').val('');
        $('#etherValue1').val('');

        web3.eth.getBalance(App.address, (err, balance) => {
          console.log(balance);
          ether = parseInt(web3.utils.fromWei(balance, "wei")) / 1000000000000000000;
          var imageHtml= '<img class="balance-icon" src="public/images/eth_logo.svg" style="height: 25px; width: 25px; border-radius: 25px;">'
          $('#etherValue').html(imageHtml + ether + " ETH");        
        });       


      }).catch(function (error){
        
        console.log(error);

      });
    }catch (e){
      console.log(e);
      if(e.toString().indexOf('is invalid') != -1) {
        alert("Invalid address");
        $('#etherAddressTxt').focus();
        return;
      }
    }


  },

  sendToken: function(){
    var toAddress = $('#tokenAddressTxt').val();
    var tokenValue = $('#tokenValue1').val();

    if(App.address == ''){
      alert('Please select address');
      $('#selectAccount').focus();
      return;
    }else if(toAddress == ''){
      alert('Please input address');
      $('#tokenAddressTxt').focus();
      return;
    }else if(tokenValue == ''){
      alert('Please input token value');
      $('#tokenValue1').focus();
      return;
    }
    
    Init.OSDCTokenInstance.transfer(toAddress, tokenValue, { from: App.address }).then(function (result) {
      alert('Token transfer success!');
      $('#tokenAddressTxt').val('');
      $('#tokenValue1').val('');

      Init.OSDCTokenInstance.balanceOf(App.address,{from:App.address}).then(function(result) {
        token = result.toNumber();
        $('#tokenValue').text(token);

      });



    }).catch(function (error) {
      if (error.message == 'Returned error: VM Exception while processing transaction: revert need token -- Reason given: need token.') {
        alert('Not enough Token');
      } else if(error.message.toString().indexOf('invalid') != -1){
        alert('Invalid address');
        $('#tokenAddressTxt').focus();
      }
      
    });    

    


  }  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
