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
        var select =  document.getElementById('accounts');
        for(var i = 0; i<list.length; i++){
          var opt=document.createElement('option');
          opt.value = list[i];
          opt.innerHTML = list[i];
          select.appendChild(opt);
        }
      },
  
    bindEvents: function() {
        $(document).on('click', '.btn_goBack', Join.goBack);
        $(document).on('click', '.btn_register', Join.join);
        $(document).on('change', '.select_box', Join.changeSelect);
    },

    changeSelect: function(){
        var address=document.getElementById('accounts').value;
        document.getElementById('accountAddr').innerHTML=address;
        document.getElementById('ethValue').innerHTML=parseFloat(web3.fromWei(web3.eth.getBalance(address),"ether"))+"ETHER";
    },
  
    goBack: function(event) {
        location.href="./index.html";
    },

    join: function(event){
        Init.contracts.Personal.deployed().then(function(instance){
            let PersonalInstance=instance;
            let account=document.getElementById('accountAddr').innerText;
            console.log(account);
            return PersonalInstance.register({from:account})
        }).then(function(result){
            console.log(result);
            alert("Successfully Register!");
            Join.goBack();
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
  