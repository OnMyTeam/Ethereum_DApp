Mypage = {
  web3Provider: null,
  contracts: {},
  address: 0x0,
  ownAdress: 0x0,
  ownerYN: "N",

  init: async function() {
    await Init.init();
    Mypage.address = address;
    Mypage.getAccountList();
    Mypage.getPersonalFunction();
  },

  getAccountList: function() {
    Mypage.getGradeInfo();
    Mypage.getAccountInfo();
    Mypage.getTokenInfo();
    Mypage.bindEvents();
  },

  getPersonalFunction: function() {
    Mypage.getOwner();
    Mypage.getItemList();
    Mypage.getMemberList();
    Mypage.getBlacklist();
  },
  
  getGradeInfo: function() {
    var membershipInstance;

    Init.membershipInstance.getGrade(Mypage.address, { from: Mypage.address }).then(function (result) {
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
    document.getElementById('accountAddr').innerHTML = Mypage.address;
    web3.eth.getBalance(Mypage.address, function (error, balance) {
      var ether = web3.fromWei(balance, "ether");
      document.getElementById('ethValue').innerHTML = ether.toFixed(2) + " ETH";
    });
  },

  getTokenInfo: function() {
    var account = document.getElementById('accountAddr').innerText;
    Init.OSDCTokenInstance.balanceOf(account, { from: account }).then(function (result) {
      document.getElementById('tokenValue').innerText = result.c;
    });
  },

  getOwner: function() {
    Init.itemInstance.owner.call().then(function (result) {
      if (result == Mypage.address) {
        Mypage.ownerYN = 'Y';
        $("#accountAddrAdmin").text('Account Address(admin)');
        $("#itemRegister").css("display", "block");
        $("#itemRegisterList").css("display", "block");
        $("#memberList").css("display", "block");
        $("#blacklist").css("display", "block");
      }
      else {
        $("#accountAddrAdmin").text('Account Address(member)');
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  bindEvents: function() {
    $(document).on('click', '.add_to_token_button', Mypage.buyToken);
    $(document).on('click', '.removehistory', Mypage.deleteMyItem);
    $(document).on('click', '.removeItem', Mypage.deleteItem);
    $(document).on('click', '.removeBlacklist', Mypage.deleteBlacklist);
    $(document).on('click', '.add_to_item_button', Mypage.registerItem);
    $(document).on('click', '.add_to_Blacklist_button', Mypage.registerBlacklist);
    $(document).on('click', '.withdrawal_button', Mypage.withdrawal);
  },

  buyToken: function() {
    var token_amount = $('#tokenAmount').val();
    if (token_amount <= 0) { alert("1 이상을 입력하시오."); return; }
    $('#tokenAmount').val(0);
    var contractAddress = Init.contracts.FixedSupplyToken.address;

    web3.eth.sendTransaction({ from: Mypage.address, to: contractAddress, value: token_amount },
      function (e, r) {
        alert("토큰 구매에 성공하셨습니다.");
        Mypage.getAccountInfo();
        Mypage.getTokenInfo();
      });
  },

  registerBlacklist: function(event) {
    var account = $(event.target).data('address');

    Init.membershipInstance.setBlacklist(account, { from: Mypage.address }).then(function (result) {
      Mypage.getBlacklist();
    }).catch(function (error) {
      if (error.message == 'VM Exception while processing transaction: revert already blacklist') {
        alert('Already register blacklist');
      }
      console.log(error.message);
    });
  },
  
  getMemberList: function() {
    var itemrow = $('#memberListContent');
    var itemTemplate = $('#detailmemberListContent');
    var html = '';

    Init.membershipInstance.getMemberList().then(function (list) {
      for (var i = 0; i < list.length; i++) {
        console.log("list[i]" + Mypage.address);
        if (list[i] != Mypage.address || list[i] != 0x0 ) {
          itemTemplate.find('.add_to_Blacklist_button').attr('data-id', i);
          itemTemplate.find('.add_to_Blacklist_button').attr('data-address', list[i]);
          itemTemplate.find('.product-name').text(list[i]);

          html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';
        }
      }
      itemrow.html(html);
    });
  },

  getBlacklist: function() {
    var itemrow = $('#BlacklistContent');
    var itemTemplate = $('#detailBlacklistContent');
    var html = '';
    
    Init.membershipInstance.getBlacklist().then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] != 0x0) {

          itemTemplate.find('.removeBlacklist').attr('data-id', i);
          itemTemplate.find('.removeBlacklist').attr('data-address', list[i]);
          itemTemplate.find('.product-name').text(list[i]);

          html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';
        }
      }
      itemrow.html(html);
    });
  },

  deleteBlacklist: function() {
    var index = $(event.target).data('id');
    var address = $(event.target).data('address');

    Init.membershipInstance.deleteBlacklist(address, index, { from: Mypage.address }).then(function (result) {
      Mypage.getBlacklist();
    }).catch(function (error) {
      console.log(error);
    })
  },

  deleteMyItem: function(event) {
    var index = $(event.target).data('id');

    Init.itemInstance.deleteMyItem(Mypage.address, index, { from: Mypage.address }).then(function (result) {
      Mypage.getMyItemList();
    }).catch(function (error) {
      console.log(error);
    })
  },

  deleteItem: function(event) {
    var itemcode = $(event.target).data('itemcode');
  
    Init.itemInstance.deleteItem(itemcode, { from: Mypage.address, gas: 3000000 }).then(function (result) {
      Mypage.getItemList();
    }).catch(function (error) {
      console.log(error);
    })
  },

  getItemList: function() {
    var itemrow = $('#ItemCotent');
    var itemTemplate = $('#detailItemContent');
    var html = '';
   
    Init.itemInstance.getItems({ from: Mypage.address, gas: 3000000 }).then(function (result) {
      const JSONItemlist = JSON.parse(result);

      if (JSONItemlist == '') {
        html += "<tr class='cart_item'>";
        html += "<td colspan='4'><center><img src='public/images/no_product.png'/></center> </td>";
        html += "</tr>";
      }
      
      for (i = 0; i<JSONItemlist.length; i++) {
        if (JSONItemlist[i] == '') {
          continue;
        }

        var itemInfos = JSONItemlist[i];
        itemTemplate.find('.shop_thumbnail').attr('src', 'public/images/' + itemInfos.imgsrc);
        itemTemplate.find('.removeItem').attr('data-itemcode', itemInfos.itemCode);
        // itemTemplate.find('.removeItem').attr('data-index', itemInfos.id);
        itemTemplate.find('.product-name').text(itemInfos.name);
        itemTemplate.find('.product-price').text(itemInfos.cost + ' osdc');

        html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';
      }
      itemrow.html(html);
      Mypage.getMyItemList();
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  
  getMyItemList: function() {
    var itemrow = $('#historyContent');
    var itemTemplate = $('#historyDetailContent');

    var html = '';
    Init.itemInstance.getMyItems(Mypage.address, { from: Mypage.address, gas: 3000000 }).then(function (result) {
      const JSONItemlist = JSON.parse(result);
      console.log(JSONItemlist);
      if (JSONItemlist[0].itemCode == 'X') {
        html += "<tr class='cart_item'>";
        html += "<td colspan='4'><center><img src='public/images/no_product.png'/></center> </td>";
        html += "</tr>";
      }
      
      for (i = 0; i < JSONItemlist.length; i++) {
        if (JSONItemlist[i].itemCode == 'X') { continue; }
        var itemInfos = JSONItemlist[i];

        itemTemplate.find('.shop_thumbnail').attr('src', 'public/images/' + itemInfos.imgsrc);
        itemTemplate.find('.removehistory').attr('data-id', itemInfos.id);
        itemTemplate.find('.product-name').text(itemInfos.name);
        itemTemplate.find('.product-price').text(itemInfos.cost + ' osdc');
        html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';
      }
      itemrow.html(html);
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  registerItem: function() {
    var imgnum = Math.floor((Math.random() * 4)) + 1;
    var name = $('#ItemName').val();
    var cost = $('#ItemCost').val();
    var imgfile = 'product-' + imgnum + '.jpg';

    Init.itemInstance.registerItem(name, imgfile, cost, { from: Mypage.address, gas: 3000000 }).then(function (result) {
      alert('Success!');
      Mypage.getItemList();
    }).catch(function(error) {
      console.log(error);
    });
  },

  withdrawal: function() {
    Init.itemInstance.withdrawal(Mypage.address, { from: Mypage.address, gas: 3000000 }).then(function (result) {
      alert('Success!');
      location.href = '/';
    }).catch(function (error) {
      console.log(error);
    });
  }
};

$(function() {
  $(window).load(function() {
    Mypage.init();
  });
});
