const hexlantAPI = 'http://106.10.58.158:3000/v1/rpc'

const Web3 = require('web3');
const web3 = new Web3(hexlantAPI);
    
const address = '0xD3590B15695f491CB1E8a56F6439C20DFB76f787'
const privateKey = '003D60DF3D60CA4321E8FF7BAE8C2B9F2821D9FF826AB49DFFF74B5E47AA3EDE'

async function generateSignedTx(to, amount) {
  const nonce = await web3.eth.getTransactionCount(address)

  const rawTx = {
    nonce,
    to,
    value: web3.utils.toWei(amount.toString(), 'ether'),
    gasPrice: 30000000000,
    gasLimit: 2000000,
  }
  
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  const signedTx = await account.signTransaction(rawTx)
  return signedTx.rawTransaction;
}

(async () => {
  const result = await generateSignedTx('0x1d773AFc03906832b9F10A225E8401c2A03dC821', 1);
  console.log(result);
})()