const hexlantAPI = 'http://106.10.58.158:3000';
const request = require('request-promise-native');
const Web3 = require('web3');
const web3 = new Web3(hexlantAPI + '/v1/rpc');


const targetAddress = '<히스토리를 검색할 주소>'

(async function getHistory(address) {
  try {
    const history = await request({ url: `${hexlantAPI}/v1/addresses/${address}/transactions`, json: true });
    console.log(history)
  } catch (e) {
    console.log(e);
  }
})(targetAddress);
