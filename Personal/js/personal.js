var contractAddress = '0xb72adaFdF9b5895e9e0509efc710B9E58633B50B';
var abi =
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "spender",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			},
			{
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "approveAndCall",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "blacklisting",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "deleteFromBlacklist",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_members",
				"type": "address"
			}
		],
		"name": "setMembers",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transferAnyERC20Token",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "from",
				"type": "address"
			},
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_new",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
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
				"indexed": true,
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
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
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
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
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
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
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
				"indexed": false,
				"name": "oldaddr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "newaddr",
				"type": "address"
			}
		],
		"name": "TransferOwnership",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "tokenOwner",
				"type": "address"
			},
			{
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "remaining",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "tokenOwner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "blackList",
		"outputs": [
			{
				"name": "",
				"type": "int8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fundsWallet",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBalanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBlacklist",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "members",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "unitsOneEthCanBuy",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
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
	getAccounts();
}
function getToken() {
  	Member.getBalanceOf(function(e,r){
	
    	document.getElementById('tokenValue').innerHTML = r.toString();
  });
}
function getAccounts() {
    web3.eth.getAccounts(function(e,r){
        for(let i=1;i<=r.length;i++){
            document.getElementById('AccountAddr_'+i).innerHTML=r[i-1].toString();
        }
        getTokenBalance(r);
    });
}
function getTokenBalance(){
    for(let i=1;i<=10;i++){
        let account= document.getElementById('AccountAddr_'+i).innerHTML;
        // console.log("acc:"+account);
        FixedSupplyToken.balanceOf(account,function(e,r){
            //console.log("balance: "+r);
            document.getElementById('token_'+i).innerHTML = r.toString();
        });
    }
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