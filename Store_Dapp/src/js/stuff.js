Mall = {
    web3Provider: null,
    contracts: {},
    address: 0x00,
  
    init: async function() {
      Init.init();
      Mall.bindEvents();
      return await Mall.initContract();
    },
  
    initContract: function() {
    $.getJSON('../items.json', function(data) {
      var itemrow = $('#itemrow');
      var itemTemplate = $('#itemTemplate');

      for (i = 0; i < data.length; i ++) {
        itemTemplate.find('.item-title').text(data[i].name);
        itemTemplate.find('img').attr('src', data[i].picture);
        itemTemplate.find('.product-carousel-price-sub').text(data[i].cost+' osdc');
        itemTemplate.find('.add_to_cart_button').attr('data-title', data[i].name);
        itemTemplate.find('.add_to_cart_button').attr('data-id', data[i].id);
        itemTemplate.find('.add_to_cart_button').attr('data-cost', data[i].cost);
        itemTemplate.find('.add_to_cart_button').attr('data-src', data[i].picture);

        itemrow.append(itemTemplate.html());
      }
    });

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

        // document.getElementById('accountAddr').innerHTML=Mall.address;
        // web3.eth.getBalance(Mall.address, function(account,balance){
        //     document.getElementById('ethValue').innerHTML=web3.fromWei(balance.toString()) + "ETH";
        //     return Mall.bindEvents();
        // });
    },
  
    getTokenInfo: function(){
      // Init.contracts.FixedSupplyToken.deployed().then(function(instance){
      //   var tokenInstance = instance;

      //   return tokenInstance.balanceOf(Mall.address,{from:Mall.address});
      // }).then(function(result) {
      //   document.getElementById('tokenValue').innerText=result.c;
      // });
    },

    getStuffList: function(t) {
      var adoptionInstance;
      // Init.contracts.Adoption.deployed().then(function(instance) {
      //   var result = instance.getAdopters(PetShop.address,{from: PetShop.address, gas:10000000});
      //   console.log(result);
      // });
      
      
      // return;
      Init.contracts.Stuff.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.getAdopters(Mall.address,{from: Mall.address, gas:6000000});
      }).then(function(adopters) {
        var itemlist = adopters.split(',,,,');
        console.log(itemlist)
        for (i = 0; i < itemlist.length; i++) {
          if(itemlist[i] == ''){
            continue;
          }
          var itemInfos = itemlist[i].split('//');
          var itemtitle = itemInfos[3];
          var itemid = itemInfos[0];
          var itemcost = itemInfos[1];
          var imgsrc = itemInfos[2];
          console.log(itemtitle);
          console.log(itemid);
          console.log(itemcost);
          console.log(imgsrc);
          console.log('------------');
          

          $('.single-shop-product').eq(itemid - 1).find('button').text('Success').attr('disabled', true);
          $('.add_to_cart_button').eq(itemid - 1).css('background-color', 'green');
          
        }
      }).catch(function(err) {
        console.log(err.message);
      });

    },

    bindEvents: function() {
      $(document).on('click', '.btn_myPage',Mall.goMyPage);
      // $(document).on('click', '.btn-buy', Mall.buyStuff);
      $(document).on('click', '.btn_registerStuff', Mall.registerStuff);
      $(document).on('click', '.btn_delStuff', Mall.deleteStuff);
      $(document).on('click', '.btn_goBack', Mall.goBack);
      $(document).on('click', '.add_to_cart_button', Mall.buyStuff);

    },
  
    buyStuff: function(event) {
      console.log(111);
      var title = $(event.target).data('title');
      var stuffCode = parseInt($(event.target).data('id'));
      var tokenAmount = parseInt($(event.target).data('cost'));
      var imgSrc = $(event.target).data('src');
      console.log(title);
      console.log(stuffCode);
      console.log(tokenAmount);
      console.log(imgSrc);

      var StuffInstance;
      var account = Mall.address;
      console.log(account);
      var isAdoption;
      Init.contracts.Stuff.deployed().then(function(instance) {
          StuffInstance = instance;
        // Execute adopt as a transaction by sending account
          return StuffInstance.adopt(account, stuffCode, tokenAmount, imgSrc, title,{from: account, gas:3000000});
      }).then(function(result) {
        alert("Adopt success!")
        
        Init.contracts.FixedSupplyToken.deployed().then(function(instance) {
          tokenInstance = instance;
    
        // Execute adopt as a transaction by sending account
          return tokenInstance.SubToken(tokenAmount,{from:account});
        }).then(function(result) {
          console.log(result);
          console.log(result.logs[0].args.tokens.c[1]);
          // document.getElementById('tokenValue').innerHTML=result.logs[0].args.tokens.c[1];
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
      
      // if (name==""){ alert("빈칸?�� 채우?��?��.");return; }
      // if (description==""){ alert("빈칸?�� 채우?��?��.");return; }
      // if (cost==""){ alert("빈칸?�� 채우?��?��.");return; }

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
  