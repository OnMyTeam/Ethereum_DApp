const abi = require('ethereumjs-abi');


LogIn = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    await Init.init();
    LogIn.bindEvents();
    LogIn.getAccountList();
  },





// recipient is the address that should be paid.
// amount, in wei, specifies how much ether should be sent.
// nonce can be any unique number to prevent replay attacks
// contractAddress is used to prevent cross-contract replay attacks
  signPayment: function(recipient, amount, nonce, contractAddress, callback) {
      var hash = "0x" + abi.soliditySHA3(
          ["address", "uint256", "uint256", "address"],
          [recipient, amount, nonce, contractAddress]
      ).toString("hex");

      web3.eth.personal.sign(hash, web3.eth.defaultAccount, function(result) {
        console.log(result);
        console.log('Signed');
      });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-primary', LogIn.logIn);
  },


};

$(function() {
  $(window).load(function() {
    console.log(abi.soliditySHA3);
    LogIn.init();
    LogIn.signPayment('0x4B25F217da6e457268517Ac3Ce5eEe343692d405', 10, 1, '0xe4F119bC0961167854974B6fF4505E89704CB81c');
  });

});
