Mypage = {
    web3Provider: null,
    contracts: {},
    address:0x0,
    auth:"Personal",

    init: async function() {
      Init.init();
      return Mypage.initContract();
    },

    initContract: function(){
      $.getJSON('Personal.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var PersonalArtifact = data;
        Init.contracts.Personal = TruffleContract(PersonalArtifact);
      
        // Set the provider for our contract
        Init.contracts.Personal.setProvider(Init.web3Provider);
      });
      $.getJSON('Blacklist.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var BlackListArtifact = data;
        Init.contracts.BlackList = TruffleContract(BlackListArtifact);
      
        // Set the provider for our contract
        Init.contracts.BlackList.setProvider(Init.web3Provider);
      });
      $.getJSON('Migrations.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var MigrationArtifact = data;
        Init.contracts.Migration = TruffleContract(MigrationArtifact);
      
        // Set the provider for our contract
        Init.contracts.Migration.setProvider(Init.web3Provider);
      });
      $.getJSON('FixedSupplyToken.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var TokenArtifact = data;
        Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);
      
        // Set the provider for our contract
        Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
        return Mypage.getAccountList();
      });
    },

    getAccountList: function (){
        Mypage.getAccountInfo();
        Mypage.getAccountAuth();
        Mypage.getTokenInfo();
    },

    getAccountAuth: function(){
      Init.contracts.Migration.deployed().then(function(instance){
        var MigrationInstance=instance;
        return MigrationInstance.isOwner({from:Mypage.address})
      }).then(function(result){
        console.log(result);
        if (result) {
          Mypage.auth = "Owner";
          $("#BlackListDiv").show();
          Mypage.getBlacklist();
        }
        else Mypage.auth = "Personal";
        document.getElementById('isOwner').innerHTML=Mypage.auth;
        console.log("getAccountAuth  " + Mypage.auth);
      }).catch(function(error){
        console.log(error);
      });
    },

    getAccountInfo: function() {
      // web3.eth.getAccounts(function(error,accounts){
      var url=location.href;
      url=url.split('=')[1];
      Mypage.address=url;
      document.getElementById('accountAddr').innerHTML=Mypage.address;
      web3.eth.getBalance(Mypage.address, function(error,balance){
          document.getElementById('ethValue').innerHTML=web3.fromWei(balance.toString()) + "ETH";
          return Mypage.bindEvents();
      });
        
    },
    getTokenInfo: function(){
      Init.contracts.FixedSupplyToken.deployed().then(function(instance){
        var tokenInstance = instance;
        account=document.getElementById('accountAddr').innerText;
  
        return tokenInstance.balanceOf(account,{from:account});
      }).then(function(result) {
        // console.log(result.c);
        document.getElementById('tokenValue').innerText=result.c;
      });
    },

    getBlacklist: function (list) { 
      // tablePlace를 초기화하고 계좌수 만큼 테이블의 행을 생성합니다.
      document.getElementById("BlackList").innerText = " ";
      var idiv = document.createElement('table');
      document.getElementById("BlackList").appendChild(idiv);
       
      var total = 0;
      var input ="<tr><td>Account</td></tr>";
       
      Init.contracts.BlackList.deployed().then(function (instance){
        var BlackListInstance=instance;
        return BlackListInstance.getBlacklist();
      }).then(function(list){
        console.log("blacklist: ");
        console.log(list);
        for(var i = 0; i<list.length; i++){
          if (list[i]!=0x0) input +="<tr><td>"+ list[i] + "</td></tr>";
        }
        idiv.innerHTML = input;	
      });
      
    },

  
    bindEvents: function() {
        $(document).on('click', '.btn_goBack', Mypage.goBack);
        $(document).on('click', '.btn_buyToken', Mypage.buyToken);
        $(document).on('click', '.btn_registerBL', Mypage.registerBlackList);
        $(document).on('click', '.btn_deleteBL', Mypage.deleteBlackList);
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
  
  goBack: function(event) {
    location.href="../pet-shop.html?addr=" +Mypage.address ;
  },

  buyToken: function(){
    var token_amount= $('#tokenAmount').val();
    if (token_amount<=0){ alert("1 이상을 입력하시오.");return; }
    var contractAddress=Init.contracts.FixedSupplyToken.address;
    $('#tokenAmount').val("");

    console.log(Mypage.address);
    web3.eth.sendTransaction({from:Mypage.address,to: contractAddress,value: token_amount },function(e,r){
      console.log("finish the call!");
      Mypage.getTokenInfo();
    });
  },
  registerBlackList: function(){
    var regis_account=$("#regisBL_account").val();
    console.log(regis_account);
    $("#regisBL_account").val("");
    Init.contracts.BlackList.deployed().then(function(instance){
      BlackListInstance=instance;
      return BlackListInstance.blacklisting(regis_account,{from: Mypage.address});
    }).then(function(result){
      console.log(result);
      Mypage.getBlacklist();
    }).catch(function(error){
      console.log(error);
    })
  },

  deleteBlackList: function(){
    var del_account=$("#delBL_account").val();
    console.log(del_account);
    $("#delBL_account").val("");
    Init.contracts.BlackList.deployed().then(function(instance){
      BlackListInstance=instance;
      return BlackListInstance.deleteFromBlacklist(del_account,{from: Mypage.address});
    }).then(function(result){
      console.log(result);
      Mypage.getBlacklist();
    }).catch(function(error){
      console.log(error);
    })
  }

  };
  
  $(function() {
    $(window).load(function() {
      Mypage.init();
    });
  });
  