const axios = require('axios');
const httpEndpoint = 'http://octet-fullhistory-test.hexlant.com:3000/v1';

const instance = axios.create({
  baseURL: httpEndpoint,
  timeout: 1000,
});

(async function getHistory(address) {
  const { data: history } = await instance.get(`/addresses/${address}/transactions`)
  console.log(history);
})('0x1d773AFc03906832b9F10A225E8401c2A03dC821');
