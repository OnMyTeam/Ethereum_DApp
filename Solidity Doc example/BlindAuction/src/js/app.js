App = {
  web3Provider: null,
  contracts: {},
  myAddress: null,

  init: async function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
    console.log(web3.currentProvider);
    return App.initContract();
  },

  initContract: async function() {
    await $.getJSON('BlindAuction.json', function (data) {
      var BlindAuctionArtifact = data;
      App.contracts.BlindAuction = TruffleContract(BlindAuctionArtifact);
      App.contracts.BlindAuction.setProvider(App.web3Provider);
    }); 
    await App.contracts.BlindAuction.deployed().then(function(instance){
      App.BlindAuctionInstance=instance;
    });
    App.startApp();
  },

  startApp: function(){
    App.getAccountInfo();
    App.bindEvents();
    // var read= web3.utils.soliditySha3(
    //   { type: 'uint', value: 10 },
    //   { type: 'bool', value: true },
    //   { type: 'bytes32', value: '0x68656c6c6f000000000000000000000000000000000000000000000000000000' });
    // console.log(read);
  },

  getAccountInfo: function() {
    web3.eth.getAccounts().then(function(result){
      App.makeSelectAddress(result);
    });
  },

  makeSelectAddress: function(list) {
    var html;
    html += '<option value=""> Select </a>';
    for (var i = 0; i < list.length; i++) {
      html += '<option value="' + list[i] + '">' + list[i] + '</a>';
    }
    $('.accountAddr').html(html);
  },


  bindEvents:function() {
    $(document).on('change', '#selectAccount', App.changeSelect);
    $(document).on('click', '.bidBtn', App.bid);
    $(document).on('click', '.makeRevealBtn', App.makeReveal);
    $(document).on('click', '.revealBtn', App.reveal);
    $(document).on('click', '.endBtn', App.endAuction);
    $(document).on('click', '.withdrawalBtn', App.withdrawal);
  },

  changeSelect: function(){
    var address = $('#selectAccount').val();
    if(address==""){
      console.log("select");
      $('#ethValue').val("");
      return;
    }
    App.myAddress=address;
    
    web3.eth.getBalance(address, (err, balance) => {
      var ether = web3.utils.fromWei(balance, "ether") + " ETH";
      document.getElementById('ethValue').innerHTML=ether;
    }); 
  },

  bid: function() {
    var amount=document.getElementById('bidAmount').value;
    var secret=document.getElementById("bidSecret").value;
    var bidFake=document.getElementById("bidFake").value;
  
    $('#bidAmount').val("");
    $('#bidSecret').val("");
    $('#bidFake').val("");

    var secret_byte32=web3.utils.fromAscii(secret).padEnd(66, '0');
    var hash= web3.utils.soliditySha3(
      { type: 'uint', value: amount },
      { type: 'bool', value: bidFake },
      { type: 'bytes32', value: secret_byte32 },
      // { type: 'bytes32', value: hello-> '0x68656c6c6f000000000000000000000000000000000000000000000000000000' });
    );
    console.log(hash);

    App.BlindAuctionInstance.bid(hash,{from: App.myAddress,value: amount}).then(function(result){
      console.log(result);
      alert("bid success!");
    }).catch(function(error){
      alert(error);
    });
  },

  makeReveal: function(){
    console.log("makereveal");
    var revealNo=document.getElementById("RevealNo").value;
    var table=$("#revealTable");
    var html;

    html="<tr><td>no</td><td>value</td><td>fake</td><td>secret</td></tr>";
    console.log(revealNo);
    for(i=1;i<=revealNo;i++){
      console.log(i);
      html+="<tr>";
      html+="<td>"+i+"</td>";
      html+="<td><input type='text' name='value' id='reveal_value_"+i+"'></td>";
      html+="<td><input type='text' name='fake' id='reveal_fake_"+i+"'></td>";
      html+="<td><input type='text' name='secret' id='reveal_secret_"+i+"'></td>";
      html+="</tr>";
    }
    $('#revealTable').html(html);
    document.getElementById("revealBtn").style.display='block';
  },

  reveal: function() {
    var valueArr=[];
    var fakeArr=[];
    var secretArr=[];
    var col=($('#revealTable').length);
    for(i=1;i<=col;i++){
      valueArr.push(document.getElementById('reveal_value_'+i).value);
      fakeArr.push(document.getElementById('reveal_fake_'+i).value);
      var secret_byte32=web3.utils.fromAscii(document.getElementById('reveal_secret_'+i).value).padEnd(66, '0');
      secretArr.push(secret_byte32);
    }
    console.log(valueArr);
    console.log(fakeArr);
    console.log(secretArr);
    App.BlindAuctionInstance.reveal(valueArr,fakeArr,secretArr,{from: App.myAddress}).then(function(result){
      console.log(result);
      alert("reveal success!");
    }).catch(function(error){
      alert(error);
    });
  },
  
  endAuction: function() {
    App.BlindAuctionInstance.auctionEnd({from: App.myAddress}).then(function(result){
      alert("Auction is end!!");
    }).catch(function(error){
      alert(error);
    });
  },
  
  withdrawal: function() {
    App.BlindAuctionInstance.withdraw({from: App.myAddress}).then(function(result){
      console.log(result);
      alert("withdrawal success!");
    }).catch(function(error){
      alert(error);
    });
  },

};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});