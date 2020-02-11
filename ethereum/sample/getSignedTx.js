const hexlantAPI = 'http://106.10.58.158:3000/v1/rpc';
const config = require('../config');
const Web3 = require('web3');
const web3 = new Web3(hexlantAPI);

const receiver = '<받는 주소>';
const amount = '<보내는 수량>';
    
(async function generateSignedTx(to, amount) {
  const getAccount = config['accounts'][ config['settings']['selectedAccountIndex'] ];
  const address = getAccount.address;
  const privateKey = getAccount.key;

  const nonce = await web3.eth.getTransactionCount(address);

  const rawTx = {
    nonce,
    to,
    value: web3.utils.toWei(amount.toString(), 'ether'),
    gasPrice: 30000000000,
    gasLimit: 2000000,
  };
  
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const signedTx = await account.signTransaction(rawTx);
  console.log(signedTx.rawTransaction);
})(receiver, amount);