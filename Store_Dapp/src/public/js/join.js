Join = {
    web3Provider: null,
    contracts: {},
  
    init: async function() {
        Init.init();
      return Join.initContract();
    },
  
    initContract: function() {
        $.getJSON('Personal.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var PersonalArtifact = data;
            Init.contracts.Personal = TruffleContract(PersonalArtifact);
          
            // Set the provider for our contract
            Init.contracts.Personal.setProvider(Init.web3Provider);
          
            // Use our contract to retrieve and mark the adopted pets
            return Join.getAccountInfo();
          });
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
        $(document).on('click', '.btn_goBack', Join.goBack);
        $(document).on('click', '.btn-facebook', Join.join);
        $(document).on('change', '#selectAccount', Join.changeSelect);
    },

    changeSelect: function(){
        var address = $('#selectAccount').val();
        $('#address').text(address);
        var ether;
        web3.eth.getBalance(address, (err, balance) => {
          ether = web3.fromWei(balance, "ether").toFixed(2);
          $('#etherValue').text(ether + " ETH");
        }); 

        console.log(address);
        Init.contracts.Personal.deployed().then(function (instance) {
          return instance.getMemberInfo({ from: address });
        }).then(function (result) {
          console.log(result);
          if (result) {

            $('#register').html("<font color='green'><b>YES</b></font>");
          }
          else {
            $('#register').html("<font color='red'>NO</font>");
          }
        });        
        
    },
  
    goBack: function(event) {
        location.href="./index.html";
    },

    join: function(event){
      
      Init.contracts.Personal.deployed().then(function(instance){
          let PersonalInstance = instance;
          var address = $('#address').text();
          
          console.log(address);
          return PersonalInstance.register({from:address})
      }).then(function(result){
          console.log(result);
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
  