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
      // $.getJSON('../items.json', function(data) {
      //   var itemrow = $('#itemrow');
      //   var itemTemplate = $('#itemTemplate');

      //   for (i = 0; i < data.length; i ++) {
      //     itemTemplate.find('.item-title').text(data[i].name);
      //     itemTemplate.find('img').attr('src', data[i].picture);
      //     itemTemplate.find('.product-carousel-price-sub').text(data[i].cost+' osdc');
      //     itemTemplate.find('.add_to_cart_button').attr('data-title', data[i].name);
      //     itemTemplate.find('.add_to_cart_button').attr('data-id', data[i].id);
      //     itemTemplate.find('.add_to_cart_button').attr('data-cost', data[i].cost);
      //     itemTemplate.find('.add_to_cart_button').attr('data-src', data[i].picture);

      //     itemrow.append(itemTemplate.html());
      //   }
      // });

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


    getMyStuffList: async function(t) {
      var StuffInstance;
      Init.contracts.Stuff.deployed().then(function(instance) {
        StuffInstance = instance;

        return StuffInstance.getMyStuff(Mall.address,{from: Mall.address, gas:6000000});
      }).then(function(adopters) {
        var myitemlist = adopters.split('//');
        console.log("mylist");
        console.log(myitemlist);
        for (var i = 0; i < myitemlist.length; i++) {
          if(myitemlist[i] == ''){
            continue;
          }
          var itemInfos = myitemlist[i].split(',');
          var itemtitle = itemInfos[3];
          var itemid = itemInfos[0];
          //var imgsrc = itemInfos[2];
          var itemindex = itemInfos[4];
          // var precode = itemInfos[5];
          console.log(itemtitle);
          console.log("itemid " + itemid);
          console.log("itemindex "+ itemindex);
          // console.log(precode);
     
          console.log('------------');
          $('.single-shop-product').each(function (index, item){
            var stuffcode = $(item).data('stuffcode');
            console.log("code" + stuffcode + "itemed" + itemid);
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
        // console.log("===== result ======");
        // console.log(result);
        if(result == ''){
          html = "<center><img src='img/no_product.png'/></center>";
          itemrow.html(html);
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
          var imgsrc = itemInfos[2];
          console.log(itemtitle);
          console.log(itemid);
          console.log(itemcost);
          console.log(imgsrc);
          console.log('------------');
          
          itemTemplate.find('.item-title').text(itemtitle);
          itemTemplate.find('img').attr('src', imgsrc);
          itemTemplate.find('.product-carousel-price-sub').text(itemcost+' osdc');
          itemTemplate.find('.single-shop-product').attr('data-stuffcode', itemid);          
          itemTemplate.find('.add_to_cart_button').attr('data-title', itemtitle);
          itemTemplate.find('.add_to_cart_button').attr('data-id', index);
          itemTemplate.find('.add_to_cart_button').attr('data-stuffcode', itemid);
          itemTemplate.find('.add_to_cart_button').attr('data-cost', itemcost);
          itemTemplate.find('.add_to_cart_button').attr('data-src', imgsrc);

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
  
    buyStuff: function(event) {

      var title = $(event.target).data('title');
      var index = parseInt($(event.target).data('id'));
      var tokenAmount = parseInt($(event.target).data('cost'));
      var stuffcode = parseInt($(event.target).data('stuffcode'));
      var imgSrc = $(event.target).data('src');
      console.log(title);
      // console.log(index);

      console.log(stuffcode);
      // console.log(imgSrc);

      var StuffInstance;
      var account = Mall.address;
      console.log("account"+account);
      var isAdoption;
      Init.contracts.Stuff.deployed().then(function(instance) {
          StuffInstance = instance;
        // Execute adopt as a transaction by sending account
          return StuffInstance.stuffbuy(account, index, title, imgSrc, tokenAmount,{from: account, gas:3000000});
      }).then(function(result) {
        alert("Success!");
        
        Init.contracts.FixedSupplyToken.deployed().then(function(instance) {
          var tokenInstance = instance;
    
        // Execute adopt as a transaction by sending account
          return tokenInstance.SubToken(tokenAmount,{from:account});
        }).then(function(result) {
          console.log(result);
          console.log(result.logs[0].args.tokens.c[1]);
          // document.getElementById('tokenValue').innerHTML=result.logs[0].args.tokens.c[1];
        }).catch(function(err) {
          console.log(err.message);
        });

        return Mall.getMyStuffList();
      }).catch(function(err) {
        alert("Adopt failed :(");
        console.log(err);
      });
  
    }

  
  };
  
  $(function() {
    $(window).load(function() {
      Mall.init();
    });
  });
  