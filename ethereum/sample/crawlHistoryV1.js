const Web3 = require('web3');
const Web3HttpProvider = require('web3-providers-http');

const httpEndpoint = 'http://octet-fullhistory-test.hexlant.com:3000/v1/rpc';

const options = {
  keepAlive: true,
  withCredentials: false,
  timeout: 30000,
};

const web3 = new Web3(new Web3HttpProvider(httpEndpoint, options));

(async function getHistory(start, end, address) {
  const targetAddress = web3.utils.toChecksumAddress(address);
  let targetBlock = start;
  let lastBlock = end;   
  let history = [];       
  try {
    while (targetBlock < lastBlock) {
      const thisBlock = await web3.eth.getBlock(targetBlock, true);
      const transactions = thisBlock.transactions;
      for (let i = 0; i < transactions.length; i += 1) {
        const tx = transactions[i];
        const sender = web3.utils.toChecksumAddress(tx.from);
        var receiver = tx.to;
        if (!receiver) return;
        const code = await web3.eth.getCode(receiver); 
        if (code === '0x' && [sender, receiver].includes(targetAddress)) {
          history.push({
            type: 'eth',
            height: targetBlock,
            sender,
            receiver,
            value: web3.utils.fromWei(tx.value.toString(), 'ether'), 
            hash: tx.hash
          });
        } else {
          const inputData = tx.input;
          const functionSignature = inputData.substr(0, 10);
          const payload = '0x' + inputData.substr(10);
          if (functionSignature == '0xa9059cbb') {
            const decodeParams = web3.eth.abi.decodeParameters(['address', 'uint256'], payload);
            receiver = decodeParams[0];
            if ([sender, receiver].includes(targetAddress)) {
              history.push({
                type: 'erc',
                height: targetBlock,
                sender,
                receiver,
                value: web3.utils.fromWei(decodeParams[1].toString(), 'ether'),
                hash: tx.hash
              });
            } 
          }
        }
      }
      targetBlock++;
    }
    console.log(history)
  } catch (e) {
    console.log(e);
  }
})(100595, 100601, '0x1d773AFc03906832b9F10A225E8401c2A03dC821');
