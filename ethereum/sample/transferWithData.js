const hexlantAPI = 'http://106.10.58.158:3000/';
const url = hexlantAPI + 'v1/rpc';
const Web3 = require('web3');
const web3 = new Web3(url);
const config = require('../config');

const msg = 'Decenter Founders With Hexlant!';

(async function transferWithData(msg) {
  const getAccount = config['accounts'][ config['settings']['selectedAccountIndex'] ];
  const address = getAccount.address;
  const privateKey = getAccount.key;
  const nonce = await web3.eth.getTransactionCount(address);

  const dataToHex = web3.utils.toHex(msg)

  const rawTx = {
    nonce,
    to: address,
    value: 0,
    gasPrice: config['gas']['price'],
    gasLimit: config['gas']['limit'],
    data: dataToHex,
  }

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const signedTx = await account.signTransaction(rawTx)

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', (hash) => {
      console.log()
      console.log('========================================')
      console.log()
      console.log('트랜잭션 해쉬 : ', hash);
      console.log()
      console.log('========================================')
      console.log()
    })
})(msg);