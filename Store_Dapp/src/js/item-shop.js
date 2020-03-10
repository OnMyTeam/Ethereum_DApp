PetShop = {
  web3Provider: null,
  contracts: {},
  address: 0x00,

  init: async function() {
    // Load pets.
    $.getJSON('../items.json', function(data) {
      var itemrow = $('#itemrow');
      var itemTemplate = $('#itemTemplate');

      for (i = 0; i < data.length; i ++) {
        itemTemplate.find('.item-title').text(data[i].name);
        itemTemplate.find('img').attr('src', data[i].picture);
        itemTemplate.find('.product-carousel-price-sub').text(data[i].cost);
        itemTemplate.find('.add_to_cart_button').attr('data-id', data[i].id);
        itemTemplate.find('.add_to_cart_button').attr('data-cost', data[i].cost);

        itemrow.append(itemTemplate.html());
      }
    });
    Init.init();
    return await PetShop.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      Init.contracts.Adoption = TruffleContract(AdoptionArtifact);
    
      // Set the provider for our contract
      Init.contracts.Adoption.setProvider(Init.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return PetShop.markAdopted();
    });
    $.getJSON('FixedSupplyToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TokenArtifact = data;
      Init.contracts.FixedSupplyToken = TruffleContract(TokenArtifact);
    
      // Set the provider for our contract
      Init.contracts.FixedSupplyToken.setProvider(Init.web3Provider);
      PetShop.getTokenInfo();
    });
    PetShop.getAccountInfo();
  },
  
  setToNum: function(num){
    return Number(num).toPrecision(50).toString().split('.')[0];
  },

  
  getAccountInfo: function() {
    web3.eth.getAccounts(function(error,accounts){
      
      PetShop.address=url;
      document.getElementById('accountAddr').innerHTML=PetShop.address;
      web3.eth.getBalance(PetShop.address, function(account,balance){
        var ether = web3.fromWei(balance.toString());
        document.getElementById('ethValue').innerHTML=ether.toFixed(2) + "ETH";
        PetShop.getTokenInfo();
        return PetShop.bindEvents();
      });
    });
    
  },

  getTokenInfo: function(){

    Init.contracts.FixedSupplyToken.deployed().then(function(instance){
      var tokenInstance = instance;
      account=document.getElementById('accountAddr').innerText;
    // Execute adopt as a transaction by sending account

      return tokenInstance.balanceOf(account,{from:account});
    }).then(function(result) {
      console.log(result.c);
      document.getElementById('tokenValue').innerText=result.c;
    });
  },

  bindEvents: function() {

    $(document).on('click', '.add_to_cart_button', PetShop.handleAdopt);

  },

  markAdopted: function(t) {
    var adoptionInstance;

    Init.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        // console.log(adopters[i]);
        if (adopters[i] != "0x0000000000000000000000000000000000000000") {
          $('.single-shop-product').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {

    // event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    var tokenAmount=parseInt($(event.target).data('cost'));
    // console.log(petId);
    // console.log(tokenAmount);
    var adoptionInstance;
    var account = document.getElementById("accountAddr").innerHTML;
    var isAdoption

    Init.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
      // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId,{from: account});
    }).then(function(result) {
      alert("Adopt success!")
      
      Init.contracts.FixedSupplyToken.deployed().then(function(instance) {
        tokenInstance = instance;
  
      // Execute adopt as a transaction by sending account
        return tokenInstance.SubToken(tokenAmount,{from:account});
      }).then(function(result) {
        console.log(result);
        console.log(result.logs[0].args.tokens.c[1]);
        document.getElementById('tokenValue').innerHTML=result.logs[0].args.tokens.c[1];
      }).catch(function(err) {
        console.log(err.message);
      });

      return PetShop.markAdopted();
    }).catch(function(err) {
      alert("Adopt failed :(");
      console.log(err.message);
    });

    // Init.contracts.FixedSupplyToken.deployed().then(function(instance) {
    //   tokenInstance = instance;
    // // Execute adopt as a transaction by sending account
    //   return tokenInstance.SubToken(tokenAmount,{from:account});
    // }).then(function(result) {
    //   console.log(result.logs[0].args.tokens.c[1]);
    //   document.getElementById('tokenValue').innerHTML=result.logs[0].args.tokens.c[1];
    // }).catch(function(err) {
    //   console.log(err.message);
    // });

  },

};

$(function() {
  $(window).load(function() {
     PetShop.init();
  });
});
