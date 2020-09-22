const Web3 = require('web3');
const Web3HttpProvider = require('web3-providers-http');

const httpEndpoint = 'http://octet-fullhistory-test.hexlant.com:3000/v1/rpc';

const options = {
  keepAlive: true,
  withCredentials: false,
  timeout: 30000,
};

const web3 = new Web3(new Web3HttpProvider(httpEndpoint, options));

async function getHistory(start, end, address) {
  const targetAddress = web3.utils.toChecksumAddress(address);
  let targetBlock = start;
  let lastBlock = end;   
  try {
    while (targetBlock < lastBlock) {
      console.log(targetBlock);
      const thisBlock = await web3.eth.getBlock(targetBlock, true);
      const transactions = thisBlock.transactions;
      for (let i = 0; i < transactions.length; i += 1) {
        const tx = transactions[i];
        const sender = web3.utils.toChecksumAddress(tx.from);
        var receiver = tx.to;
        if (!receiver) return;
        else {
          const code = await web3.eth.getCode(receiver); 
          receiver = web3.utils.toChecksumAddress(receiver);
          if (code === '0x' && [sender, receiver].includes(targetAddress)) {
            console.log(`이더전송 트랜잭션 ${tx.hash}`)
          } else {
            const inputData = tx.input;
            const functionSignature = inputData.substr(0, 10);
            const payload = '0x' + inputData.substr(10);
            if (functionSignature == '0xa9059cbb') {
              const decodeParams = web3.eth.abi.decodeParameters(['address', 'uint256'], payload);
              receiver = decodeParams[0];
              if ([sender, receiver].includes(targetAddress)) {
                console.log(`토큰전송 트랜잭션 ${tx.hash}`)
              } 
            }
          }
        }
      }
      targetBlock++;
    }
  } catch (e) {
    console.log(e);
  }
};

(async () => {
  await getHistory(8731647, 8731650, '0x81b7E08F65Bdf5648606c89998A9CC8164397647')
})();