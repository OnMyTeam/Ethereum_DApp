Mypage = {
  web3Provider: null,
  contracts: {},
  address: 0x0,
  ownAdress: 0x0,
  ownerYN: "N",

  init: async function () {
    Init.init();
    return Mypage.initContract();
  },

  initContract: function () {
    $.getJSON('Stuff.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var StuffArtifact = data;
      Init.contracts.Stuff = TruffleContract(StuffArtifact);
    
      // Set the provider for our contract
      Init.contracts.Stuff.setProvider(Init.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      Mypage.getOwner();
      return Mypage.getStuffList();
    });  
    $.getJSON('Personal.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PersonalArtifact = data;
      Init.contracts.Personal = TruffleContract(PersonalArtifact);

      // Set the provider for our contract
      Init.contracts.Personal.setProvider(Init.web3Provider);
    });
    $.getJSON('Blacklist.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BlackListArtifact = data;
      Init.contracts.BlackList = TruffleContract(BlackListArtifact);

      // Set the provider for our contract
      Init.contracts.BlackList.setProvider(Init.web3Provider);
    });
    $.getJSON('Migrations.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MigrationArtifact = data;
      Init.contracts.Migration = TruffleContract(MigrationArtifact);

      // Set the provider for our contract
      Init.contracts.Migration.setProvider(Init.web3Provider);
    });
    $.getJSON('FixedSupplyToken.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TokenArtifact = data;
      Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);

      // Set the provider for our contract
      Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
      Mypage.address = address;
      return Mypage.getAccountList();
    });
  },

  getAccountList: function () {
    Mypage.getAccountInfo();
    Mypage.getTokenInfo();
    Mypage.bindEvents();
  },

  getAccountInfo: function () {
    // web3.eth.getAccounts(function(error,accounts){

    document.getElementById('accountAddr').innerHTML = Mypage.address;
    web3.eth.getBalance(Mypage.address, function (error, balance) {
      var ether = web3.fromWei(balance.toString());
      document.getElementById('ethValue').innerHTML = ether + " ETH";
     
    });

  },
  getTokenInfo: function () {
    Init.contracts.FixedSupplyToken.deployed().then(function (instance) {
      var tokenInstance = instance;
      account = document.getElementById('accountAddr').innerText;

      return tokenInstance.balanceOf(account, { from: account });
    }).then(function (result) {
      console.log(result.c);
      document.getElementById('tokenValue').innerText = result.c;
    });
  },
  getOwner: function(){
    var StuffInstance;
    Init.contracts.Stuff.deployed().then(function(instance) {
      StuffInstance = instance;

      return StuffInstance.owner.call();
    }).then(function(result) {
      if (result == Mypage.address) {
        Mypage.ownerYN = 'Y';
        console.log(Mypage.ownerYN);
        $("#stuffRegister").css("display", "block");
        $("#stuffRegisterList").css("display", "block");        
      }

    }).catch(function(err) {
      console.log(err.message);
    });
  },
  getBlacklist: function (list) {
    
    document.getElementById("BlackList").innerText = " ";
    var idiv = document.createElement('table');
    document.getElementById("BlackList").appendChild(idiv);

    var total = 0;
    var input = "<tr><td>Account</td></tr>";

    Init.contracts.BlackList.deployed().then(function (instance) {
      var BlackListInstance = instance;
      return BlackListInstance.getBlacklist();
    }).then(function (list) {
      console.log("blacklist: ");
      console.log(list);
      for (var i = 0; i < list.length; i++) {
        if (list[i] != 0x0) input += "<tr><td>" + list[i] + "</td></tr>";
      }
      idiv.innerHTML = input;
    });

  },


  bindEvents: function () {
    // $(document).on('click', '.btn_goBack', Mypage.goBack);
    $(document).on('click', '.add_to_token_button', Mypage.buyToken);
    // $(document).on('click', '.btn_registerBL', Mypage.registerBlackList);
    // $(document).on('click', '.btn_deleteBL', Mypage.deleteBlackList);
    $(document).on('click', '.removehistory', Mypage.deleteMyStuff);
    $(document).on('click', '.removestuff', Mypage.deleteStuff);
    $(document).on('click', '.add_to_item_button', Mypage.registerStuff);
    
  },

  logIn: function (event) {
    let account = document.getElementById('accountAddr').innerText;
    Init.contracts.Personal.deployed().then(function (instance) {
      return instance.getMemberInfo({ from: account });
    }).then(function (result) {
      if (result != 0x0) {
        alert("Log-in success!");
        location.href = "../pet-shop.html?addr=" + result;
      }
      else {
        alert("Please join first!");
      }
    });
  },


  changeSelect: function () {
    var address = document.getElementById('accounts').value;
    document.getElementById('accountAddr').innerHTML = address;
    document.getElementById('ethValue').innerHTML = parseFloat(web3.fromWei(web3.eth.getBalance(address), "ether")) + "ETHER";
  },

  goBack: function (event) {
    location.href = "../pet-shop.html?addr=" + Mypage.address;
  },

  buyToken: function () {
    var token_amount = $('#tokenAmount').val();

    if (token_amount<=0){ alert("1 이상을 입력하시오.");return; }
    
    $('#tokenAmount').val(0);
    var contractAddress = Init.contracts.FixedSupplyToken.address;
    web3.eth.sendTransaction({ from: Mypage.address, to: contractAddress, value: token_amount},
    function (e, r) {

      Mypage.getAccountInfo();
      Mypage.getTokenInfo();
    });
  },
  registerBlackList: function () {
    var regis_account = $("#regisBL_account").val();
    console.log(regis_account);
    $("#regisBL_account").val("");
    Init.contracts.BlackList.deployed().then(function (instance) {
      BlackListInstance = instance;
      return BlackListInstance.blacklisting(regis_account, { from: Mypage.address });
    }).then(function (result) {
      console.log(result);
      Mypage.getBlacklist();
    }).catch(function (error) {
      console.log(error);
    })
  },

  deleteBlackList: function () {
    var del_account = $("#delBL_account").val();
    console.log(del_account);
    $("#delBL_account").val("");
    Init.contracts.BlackList.deployed().then(function (instance) {
      BlackListInstance = instance;
      return BlackListInstance.deleteFromBlacklist(del_account, { from: Mypage.address });
    }).then(function (result) {
      console.log(result);
      Mypage.getBlacklist();
    }).catch(function (error) {
      console.log(error);
    })
  },
  deleteMyStuff: function (event) {
    var index = $(event.target).data('id');
    var StuffInstance;
    Init.contracts.Stuff.deployed().then(function (instance) {
      StuffInstance = instance;
      return StuffInstance.deleteMyStuff(Mypage.address,index, { from: Mypage.address });
    }).then(function (result) {
      console.log("result : "+result);
    
      Mypage.getStuffMyList();
      
    }).catch(function (error) {
      console.log(error);
    })    
  },
  deleteStuff: function (event) {
    var index = $(event.target).data('index');
    console.log(index);
    var StuffInstance;
    Init.contracts.Stuff.deployed().then(function (instance) {
      StuffInstance = instance;
      return StuffInstance.deleteStuff(index, { from: Mypage.address, gas:3000000 });
    }).then(function (result) {
      console.log("result : "+result);
    
      Mypage.getStuffList();
      
    }).catch(function (error) {
      console.log(error);
    })    
  },  
  getStuffList: function(t) {
    var itemrow = $('#regContent');
    var itemTemplate = $('#detailregContent');

    var html = '';
    var StuffInstance;
    Init.contracts.Stuff.deployed().then(function(instance) {
      StuffInstance = instance;
      console.log(Mypage.address);
      return StuffInstance.getStuff({from: Mypage.address, gas:3000000});
    }).then(function(adopters) {
      
      var itemlist = adopters.split('//');
      console.log(itemlist)
      for (i = 0; i < itemlist.length; i++) {
        if(itemlist[i] == ''){
          continue;
        }
        
        var itemInfos = itemlist[i].split(',');
        var itemtitle = itemInfos[3];
        var itemid = itemInfos[0];
        var itemcost = itemInfos[1];
        var imgsrc = itemInfos[2];
 
        var itemIndex = itemInfos[4];
        console.log(itemtitle);
        console.log(itemid);
        console.log(itemIndex);
        // console.log(imgsrc);
        console.log('------------');

        itemTemplate.find('.shop_thumbnail').attr('src', imgsrc);
        itemTemplate.find('.removestuff').attr('data-id', itemid);
        itemTemplate.find('.removestuff').attr('data-index', itemIndex);
        itemTemplate.find('.product-name').text(itemtitle);
        itemTemplate.find('.product-price').text(itemcost+' osdc');
        
        html += '<tr class="cart_item">'+itemTemplate.html()+'</tr>';
        
      }

      itemrow.html(html);
      Mypage.getStuffMyList();
    }).catch(function(err) {
      console.log(err.message);
    });
  },  
  getStuffMyList: function(t) {
    var itemrow = $('#historyContent');
    var itemTemplate = $('#historyDetailContent');

    var html = '';
    var StuffInstance;
    Init.contracts.Stuff.deployed().then(function(instance) {
      StuffInstance = instance;
      console.log(Mypage.address);
      return StuffInstance.getMyStuff(Mypage.address,{from: Mypage.address, gas:3000000});
    }).then(function(adopters) {
      
      var itemlist = adopters.split('//');
      console.log(itemlist)
      for (i = 0; i < itemlist.length; i++) {
        if(itemlist[i] == ''){
          continue;
        }
        
        var itemInfos = itemlist[i].split(',');
        var itemtitle = itemInfos[3];
        var itemid = itemInfos[0];
        var itemcost = itemInfos[1];
        var imgsrc = itemInfos[2];
        var itemIndex = itemInfos[4];
        // console.log(itemtitle);
        // console.log(itemid);
        // console.log(itemcost);
        // console.log(imgsrc);
        // console.log('------------');

        itemTemplate.find('.shop_thumbnail').attr('src', imgsrc);
        itemTemplate.find('.removehistory').attr('data-id', itemIndex);
        itemTemplate.find('.product-name').text(itemtitle);
        itemTemplate.find('.product-price').text(itemcost+' osdc');
        
        html += '<tr class="cart_item">'+itemTemplate.html()+'</tr>';
        
      }

      itemrow.html(html);
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  registerStuff: function(){
   

    var StuffInstance;
    var imgnum = Math.floor((Math.random() * 4)) + 1;
    var name=$('#stuffName').val();
    var cost=$('#stuffCost').val();
    var imgsrc = 'img/product-'+imgnum+'.jpg';
    
    console.log(name);
    console.log(cost);
    console.log(imgsrc);

    Init.contracts.Stuff.deployed().then(function(instance){
      StuffInstance= instance;
      return StuffInstance.registerStuff(name, imgsrc, cost,{from:Mypage.address, gas:3000000});
    }).then(function(result){
      alert('Success!');
      Mypage.getStuffList();
    }).catch(function(error){
      console.log(error);
    });
  },  


};

$(function () {
  $(window).load(function () {
    Mypage.init();
  });
});
