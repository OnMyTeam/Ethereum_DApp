PetShop = {
  web3Provider: null,
  contracts: {},
  address: 0x00,

  init: async function() {
    // Load pets.
    $.getJSON('../items.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.pet-cost').text(data[i].cost);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.btn-adopt').attr('data-cost', data[i].cost);

        petsRow.append(petTemplate.html());
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
    // web3.eth.getAccounts(function(error,accounts){
      var url=location.href;
      url=url.split('=')[1];
      url='0x4696B806d2E5358ccC46404B3950d2598826e9d6';
      PetShop.address=url;
      
        document.getElementById('accountAddr').innerHTML=PetShop.address;
        web3.eth.getBalance(PetShop.address, function(account,balance){
            document.getElementById('ethValue').innerHTML=web3.fromWei(balance.toString()) + "ETH";
            // PetShop.getTokenInfo();
            return PetShop.bindEvents();
        });
    // });
    
  },

  getTokenInfo: function(){
    
    Init.contracts.FixedSupplyToken.deployed().then(function(instance){
      var tokenInstance = instance;
      account=document.getElementById('accountAddr').innerText;
    // Execute adopt as a transaction by sending account

      return tokenInstance.balanceOf(account,{from:account});
    }).then(function(result) {
      document.getElementById('tokenValue').innerText=result.c;
    });
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', PetShop.handleAdopt);
    $(document).on('click', '.btn_myPage',PetShop.goMyPage);
  },

  markAdopted: function(t) {
    var adoptionInstance;

    Init.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;

      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        console.log(adopters[i]);
        if (adopters[i] != "0x0000000000000000000000000000000000000000") {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
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
    console.log(petId);
    console.log(tokenAmount);
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
        // console.log(result);
        // console.log(result.logs[0].args.tokens);
        document.getElementById('tokenValue').innerHTML=result.logs[0].args.tokens;
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
  goMyPage: function(){
    console.log("click mypage");
    location.href="../myPage.html?addr=" +PetShop.address ;
  }

};

$(function() {
  $(window).load(function() {
     PetShop.init();
  });
});