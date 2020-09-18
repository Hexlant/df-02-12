const express = require('express');
const config = require('../config');
const EthereumTx = require('ethereumjs-tx').Transaction;

const router = express.Router();
const erc20Abi = config.getErc20ABI();
const network = config.getNetwork();

router.get('/', function(req, res) {
  res.render('transfer');
});

router.post('/', async function(req, res) {
  let response = {};
  
  try {
    let txParam;
    const instance = req.app.get('axiosInstance');
    const web3 = req.app.get('web3');
  
    const fromAddress = req.session.address ;
    const fromPrivateKey = req.session.privateKey; 
    const toAddress = req.body.toAddress;
    const amount = req.body.amount
    const contractAddress = req.body.contractAddress;

    if (!fromAddress || !fromPrivateKey) return res.json({ status: 'SESSION' });

    if (!toAddress) return res.json({ status: 'NOT FOUND: toAddress' });
    if (!amount) return res.json({ status: 'NOT FOUND: amount' });

    if (fromPrivateKey.startsWith('0x')) {
      fromPrivateKey = fromPrivateKey.replace('0x', '');
    }

    // nonce https://octet.gitbook.io/full-history/ethereum/ethereum-api/nonce
    const { data: { nonce } } = await instance.get(`addresses/${fromAddress}/nonce`);
    
    const value = web3.utils.toWei(amount.toString(), 'ether');
    
    if(contractAddress) {
      const token = new web3.eth.Contract(erc20Abi, contractAddress);
      const inputData = token.methods.transfer(toAddress, value).encodeABI();
      txParam = {
        to: contractAddress,
        data: inputData,
        gasPrice: web3.utils.toHex(2000000000),
        gasLimit: web3.utils.toHex(1000000),
        nonce: web3.utils.toHex(nonce),
      }
    } else {
      txParam = {
        from: fromAddress,
        to: toAddress,
        value: web3.utils.toHex(value),
        gasPrice: web3.utils.toHex(2000000000),
        gasLimit: web3.utils.toHex(1000000),
        nonce: web3.utils.toHex(nonce),
      }
    }
    const tx = new EthereumTx(txParam, { chain: network, hardfork: 'petersburg' });

    const privateKey = Buffer.from(fromPrivateKey, 'hex');
    tx.sign(privateKey);

    const serializedTx = tx.serialize().toString('hex');

    // broadcast http://106.10.58.158:3000/v1/rpc/pushTransaction
    const { data: { txid } } = await instance.post(`rpc/pushTransaction`, { txHex: serializedTx }); 
    
    response.txid = txid;
    response.status = 'SUCCESS';
  } catch (e) {
    console.log(e);
    response.msg = e.message;
    response.status = 'FAIL';
  }
  res.json(response);
});

module.exports = router;
