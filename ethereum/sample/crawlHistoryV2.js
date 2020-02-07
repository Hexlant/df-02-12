const hexlantAPI = 'http://106.10.58.158:3000'
const request = require('request-promise-native');
const Web3 = require('web3')
const web3 = new Web3(hexlantAPI + '/v1/rpc')


async function getHistory(targetAddress) {
  try {
    const history = await request({ url: `${hexlantAPI}/v1/addresses/${targetAddress}/transactions`, json: true });
    return history;
  } catch (e) {
    console.log(e);
  }
}

(async () => {
  const result = await getHistory('0x1d773AFc03906832b9F10A225E8401c2A03dC821')
  console.log(result); 
})()
