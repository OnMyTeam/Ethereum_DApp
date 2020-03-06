LogIn = {
    web3Provider: null,
    contracts: {},

    init: async function() {
      Init.init();
      return LogIn.initContract();
    },

    initContract: function(){
      $.getJSON('Personal.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var PersonalArtifact = data;
        Init.contracts.Personal = TruffleContract(PersonalArtifact);
      
        // Set the provider for our contract
        Init.contracts.Personal.setProvider(Init.web3Provider);
      
        // Use our contract to retrieve and mark the adopted pets
        LogIn.getAccountInfo();
        return LogIn.getAccountList();
      });
    },

    getAccountInfo: function() {
        web3.eth.getAccounts(function(error,accounts){
          let account=accounts[0];
            document.getElementById('accountAddr').innerHTML=account;
            web3.eth.getBalance(account, function(error,balance){
                document.getElementById('ethValue').innerHTML=web3.fromWei(balance.toString()) + "ETH";
                return LogIn.bindEvents();
            });
        });
        
    },
    getAccountList: function (){
      web3.eth.getAccounts(function(e,r){
        LogIn.refreshBalance(r);
        LogIn.makeSelect(r);
      });
    },

    refreshBalance: function (list) { 
      // tablePlace를 초기화하고 계좌수 만큼 테이블의 행을 생성합니다.
      
      var total = 0;
      var input ="";
       
      for(var i = 0; i<list.length; i++){
        console.log(list[i]);
        var tempB=parseFloat(web3.fromWei(web3.eth.getBalance(list[i]),"ether"));
        input +="<tr><td>"+ list[i] + "</td><td>" + tempB.toFixed(2) +" ETH</td></tr>";
        total+=tempB;
        
      }
  
      // input +="<tr><td><strong> TOTAL </strong></td><td><strong>" + total +" ETH</strong></td></tr></table>";
      $('#tableContent').html(input);
      
      //web3.eth.filter('latest').watch(function() { refreshBalance();});
    },
   

    makeSelect: function(list) { 
      var select =  document.getElementById('accounts');
      var html = '';
      for(var i = 0; i<list.length; i++){
        html += '<a class="dropdown-item" href="#">'+list[i]+'</a>';
      }
      $('#selectAddress').html(html);
    },
  
    bindEvents: function() {
        $(document).on('click', '.btn_login', LogIn.logIn);
        $(document).on('click', '.btn_join', LogIn.join);
        $(document).on('change', '.select_box', LogIn.changeSelect);
    },
  
    logIn: function(event) {
      let account=document.getElementById('accountAddr').innerText;
      Init.contracts.Personal.deployed().then(function(instance){
        return instance.getMemberInfo({from: account});
      }).then(function(result){
        if(result!=0x0){
          alert("Log-in success!");
           location.href="../pet-shop.html?addr=" +result ;
        }
        else{
          alert("Please join first!");
        }
      });
    },
    join: function(event) {
      location.href="./join.html";
  },
   
  changeSelect: function(){
    var address=document.getElementById('accounts').value;
    document.getElementById('accountAddr').innerHTML=address;
    document.getElementById('ethValue').innerHTML=parseFloat(web3.fromWei(web3.eth.getBalance(address),"ether"))+"ETHER";
  },

  };
  
  $(function() {
    $(window).load(function() {
      LogIn.init();
    });
  });
  