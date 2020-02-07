const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', function(req, res) {
  res.render('transfer');
});

router.post('/', async function(req, res) {
  let response = {};
  try {
    let tx;

    const web3 = req.app.get('web3');
  
    const fromAddress = req.session.address;
    const fromPrivateKey = req.session.privateKey;
    const toAddress = req.body.toAddress;
    const amount = req.body.amount
    const contractAddress = req.body.contractAddress;
    const gasPrice = 30000000000;
    const gasLimit = 2000000;

    if (fromPrivateKey.startsWith('0x')) {
      fromPrivateKey = fromPrivateKey.replace('0x', '');
    }

    // nonce = fromAddress의 nonce 값 가져오기  https://web3js.readthedocs.io/en/v1.2.6/web3-eth.html#gettransactioncount
    const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending');
   
    // value = amount를 이더 단위로 변환하기  https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#fromwei
    const value = web3.utils.toWei(amount.toString(), 'ether');

    if(contractAddress) {
      const token = new web3.eth.Contract(config.getErc20ABI(), contractAddress);
      const inputData = token.methods.transfer(toAddress, value).encodeABI();
      tx = {
        to: contractAddress,
        value: 0,
        data: inputData,
        gasPrice,
        gasLimit,
        nonce,
      }
    } else {
      tx = {
        from: fromAddress,
        to: toAddress,
        value: value,
        gasPrice,
        gasLimit,
        nonce,
      }
    }
   
    // fromPrivateKey로 계정 객체 생성  https://web3js.readthedocs.io/en/v1.2.6/web3-eth-accounts.html#privatekeytoaccount
    const account = web3.eth.accounts.privateKeyToAccount(fromPrivateKey);

    // tx 객체에 서명  https://web3js.readthedocs.io/en/v1.2.6/web3-eth-accounts.html#signtransaction
    const signedTx = await account.signTransaction(tx);

    // 서명된 트랜잭션 전파 https://web3js.readthedocs.io/en/v1.2.6/web3-eth.html#sendsignedtransaction
    const result = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    
    response.txid = result.transactionHash;
    response.status = 'Success';
  } catch (e) {
    response.msg = e;
    response.status = 'Fail';
  }
  res.json(response);
});

module.exports = router;
