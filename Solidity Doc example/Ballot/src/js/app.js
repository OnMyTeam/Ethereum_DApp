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
      // var bytes32hash=web3.utils.fromAscii('one').padEnd(66, '0');
      // console.log(bytes32hash);
      // console.log(web3.utils.toAscii(bytes32hash));
      console.log("[\""+web3.utils.fromAscii('one').padEnd(66, '0')+"\",\""+web3.utils.fromAscii('two').padEnd(66, '0')+"\",\""+web3.utils.fromAscii('three').padEnd(66, '0')+"\"]")
      return App.initContract();
    },
  
    initContract: async function() {
      await $.getJSON('Ballot.json', function (data) {
        var BallotArtifact = data;
        App.contracts.Ballot = TruffleContract(BallotArtifact);
        App.contracts.Ballot.setProvider(App.web3Provider);
      }); 
      await App.contracts.Ballot.deployed().then(function(instance){
        App.BallotInstance=instance;
      });
      App.startApp();
    },

    startApp: function(){
      App.getAccountInfo();
      App.getProposals();
      App.bindEvents();
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

    getProposals: async function() {
      var len;
      await App.BallotInstance.getProposalLength().then(function(result){
        len=result;
      });

      var i,html;
      for(i=0;i<len;i++){
        await App.BallotInstance.proposals(i).then(function(result){
          var proposalName=App.hexToString(result.name);
          html+="<tr><td>"+i+"</td><td>"+proposalName+"</td></tr>";
          console.log(i,proposalName);
        });
      }
      $('#tableContent').html(html);
    },

    bindEvents:function() {
      $(document).on('change', '#selectAccount', App.changeSelect);
      $(document).on('click', '.getRigthBtn', App.getRight);
      $(document).on('click', '.delegateBtn', App.delegate);
      $(document).on('click', '.voteBtn', App.vote);
      $(document).on('click', '.winnerBtn', App.getWinner);
    },

    changeSelect: function(){
      var address = $('#selectAccount').val();
      if(address==""){
        console.log("select");
        document.getElementById('ethValue').innerHTML="";
        return;
      }
      App.myAddress=address;
      
      web3.eth.getBalance(address, (err, balance) => {
        var ether = web3.utils.fromWei(balance, "ether") + " ETH";
        document.getElementById('ethValue').innerHTML=ether;
      }); 
    },

    getRight: function() {
      var address=document.getElementById('getRightAddress').value;
      $('#getRightAddress').val("");
      App.BallotInstance.giveRightToVote(address,{from:App.myAddress}).then(function(result){
        alert("you can vote!");
      }).catch(function(error){
        alert(error);
      });
    },
    
    delegate: function() {
      var address=document.getElementById('delegateAddress').value;
      $('#delegateAddress').val("");
      App.BallotInstance.delegate(address,{from:App.myAddress}).then(function(result){
        alert("you can vote!");
        // App.myAddress.
        $('#delegateMsg').text("your vote is delegated to "+address);
      }).catch(function(error){
        alert(error);
      });
    },

    vote: function() {
      var prposalNo=document.getElementById('voteProposal').value;
      $('#voteProposal').val("");
      App.BallotInstance.vote(prposalNo,{from:App.myAddress}).then(function(result){
        alert("vote success!");
      }).catch(function(error){
        alert(error);
      });

    },

    getWinner: function() {
      console.log("winner");
      App.BallotInstance.winnerName().then(function(result){
        var winner=App.hexToString(result);
        $('#WinnerMsg').text(winner);
      });
    },
    
    hexToString: function(string){
      var str=web3.utils.toAscii(string);
      return str;
    }




};
  
$(function() {
  $(window).load(function() {
    App.init();
  });
});
