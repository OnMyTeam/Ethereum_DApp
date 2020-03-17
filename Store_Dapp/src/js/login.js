LogIn = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    Init.init();
    return LogIn.initContract();
  },

  initContract: function () {
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

  getAccountInfo: function () {
    // web3.eth.getAccounts(function(error,accounts){
    //   let account=accounts[0];
    //     document.getElementById('accountAddr').innerHTML=account;
    //     web3.eth.getBalance(account, function(error,balance){
    //         document.getElementById('ethValue').innerHTML=web3.fromWei(balance.toString()) + "ETH";
    //         return LogIn.bindEvents();
    //     });
    // });

  },
  getAccountList: function () {
    web3.eth.getAccounts(function (e, r) {
      LogIn.refreshBalance(r);
      LogIn.makeSelect(r);
    });
  },

  refreshBalance: function (list) {

    var total = 0;
    var input = "";

    for (var i = 0; i < list.length; i++) {

      var tempB = parseFloat(web3.fromWei(web3.eth.getBalance(list[i]), "ether"));
      input += "<tr><td>" + list[i] + "</td><td>" + tempB.toFixed(2) + " ETH</td></tr>";
      total += tempB;

    }

    // input +="<tr><td><strong> TOTAL </strong></td><td><strong>" + total +" ETH</strong></td></tr></table>";
    $('#tableContent').html(input);

    //web3.eth.filter('latest').watch(function() { refreshBalance();});
  },


  makeSelect: function (list) {

    var html = '';
    html += '<option value="">Select</a>';
    for (var i = 0; i < list.length; i++) {
      html += '<option value="' + list[i] + '">' + list[i] + '</a>';
    }
    $('.custom-select').html(html);
  },

  bindEvents: function () {

    $(document).on('click', '.btn-primary', LogIn.logIn);
    // $(document).on('change', 'custom-select', LogIn.changeAddress);

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

  changeSelect: function () {
    var address = document.getElementById('accounts').value;
    document.getElementById('accountAddr').innerHTML = address;
    document.getElementById('ethValue').innerHTML = parseFloat(web3.fromWei(web3.eth.getBalance(address), "ether")) + "ETHER";
  },

};

$(function () {
   
  $(window).load(function () {
   
    LogIn.init();
  });

});
