var express = require('express');
var router = express.Router();
const Web3 = require('web3');
var Tx = require('ethereumjs-tx');

var contractAddr = '0x5B18642580052703CD5D408EfFA652De3560Fe96';
var abi =[
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "symbol",
				"type": "bytes4"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "volume",
				"type": "uint256"
			}
		],
		"name": "setStock",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "symbol",
				"type": "bytes4"
			}
		],
		"name": "getStockPrice",
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
				"internalType": "bytes4",
				"name": "symbol",
				"type": "bytes4"
			}
		],
		"name": "getStockVolume",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function init() {
  var TxObj = Tx.Transaction;
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  web3.eth.getAccounts(console.log);
  let contractInstance = new web3.eth.Contract(abi, contractAddr);
  console.log("contractInstance");

  const account = '0x8CeB15981e7dB35567e665194F38CD15f341be7E';
  const privateKey = Buffer.from('08544941027bef344c5608342d7ce5950bdcabc09e5ed82d246c8ea053ad1fac', 'hex');
  //const newAddress = '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157';
  //var TestContract = new web3.eth.Contract([YOUR_ABI], contractAddress);
  const _data = contractInstance.methods.set(10).encodeABI();
  console.log(_data);
  var rawTx = {};
  web3.eth.getTransactionCount(account).then(nonce => {
    rawTx = {
      nonce: nonce,
      gasPrice: '0x20000000000',
      gasLimit: '0x41409',
      to: contractAddr,
      value: 0,
      data: _data
    }
 

    var tx = new TxObj(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log);

  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  init();
  res.render('index', { title: 'Express' });
});

module.exports = router;