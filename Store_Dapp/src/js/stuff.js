Mall = {
    web3Provider: null,
    contracts: {},
    address: 0x00,
  
    init: async function() {
      Init.init();
      return await Mall.initContract();
    },
  
    initContract: function() {
      $.getJSON('Stuff.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var StuffArtifact = data;
        Init.contracts.Stuff = TruffleContract(StuffArtifact);
      
        // Set the provider for our contract
        Init.contracts.Stuff.setProvider(Init.web3Provider);
      
        // Use our contract to retrieve and mark the adopted pets
        return Mall.getStuffList();
      });
      $.getJSON('FixedSupplyToken.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var TokenArtifact = data;
        Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);
      
        // Set the provider for our contract
        Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
          Mall.getTokenInfo();
          Mall.getAccountInfo();
          
      });
     
    },
    
    setToNum: function(num){
      return Number(num).toPrecision(50).toString().split('.')[0];
    },
  
    
    getAccountInfo: function() {
        var url=location.href;
        url=url.split('=')[1];
        Mall.address=url;
        document.getElementById('accountAddr').innerHTML=Mall.address;
        web3.eth.getBalance(Mall.address, function(account,balance){
            document.getElementById('ethValue').innerHTML=web3.fromWei(balance.toString()) + "ETH";
            return Mall.bindEvents();
        });
    },
  
    getTokenInfo: function(){
      Init.contracts.FixedSupplyToken.deployed().then(function(instance){
        var tokenInstance = instance;

        return tokenInstance.balanceOf(Mall.address,{from:Mall.address});
      }).then(function(result) {
        document.getElementById('tokenValue').innerText=result.c;
      });
    },

    getStuffList: function(t) {
      var StuffInstance;
      var stuffsRow = $('#stuffsRow');
      var stuffTemplate = $('#stuffTemplate');
      stuffsRow.empty();
  
      Init.contracts.Stuff.deployed().then(function(instance) {
        StuffInstance = instance;
        return StuffInstance.getnum({from:Mall.address});
      }).then(function(stuffNum) {
        console.log("StuffNo: "+stuffNum[0]);
        for (i = 0; i < stuffNum[0]; i++) {
          
          StuffInstance.getStuff(i,{from: Mall.address}).then(function (res){
            console.log(res);
            if(res[1]!=""){ 
              stuffTemplate.find('.panel-title').text(res[1]);
              stuffTemplate.find('img').attr('src',  "images/scottish-terrier.jpeg");
              stuffTemplate.find('.stuff-code').text(res[0]);
              stuffTemplate.find('.stuff-owner').text(res[4]);
              stuffTemplate.find('.stuff-description').text(res[2]);
              stuffTemplate.find('.stuff-cost').text(res[3]);
              stuffTemplate.find('.btn-buy').attr('data-id', res[0]);
              stuffTemplate.find('.btn-buy').attr('data-cost', res[3]);
              stuffsRow.append(stuffTemplate.html());
              if (res[5]==true) {
                console.log("num:"+res[0]-stuffNum[1]);
                $('.panel-pet').eq(res[0]-stuffNum[1]).find('button').text('Success').attr('disabled', true);;
              }
            }  
          });
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },

    bindEvents: function() {
      $(document).on('click', '.btn_myPage',Mall.goMyPage);
      $(document).on('click', '.btn-buy', Mall.buyStuff);
      $(document).on('click', '.btn_registerStuff', Mall.registerStuff);
      $(document).on('click', '.btn_delStuff', Mall.deleteStuff);
      $(document).on('click', '.btn_goBack', Mall.goBack);
    },
  
    buyStuff: function(event) {

      var stuffId = parseInt($(event.target).data('id'));
      var tokenAmount=parseInt($(event.target).data('cost'));
      console.log("buystuff",stuffId,tokenAmount);


      Init.contracts.Stuff.deployed().then(function(instance) {
          var stuffInstance = instance;
        // Execute adopt as a transaction by sending account
          return stuffInstance.buy(Mall.address, stuffId,{from: Mall.address, gas:3000000});
      }).then(function(result) {
        alert("Buy success!")
        
        Init.contracts.FixedSupplyToken.deployed().then(function(instance) {
          tokenInstance = instance;
    
        // Execute adopt as a transaction by sending account
          return tokenInstance.SubToken(tokenAmount,{from:Mall.address});
        }).then(function(result) {
          document.getElementById('tokenValue').innerHTML=result.logs[0].args.tokens;
        }).catch(function(err) {
          console.log(err.message);
        });
  
        return Mall.getStuffList();
      }).catch(function(err) {
        alert("Adopt failed :(");
        console.log(err.message);
      });
  
    },
    registerStuff: function(){
      var name=$('#registStuff_name').val();
      var description=$('#registStuff_description').val();
      var cost=$('#registStuff_cost').val();
      
      if (name==""){ alert("ë¹ˆì¹¸?„ ì±„ìš°?‹œ?˜¤.");return; }
      if (description==""){ alert("ë¹ˆì¹¸?„ ì±„ìš°?‹œ?˜¤.");return; }
      if (cost==""){ alert("ë¹ˆì¹¸?„ ì±„ìš°?‹œ?˜¤.");return; }

      $('#registStuff_name').val("");
      $('#registStuff_description').val("");
      $('#registStuff_cost').val("");
      // console.log(Mall.address,name, description,cost);
    
      Init.contracts.Stuff.deployed().then(function(instance){
        var StuffInstance= instance;
        return StuffInstance.registerStuff(Mall.address, name, description, cost,{from:Mall.address, gas:3000000});
      }).then(function(result){
        Mall.getStuffList();
      }).catch(function(error){
        console.log(error);
      });
    },
    deleteStuff: function (){
      var code=$('#delStuff_code').val();

      $('#delStuff_code').val("");
      // console.log(code);
    
      Init.contracts.Stuff.deployed().then(function(instance){
        var StuffInstance= instance;
        return StuffInstance.deleteStuff(code, Mall.address,{from:Mall.address, gas:3000000});
      }).then(function(result){
        Mall.getStuffList();
      }).catch(function(error){
        console.log(error);
      });
    },

    goMyPage: function(){
      // console.log("click mypage");
      location.href="../myPage.html?addr=" +Mall.address ;
    },

    goBack: function(event) {
      location.href="../index.html";
    },
  
  
  };
  
  $(function() {
    $(window).load(function() {
       Mall.init();
    });
  });
  