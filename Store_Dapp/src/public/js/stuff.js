Mall = {
    web3Provider: null,
    contracts: {},
    address: 0x00,
    ownerYN : 'N',  
    itemlist : null,
    init: async function() {
      Init.init();
      Mall.address = address;
      return await Mall.initContract();
    },
  
    initContract: function() {
      $.getJSON('Personal.json', function (data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var PersonalArtifact = data;
        Init.contracts.Personal = TruffleContract(PersonalArtifact);

        // Set the provider for our contract
        Init.contracts.Personal.setProvider(Init.web3Provider);
        
        // Use our contract to retrieve and mark the adopted pets

      });      
      $.getJSON('BlackList.json', function (data) {
       
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var BlackListArtifact = data;
      
        Init.contracts.BlackList = TruffleContract(BlackListArtifact);
       
        // Set the provider for our contract
        Init.contracts.BlackList.setProvider(Init.web3Provider);
        
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
          return Mall.getAccountList();

          
      });
     
    },
    
    getAccountList: function () {
      Mall.getGradeInfo();
      Mall.getTokenInfo();
      Mall.getAccountInfo();
      Mall.bindEvents();
    },
    getGradeInfo: function () {


      var personalInstance;

      Init.contracts.Personal.deployed().then(function (instance) {
        personalInstance = instance;
        return personalInstance.getGrade(Mall.address, { from: Mall.address });
      }).then(function (result) {
        
        if (result == 'Bronze') {
          $('#accountGrade').html("<font color='bronze'><b>Bronze</b></font>");
        } else if (result == 'Silver') {
          $('#accountGrade').html("<font color='silver'><b>Silver</b></font>");
        } else if (result == 'Gold') {
          $('#accountGrade').html("<font color='gold'><b>Gold</b></font>");
        }
      });

    },     
    getAccountInfo: function() {
        var ether;
        $('#accountAddr').text(Mall.address);
        
        web3.eth.getBalance(Mall.address, function(account, balance){
          
          ether = web3.fromWei(balance, "ether").toFixed(2) + " ETH";
          $('#ethValue').text(ether);

        });
    },
  
    getTokenInfo: function(){
      Init.contracts.FixedSupplyToken.deployed().then(function(instance){
        var tokenInstance = instance;

        return tokenInstance.balanceOf(Mall.address,{from:Mall.address});
      }).then(function(result) {
        var token = result.c[0];
        $('#tokenValue').text(token);
      });
    },


    getMyStuffList: function() {
      var StuffInstance;
      var stuffcode;
      Init.contracts.Stuff.deployed().then(function(instance) {
        StuffInstance = instance;

        return StuffInstance.getMyStuff(Mall.address,{from: Mall.address, gas:6000000});
      }).then(function(result) {
        var myItemList = result.split('//');

        for (var i = 0; i < myItemList.length; i++) {
          if(myItemList[i] == ''){
            continue;
          }
          var itemInfos = myItemList[i].split(',');
          var itemid = itemInfos[0];

          $('.single-shop-product').each(function (index, item){
            stuffcode = $(item).data('stuffcode');
            
            if(stuffcode == itemid){
              $(item).find('button').text('Success').attr('disabled', true);
              $(item).find('.add_to_cart_button').css('background-color', 'green');             
            }

          });
          
        }
      }).catch(function(err) {
        console.log(err.message);
      });

    },

    getStuffList: async function(t) {
      var itemrow = $('#itemrow');
      var itemTemplate = $('#itemTemplate');

      var StuffInstance;
      Init.contracts.Stuff.deployed().then(function(instance) {
        StuffInstance = instance;

        return StuffInstance.getStuff({from: Mall.address, gas:6000000});
      }).then(function(result) {

        var result = result.split('//');

        if(result == ''){
          html = "<center><img src='public/images/no_product.png'/></center>";
          itemrow.html(html);
          return;
        }
        for (i = 0; i < result.length; i++) {
          if(result[i] == ''){
            continue;
          }
          var itemInfos = result[i].split(',');
          var itemtitle = itemInfos[3];
          var itemid = itemInfos[0];
          var index = itemInfos[4];
          var itemcost = itemInfos[1];
          var imgfile = itemInfos[2];
          
          itemTemplate.find('.item-title').text(itemtitle);
          itemTemplate.find('img').attr('src', 'public/images/' + imgfile);
          itemTemplate.find('.product-carousel-price-sub').text(itemcost+' osdc');
          itemTemplate.find('.single-shop-product').attr('data-stuffcode', itemid);          
          itemTemplate.find('.add_to_cart_button').attr('data-title', itemtitle);
          itemTemplate.find('.add_to_cart_button').attr('data-id', index);
          itemTemplate.find('.add_to_cart_button').attr('data-stuffcode', itemid);
          itemTemplate.find('.add_to_cart_button').attr('data-cost', itemcost);
          itemTemplate.find('.add_to_cart_button').attr('data-src', 'public/images/' +imgfile);

          itemrow.append(itemTemplate.html());
          
        }
        Mall.getMyStuffList();
        Mall.getOwner();
      }).catch(function(err) {
        console.log(err.message);
      });

    },
    getOwner: function(){
      var StuffInstance;
      Init.contracts.Stuff.deployed().then(function(instance) {
        StuffInstance = instance;

        return StuffInstance.owner.call();
      }).then(function(result) {
        if (result == Mall.address) {
          Mall.ownerYN = 'Y';
          $("#accountAddrAdmin").text('Account Address(admin)');
        }else{
          $("#accountAddrAdmin").text('Account Address(member)');
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },

    bindEvents: function() {

      $(document).on('click', '.add_to_cart_button', Mall.buyStuff);
      
    },
  
    buyStuff: async function(event) {

      
      var index = parseInt($(event.target).data('id'));
      var tokenAmount = parseInt($(event.target).data('cost'));
      var StuffInstance;
      Init.contracts.Stuff.deployed().then(function(instance) {
      
          StuffInstance = instance;
        // Execute adopt as a transaction by sending account
          return StuffInstance.stuffbuy(Mall.address, index, tokenAmount,{from: Mall.address, gas:3000000});
      }).then(function(result) {
        alert("Success!");
        Mall.getTokenInfo();
        Mall.getMyStuffList();
        Mall.getGradeInfo();
      }).catch(function(err) {

        
        console.log(err.message);
        if(err.message == 'VM Exception while processing transaction: revert need token'){
          alert('토큰이 부족합니다.');
        }else if('VM Exception while processing transaction: revert Already blacklist'){
          alert('블랙리스트로 등록되어 물건을 구매 할 수 없습니다.');
        }

      });

    }

  
  };
  
  $(function() {
    $(window).load(function() {
      Mall.init();
    });
  });
  