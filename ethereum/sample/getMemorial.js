const config = require('../config');
const mainNetwork = config.networks.mainnet;
const Web3 = require('web3');
const web3 = new Web3(mainNetwork);

const memorialHash = '0x6E46D3AB7335FFFB0d14927e0B418CC08fe60505';

(async function memorial(contractAddr) {
  const abi = [
    {
      "inputs": [],
      "name": "inscription",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  const contract = new web3.eth.Contract(abi, contractAddr)
  const inscription = await contract.methods.inscription().call();
  console.log(inscription)
})(memorialHash);