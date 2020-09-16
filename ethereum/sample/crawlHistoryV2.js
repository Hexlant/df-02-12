const axios = require('axios');
const httpEndpoint = 'https://octet-fullhistory.hexlant.com/v1/ETH';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV1bkBoZXhsYW50LmNvbSIsImlhdCI6MTYwMDIzMzg5MCwiZXhwIjoxNjAxMDk3ODkwfQ.BCJAE-9sM1LS2YtkHQfkwnbWRgfj2hkp-qBEJ9PoGtc';

const instance = axios.create({
  baseURL: httpEndpoint,
  timeout: 1000,
  headers: {'Authorization': accessToken}
});

(async function getHistory(address) {
  const { data: history } = await instance.get(`/addresses/${address}/transactions`)
  console.log(history);
})('0xD5CDC10f40A1724680340866cD406C370fB0c54B');
