LogIn = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    await Init.init();
    LogIn.bindEvents();
    LogIn.getAccountList();
  },

  getAccountList: function() {
    web3.eth.getAccounts(function (e, r) {
      LogIn.refreshBalance(r);
      LogIn.makeSelectAddress(r);
    });
  },

  refreshBalance: async function(list) {
    var token;
    var html;
    var ether;
    for (var i = 0; i < list.length; i++) {
      web3.eth.getBalance(list[i], (err, balance) => {
        ether = parseInt(web3.utils.fromWei(balance, "ether"));
      });       
      await Init.OSDCTokenInstance.balanceOf(list[i],{from:list[i]}).then(function(result) {
        if(result.words[0] == undefined){
          token = 0;
        }else {
          token = result.words[0];
        }
        html += "<tr>";
        html += "<td>" + list[i] + "</td>";
        html += "<td>" + ether.toFixed(2) + " ETH</td>";
        html += "<td> " + token + " </td>";
        html += "</tr>";
      });
    }
    $('#tableContent').html(html);
  },


  makeSelectAddress: function(list) {
    var html;
    html += '<option value=""> Select </a>';
    for (var i = 0; i < list.length; i++) {
      html += '<option value="' + list[i] + '">' + list[i] + '</a>';
    }
    $('.custom-select').html(html);
  },

  bindEvents: function() {
    $(document).on('click', '.btn-primary', LogIn.logIn);
  },


  logIn: function() {
    var loginForm = $('#loginform');
    var address = $('#selectAccount').val();
    if (address == ''){ alert('Please select address'); return; } 
    
    Init.membershipInstance.getMemberInfo({from:address}).then(function (result) {
      // console.log(result);
      if (result != 0x0) {
        loginForm.attr('action','/shop');
        loginForm.attr('method','post');
        loginForm.submit();
      }
      else {
        alert("Please Join First!");
      }
    });
  }
};

$(function() {
  $(window).load(function() {
    LogIn.init();
  });

});
