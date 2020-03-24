LogIn = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    Init.init();
    return LogIn.initContract();
  },

  initContract: function () {
    $.getJSON('FixedSupplyToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TokenArtifact = data;
      Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);
    
      // Set the provider for our contract
      Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
      // PetShop.getTokenInfo();
    });    
    $.getJSON('Personal.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PersonalArtifact = data;
      Init.contracts.Personal = TruffleContract(PersonalArtifact);

      // Set the provider for our contract
      Init.contracts.Personal.setProvider(Init.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // LogIn.getAccountInfo();
      LogIn.bindEvents();
      return LogIn.getAccountList();
    });
  },


  getAccountList: function () {
    web3.eth.getAccounts(function (e, r) {
      LogIn.refreshBalance(r);
      LogIn.makeSelect(r);
    });
  },

  refreshBalance: async function (list) {


    var token;
    var input = "";

    for (var i = 0; i < list.length; i++) {
      // var tempB = parseFloat(web3.fromWei(web3.eth.getBalance(list[i]), "ether"));
      // var tempB = parseFloat(web3.fromWei(web3.eth.getBalance(list[i]), "ether"));
      var ether;
      web3.eth.getBalance(list[i], (err, balance) => {
        ether = web3.fromWei(balance, "ether");
      });       
      await Init.contracts.FixedSupplyToken.deployed().then(function(instance){
        
        var tokenInstance = instance;
        return tokenInstance.balanceOf(list[i],{from:list[i]});
      }).then(function(result) {
        console.log(result);
        if(result.c[0] == undefined){
          token = 0;
        }else {
          token = result.c[0];
        }
        input += "<tr>";
        input += "<td>" + list[i] + "</td>";
        input += "<td>" + ether.toFixed(2) + " ETH</td>";
        input += "<td> " + token + " </td>";
        input += "</tr>";
  
        
      });      


    }
    console.log(input);
    $('#tableContent').html(input);

  },


  makeSelect: function (list) {

    var html = '';
    html += '<option value=""> Select </a>';
    for (var i = 0; i < list.length; i++) {
      html += '<option value="' + list[i] + '">' + list[i] + '</a>';
    }
    $('.custom-select').html(html);
  },

  bindEvents: function () {
    $(document).on('click', '.btn-primary', LogIn.logIn);
    
  },


  logIn: function (event) {

    var address = $('#selectAccount').val();
    if (address == ''){ alert('Please select address'); return;}
    
    var loginForm = $('#loginform');
    Init.contracts.Personal.deployed().then(function (instance) {
      return instance.getMemberInfo({ from: address });
    }).then(function (result) {
      
      if (result != 0x0) {

        loginForm.attr('action','/shop');
        loginForm.attr('method','post');
        loginForm.submit();
         
      }
      else {
        alert("Please Join First!");
      }
    });
  },


};

$(function () {
   
  $(window).load(function () {
    LogIn.init();
  });

});
