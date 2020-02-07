var contractAddress = '0x5D4df16Ab22305CBb370901706994f14c4CB1F17';
var abi =
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "oldaddr",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newaddr",
				"type": "address"
			}
		],
		"name": "TransferOwnership",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "coin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_times",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sum",
				"type": "uint256"
			},
			{
				"internalType": "int8",
				"name": "_rate",
				"type": "int8"
			}
		],
		"name": "editStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			}
		],
		"name": "getCashbackRate",
		"outputs": [
			{
				"internalType": "int8",
				"name": "rate",
				"type": "int8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_times",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sum",
				"type": "uint256"
			},
			{
				"internalType": "int8",
				"name": "_rate",
				"type": "int8"
			}
		],
		"name": "pushStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "setCoin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "status",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sum",
				"type": "uint256"
			},
			{
				"internalType": "int8",
				"name": "rate",
				"type": "int8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "tradingHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sum",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "statusIndex",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_new",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_member",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "updateHistory",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let MemberContract;
let Member;
let accountAddress;
let currentEtherBalance;
let currentTokenBalance;
let tokenPrice;

window.addEventListener('load', function() {
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
  	if (typeof web3 !== 'undefined') {
    	// Use Mist/MetaMask's provider
		window.web3 = new Web3(web3.currentProvider);
  	} else {
    	console.log('No web3? You should consider trying MetaMask!')
    	// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    	window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  	}
  	// Now you can start your app & access web3 freely:
  	startApp();
});

function startApp() {
	MemberContract = web3.eth.contract(abi);
	Member = MemberContract.at(contractAddress);
	document.getElementById('contractAddr').innerHTML = getLink(contractAddress);

	web3.eth.getAccounts(function(e,r){
		
		document.getElementById('accountAddr').innerHTML = getLink(r[0]);
		accountAddress = r[0];
	
	//   getValue();
  	});
}

function getLink(addr) {
	return '<a target="_blank" href=https://ropsten.etherscan.io/address/' + addr + '>' + addr +'</a>';
}

// function getValue() {
//   getEther();
//   getToken();
//   getTokenInfo();
//   getCandidateInfo();
// }




// function getCandidateInfo() {
//   simpleVote.getVotesReceivedFor(function(e,r){
//     for(let i=1;i<=r.length;i++)
//     {
//       document.getElementById('day_votes_' + i).innerHTML = r[i-1].toString();
//     }
//   });
// }

// function voteForCandidate() {
//   let candidateName = $("#candidate").val();
//   let voteTokens = $("#vote-tokens").val();
//   $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
//   $("#candidate").val("");
//   $("#vote-tokens").val("");

//   simpleVote.vote(candidateName, voteTokens, function (e, r){
//     getCandidateInfo();
//   });
// }

// function buyTokens() {
//   let tokensToBuy = $("#buy").val();
//   let price = tokensToBuy * tokenPrice;
//   $("#buy-msg").html("Purchase order has been submitted. Please wait.");

//   simpleVote.buy({value: web3.toWei(price, 'ether'), from: web3.eth.accounts[0]}, function(v) {
//     web3.eth.getBalance(simpleVote.address, function(e, r) {
//     $("#contract-balance").html(web3.fromWei(r.toString()) + " ETH");
//    });
//   });
// }

function pushStatus(){
	var name = $('#name').val();
	var times = $('#times').val();
	var sum = $('#sum').val();
	var rate = $('#rate').val();

	Member.pushStatus(name, times, sum, rate, function (e, r){
		alert("성공");
	});	
}
function setCoin(){
	
	var setCoin = $('#setCoin').val();

	Member.setCoin(setCoin, function (e, r){
		alert("성공");
	});	
}
