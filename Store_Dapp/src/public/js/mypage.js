Mypage = {
  web3Provider: null,
  contracts: {},
  address: 0x0,
  ownAdress: 0x0,
  ownerYN: "N",

  init: async function () {
    Init.init();
    Mypage.address = address;
    return Mypage.initContract();
  },

  initContract: function () {
    $.getJSON('Item.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ItemArtifact = data;
      Init.contracts.Item = TruffleContract(ItemArtifact);

      // Set the provider for our contract
      Init.contracts.Item.setProvider(Init.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      Mypage.getOwner();
      return Mypage.getItemList();
    });
    $.getJSON('Personal.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PersonalArtifact = data;
      Init.contracts.Personal = TruffleContract(PersonalArtifact);

      // Set the provider for our contract
      Init.contracts.Personal.setProvider(Init.web3Provider);
      return Mypage.getMemberList();

    });
    $.getJSON('BlackList.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BlackListArtifact = data;
      Init.contracts.BlackList = TruffleContract(BlackListArtifact);

      // Set the provider for our contract
      Init.contracts.BlackList.setProvider(Init.web3Provider);
      return Mypage.getBlackList();
    });
    $.getJSON('Migrations.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MigrationArtifact = data;
      Init.contracts.Migration = TruffleContract(MigrationArtifact);

      // Set the provider for our contract
      Init.contracts.Migration.setProvider(Init.web3Provider);
    });
    $.getJSON('OSDCToken.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TokenArtifact = data;
      Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);

      // Set the provider for our contract
      Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
      
      return Mypage.getAccountList();
    });
  },

  getAccountList: function () {
    Mypage.getGradeInfo();
    Mypage.getAccountInfo();
    Mypage.getTokenInfo();
    Mypage.bindEvents();
  },
  getGradeInfo: function () {


    var personalInstance;

    Init.contracts.Personal.deployed().then(function (instance) {
      personalInstance = instance;
      return personalInstance.getGrade(Mypage.address, { from: Mypage.address });
    }).then(function (result) {
      console.log(result);
      if (result == 'Bronze') {
        $('#accountGrade').html("<font color='bronze'><b>Bronze</b></font>");
      } else if (result == 'Silver') {
        $('#accountGrade').html("<font color='silver'><b>Silver</b></font>");
      } else if (result == 'Gold') {
        $('#accountGrade').html("<font color='gold'><b>Gold</b></font>");
      }
    });

  },
  getAccountInfo: function () {

    document.getElementById('accountAddr').innerHTML = Mypage.address;
    web3.eth.getBalance(Mypage.address, function (error, balance) {
      var ether = web3.fromWei(balance, "ether");
      document.getElementById('ethValue').innerHTML = ether.toFixed(2) + " ETH";

    });

  },
  getTokenInfo: function () {
    Init.contracts.FixedSupplyToken.deployed().then(function (instance) {
      var tokenInstance = instance;
      account = document.getElementById('accountAddr').innerText;

      return tokenInstance.balanceOf(account, { from: account });
    }).then(function (result) {
      document.getElementById('tokenValue').innerText = result.c;
    });
  },
  getOwner: function () {
    var ItemInstance;
    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;

      return ItemInstance.owner.call();
    }).then(function (result) {

      if (result == Mypage.address) {
        Mypage.ownerYN = 'Y';
        $("#accountAddrAdmin").text('Account Address(admin)');
        $("#itemRegister").css("display", "block");
        $("#itemRegisterList").css("display", "block");
        $("#memberList").css("display", "block");
        $("#BlackList").css("display", "block");
      }
      else {
        $("#accountAddrAdmin").text('Account Address(member)');
      }

    }).catch(function (err) {

      console.log(err.message);
    });
  },



  bindEvents: function () {

    $(document).on('click', '.add_to_token_button', Mypage.buyToken);
    $(document).on('click', '.removehistory', Mypage.deleteMyItem);
    $(document).on('click', '.removeItem', Mypage.deleteItem);
    $(document).on('click', '.removeBlackList', Mypage.deleteBlackList);
    $(document).on('click', '.add_to_item_button', Mypage.registerItem);
    $(document).on('click', '.add_to_BlackList_button', Mypage.registerBlackList);
    $(document).on('click', '.withdrawal_button', Mypage.withdrawal);
  },


  buyToken: function () {
    var token_amount = $('#tokenAmount').val();

    if (token_amount <= 0) { alert("1 이상을 입력하시오."); return; }

    $('#tokenAmount').val(0);
    var contractAddress = Init.contracts.FixedSupplyToken.address;

    web3.eth.sendTransaction({ from: Mypage.address, to: contractAddress, value: token_amount },
      function (e, r) {

        Mypage.getAccountInfo();
        Mypage.getTokenInfo();
      });
  },
  registerBlackList: function (event) {


    var account = $(event.target).data('address');
    console.log(account);

    var BlackListInstance;
    Init.contracts.BlackList.deployed().then(function (instance) {
      BlackListInstance = instance;
      return BlackListInstance.setBlackList(account, { from: Mypage.address });
    }).then(function (result) {
      console.log("result, " + result);

      Mypage.getBlackList();
    }).catch(function (error) {
      if (error.message == 'VM Exception while processing transaction: revert already BlackList') {
        alert('Already register BlackList');
      }
      console.log(error.message);
    });

  },
  getMemberList: function () {
    var itemrow = $('#memberListContent');
    var itemTemplate = $('#detailmemberListContent');
    var html = '';
    var Personal;

    Init.contracts.Personal.deployed().then(function (instance) {
      Personal = instance;
      return Personal.getMemberList();
    }).then(function (list) {

      for (var i = 0; i < list.length; i++) {
        if (list[i] != 0x0) {

          itemTemplate.find('.add_to_BlackList_button').attr('data-id', i);
          itemTemplate.find('.add_to_BlackList_button').attr('data-address', list[i]);
          itemTemplate.find('.product-name').text(list[i]);

          html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';
        }
      }
      itemrow.html(html);

    });

  },
  getBlackList: function () {
    var itemrow = $('#BlackListContent');
    var itemTemplate = $('#detailBlackListContent');
    var html = '';
    var BlackListInstance;

    Init.contracts.BlackList.deployed().then(function (instance) {
      BlackListInstance = instance;
      return BlackListInstance.getBlackList();
    }).then(function (list) {

      for (var i = 0; i < list.length; i++) {
        if (list[i] != 0x0) {

          itemTemplate.find('.removeBlackList').attr('data-id', i);
          itemTemplate.find('.removeBlackList').attr('data-address', list[i]);
          itemTemplate.find('.product-name').text(list[i]);

          html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';
        }
      }
      itemrow.html(html);

    });

  },
  deleteBlackList: function () {
    var index = $(event.target).data('id');
    var address = $(event.target).data('address');

    Init.contracts.BlackList.deployed().then(function (instance) {
      BlackListInstance = instance;
      return BlackListInstance.deleteBlackList(address, index, { from: Mypage.address });
    }).then(function (result) {
      console.log(result);
      Mypage.getBlackList();
    }).catch(function (error) {
      console.log(error);
    })
  },
  deleteMyItem: function (event) {
    var index = $(event.target).data('id');
    var ItemInstance;
    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;
      return ItemInstance.deleteMyItem(Mypage.address, index, { from: Mypage.address });
    }).then(function (result) {
      console.log("result : " + result);

      Mypage.getItemMyList();

    }).catch(function (error) {
      console.log(error);
    })
  },
  deleteItem: function (event) {
    var index = $(event.target).data('index');
    console.log(index);
    var ItemInstance;
    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;
      return ItemInstance.deleteItem(index, { from: Mypage.address, gas: 3000000 });
    }).then(function (result) {
      console.log("result : " + result);

      Mypage.getItemList();

    }).catch(function (error) {
      console.log(error);
    })
  },
  getItemList: function (t) {
    var itemrow = $('#ItemCotent');
    var itemTemplate = $('#detailItemContent');

    var html = '';
    var ItemInstance;
    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;
      console.log(Mypage.address);
      return ItemInstance.getItems({ from: Mypage.address, gas: 3000000 });
    }).then(function (result) {
      if (result == '') {
        html += "<tr class='cart_item'>";
        html += "<td colspan='4'><center><img src='public/images/no_product.png'/></center> </td>";
        html += "</tr>";
      }
      var itemlist = result.split('//');
      console.log(itemlist)
      for (i = 0; i < itemlist.length; i++) {
        if (itemlist[i] == '') {
          continue;
        }

        var itemInfos = itemlist[i].split(',');
        var itemtitle = itemInfos[3];
        var itemid = itemInfos[0];
        var itemcost = itemInfos[1];
        var imgfile = itemInfos[2];

        var itemIndex = itemInfos[4];



        itemTemplate.find('.shop_thumbnail').attr('src', 'public/images/' + imgfile);
        itemTemplate.find('.removeItem').attr('data-id', itemid);
        itemTemplate.find('.removeItem').attr('data-index', itemIndex);
        itemTemplate.find('.product-name').text(itemtitle);
        itemTemplate.find('.product-price').text(itemcost + ' osdc');

        html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';

      }

      itemrow.html(html);
      Mypage.getItemMyList();
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  getItemMyList: function (t) {
    var itemrow = $('#historyContent');
    var itemTemplate = $('#historyDetailContent');

    var html = '';
    var ItemInstance;
    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;
      console.log(Mypage.address);
      return ItemInstance.getMyItems(Mypage.address, { from: Mypage.address, gas: 3000000 });
    }).then(function (result) {
      if (result == '') {
        html += "<tr class='cart_item'>";
        html += "<td colspan='4'><center><img src='public/images/no_product.png'/></center> </td>";
        html += "</tr>";
      }
      var itemlist = result.split('//');
      console.log(itemlist)
      for (i = 0; i < itemlist.length; i++) {
        if (itemlist[i] == '') {
          continue;
        }

        var itemInfos = itemlist[i].split(',');
        var itemtitle = itemInfos[3];
        var itemid = itemInfos[0];
        var itemcost = itemInfos[1];
        var imgfile = itemInfos[2];
        var itemIndex = itemInfos[4];


        itemTemplate.find('.shop_thumbnail').attr('src', 'public/images/' + imgfile);
        itemTemplate.find('.removehistory').attr('data-id', itemIndex);
        itemTemplate.find('.product-name').text(itemtitle);
        itemTemplate.find('.product-price').text(itemcost + ' osdc');

        html += '<tr class="cart_item">' + itemTemplate.html() + '</tr>';

      }

      itemrow.html(html);
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  registerItem: function () {


    var ItemInstance;
    var imgnum = Math.floor((Math.random() * 4)) + 1;
    var name = $('#ItemName').val();
    var cost = $('#ItemCost').val();
    var imgfile = 'product-' + imgnum + '.jpg';



    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;
      return ItemInstance.registerItem(name, imgfile, cost, { from: Mypage.address, gas: 3000000 });
    }).then(function (result) {
      alert('Success!');
      Mypage.getItemList();
    }).catch(function (error) {
      console.log(error);
    });
  },
  withdrawal: function () {



    Init.contracts.Item.deployed().then(function (instance) {
      ItemInstance = instance;
      return ItemInstance.withdrawal(Mypage.address, { from: Mypage.address, gas: 3000000 });
    }).then(function (result) {
      alert('Success!');
      location.href = '/';
    }).catch(function (error) {
      console.log(error);
    });
  },

};

$(function () {
  $(window).load(function () {
    Mypage.init();
  });
});
