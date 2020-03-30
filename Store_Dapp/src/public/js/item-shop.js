Mall = {
    web3Provider: null,
    contracts: {},
    address: 0x00,
    ownerYN : 'N',  
    itemlist : null,
   
    init: async function() {
      await Init.init();
      Mall.address = address;
      Mall.getAccountList();
      Mall.getItemList();
    },
    
    getAccountList: function () {
      Mall.getGradeInfo();
      Mall.getTokenInfo();
      Mall.getAccountInfo();
      Mall.bindEvents();
    },

    getGradeInfo: function () {
      Init.personalInstance.getGrade(Mall.address,{from: Mall.address}).then(function (result) {        
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
        
        web3.eth.getBalance(Mall.address, function(account, balance) {  
          ether = web3.fromWei(balance, "ether").toFixed(2) + " ETH";
          $('#ethValue').text(ether);
        });
    },
  
    getTokenInfo: function() {
      Init.OSDCTokenInstance.balanceOf(Mall.address,{from:Mall.address}).then(function(result) {
        var token = result.c[0];
        $('#tokenValue').text(token);
      });
    },


    getMyItemList: function() {
      var nitemCode;

      Init.itemInstance.getMyItems(Mall.address,{from: Mall.address, gas:6000000}).then(function(result) {
        const JSONItemlist = JSON.parse(result);
        if (JSONItemlist[0].itemCode == 'X') {
          return;
        }
        for (var i = 0; i < JSONItemlist.length; i++) {
          if(JSONItemlist[i] == '') continue;
          var itemInfos = JSONItemlist[i];
          var itemCode = itemInfos.itemCode;

          $('.single-shop-product').each(function (index, item){
            nitemCode = $(item).data('itemcode');
            if(nitemCode == itemCode){
              $(item).find('button').text('Success').attr('disabled', true);
              $(item).find('.add_to_cart_button').css('background-color', 'green');             
            }
          });
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },

    getItemList: function(t) {
      var itemrow = $('#itemrow');
      var itemTemplate = $('#itemTemplate');

      Init.itemInstance.getItems({from: Mall.address, gas:6000000}).then(function(result) {
        console.log(result);
        const JSONItemlist = JSON.parse(result);
        console.log(JSON.parse(result));
        

        if(JSONItemlist == ''){
          html = "<center><img src='public/images/no_product.png'/></center>";
          itemrow.html(html);
          return;
        }
        for (i = 0; i < JSONItemlist.length; i++) {
          console.log(JSONItemlist[i]);
          if(JSONItemlist[i] == ''){
            continue;
          }
          var itemInfos = JSONItemlist[i];
          var itemName = itemInfos.name;
          var itemCode = itemInfos.itemCode;
          var itemid = itemInfos.id;
          var itemcost = itemInfos.cost;
          var imgsrc = itemInfos.imgsrc;
          // console.log(itemInfos);
          // console.log(imgfile);
          itemTemplate.find('.item-name').text(itemName);
          itemTemplate.find('img').attr('src', 'public/images/' + imgsrc);
          itemTemplate.find('.product-carousel-price-sub').text(itemcost+' osdc');
          itemTemplate.find('.single-shop-product').attr('data-itemcode', itemCode);          
          itemTemplate.find('.add_to_cart_button').attr('data-name', itemName);
          itemTemplate.find('.add_to_cart_button').attr('data-id', itemid);
          itemTemplate.find('.add_to_cart_button').attr('data-itemcode', itemCode);
          itemTemplate.find('.add_to_cart_button').attr('data-cost', itemcost);
          itemTemplate.find('.add_to_cart_button').attr('data-src', 'public/images/' +imgsrc);

          itemrow.append(itemTemplate.html());
        }
        Mall.getMyItemList();
        Mall.getOwner();
      }).catch(function(err) {
        console.log(err.message);
      });
    },

    getOwner: function(){
      Init.itemInstance.owner.call().then(function(result) {
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
      $(document).on('click', '.add_to_cart_button', Mall.buyitem);
    },

    buyitem: async function(event) {
      var index = parseInt($(event.target).data('id'));
      var tokenAmount = parseInt($(event.target).data('cost'));
      Init.itemInstance.itemBuy(Mall.address, index, tokenAmount,{from: Mall.address, gas:3000000}).then(function(result) {
        alert("Success!");
        Mall.getTokenInfo();
        Mall.getMyItemList();
        Mall.getGradeInfo();
      }).catch(function(err) {
        console.log(err.message);
        if(err.message == 'VM Exception while processing transaction: revert need token'){
          alert('토큰이 부족합니다.');
        }else if(err.message =  'VM Exception while processing transaction: revert Already blacklist'){
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
  