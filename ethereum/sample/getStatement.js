const config = require('../config');
const mainNetwork = config.networks.mainnet;
const Web3 = require('web3');
const web3 = new Web3(mainNetwork);

const statementHash = '0xe4ee15d3f63db8464a649e3237ed83e930f9b3e40e842537a626745d1c96553c';

(async function statement(txHash) {
  const transaction = await web3.eth.getTransaction(txHash);
  const input = transaction.input;
  const result = web3.utils.hexToUtf8(input);
  console.log(result)
})(statementHash);

