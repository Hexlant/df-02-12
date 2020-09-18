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

    if (fromPrivateKey.startsWith('0x')) {
      fromPrivateKey = fromPrivateKey.replace('0x', '');
    }

    ////
    //  address에 대한 논스값  가져오기 
    //
    //  const { data: { nonce } } =
    //
    //// 
    
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


    ////
    //  서명된 트랜잭션 전파하기  
    //
    //  const { data: { txid } } =
    //
    //// 
    
    response.txid = txid;
    response.status = 'Success';
  } catch (e) {
    console.log(e);
    response.msg = e;
    response.status = 'Fail';
  }
  res.json(response);
});

module.exports = router;
