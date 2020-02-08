var contractAddress = '0xa0Fc1fC4Cd5A161d7A1877E929ea02F1C180364d';
var abi =
[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_supply",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "_decimals",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "Blacklisted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Cashback",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "target",
				"type": "address"
			}
		],
		"name": "DeleteFromBlacklist",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "RejectedPaymentFromBlacklistedAddr",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "RejectedPaymentToBlacklistedAddr",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "blackList",
		"outputs": [
			{
				"internalType": "int8",
				"name": "",
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
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "blacklisting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
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
		"name": "deleteFromBlacklist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBlacklist",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
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
		"name": "members",
		"outputs": [
			{
				"internalType": "contract Members",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
				"internalType": "address",
				"name": "_members",
				"type": "address"
			}
		],
		"name": "setMembers",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
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
	
		getValue();
  	});
}

function getLink(addr) {
	return '<a target="_blank" href=https://ropsten.etherscan.io/address/' + addr + '>' + addr +'</a>';
}

function getValue(){
	getBlacklist();
	getToken();
}
function getToken() {
  	Member.getBalanceOf(function(e,r){
    document.getElementById('HoldingToken').innerHTML = r.toString();
  });
}
function pushStatus(){
	var name = $('#name').val();
	var times = $('#times').val();
	var sum = $('#sum').val();
	var rate = $('#rate').val();

	Member.pushStatus(name, times, sum, rate, function (e, r){
		alert("Success");
	});	
}
function setCoin(){
	
	var setCoin = $('#setCoin').val();

	Member.setCoin(setCoin, function (e, r){
		alert("Success");
	});	
}
function setMembers(){
	
	var setMembers = $('#setMembers').val();

	Member.setMembers(setMembers, function (e, r){
		alert("Success");
		$('#setMembers').val('');
	});	
}
function blacklisting(){
	
	var blacklisting = $('#blacklisting').val();

	Member.blacklisting(blacklisting, function (e, r){
		alert("Success");
		getBlacklist();
		$('#blacklisting').val('');
		
	});	
}
function deleteFromBlacklist(){
	
	var deleteFromBlacklist = $('#deleteFromBlacklist').val();

	Member.deleteFromBlacklist(deleteFromBlacklist, function (e, r){
		alert("Success");
		getBlacklist();
		$('#blacklisting').val('');
		
	});	
}

function getBlacklist(){
	
	var html = '';

	Member.getBlacklist(function (e, r){
		var html = '';
		for(let i=1;i<=r.length;i++)
		{
			if(r[i-1] != '0x0000000000000000000000000000000000000000'){
				html +='<tr>';
				html +='<td>' + r[i-1].toString() + '</td>';
				html +='</tr>';
			}

		}
		$('#content').html(html);

	});	
}
function transfer(){
	
	var AddressTo = $('#AddressTo').val();
	var tokenValue = $('#tokenValue').val();

	Member.transfer(AddressTo, Number(tokenValue), function (e, r){
		alert("Success");
		$('#AddressTo').val('');
		$('#tokenValue').val(0);
		getToken();
		
	});	
}