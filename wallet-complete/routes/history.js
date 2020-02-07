const express = require('express');
const router = express.Router();
const config = require('../config');
const request = require('request-promise-native');
const url = config.getHexlantEndPoint();

router.get('/', async function(req, res, next) {
  try {
    res.render('history');
  } catch (e) {
    res.redirect('/');
  }
});

router.get('/getHistory', async function (req, res) {
  try {
    const web3 = req.app.get('web3');

    const address = req.session.address;
    const contractAddr = req.query.contractAddress;
  
    let historyObj;
    let listOfAllHistory = [];
    let listOfInHistory = [];
    let listOfOutHistory = [];
  
    if (!contractAddr) {
      status = 1;
      // historyObj = address에 대한 전체 트랜잭션 히스토리 가져오기  http://106.10.58.158:9000/#api-Addresses-GetAddressesAddressTransactions  
      historyObj = await request({ url: `${url}/v1/addresses/${address}/transactions`, json: true });
      historyObj.forEach(h => {
        if (h.type === 'erc20') {
          listOfAllHistory.push({
            type: h.type,
            from: h.from,
            to: h.token.to,
            value: web3.utils.fromWei(h.token.value, 'ether'),
            txid: h.txid,
          });
        } else {
          listOfAllHistory.push({
            type: h.type,
            from: h.from,
            to: h.to,
            value: web3.utils.fromWei(h.value, 'ether'),
            txid: h.txid,
          });
        }
        if (h.from === address) {
          if (h.type === 'erc20') {
            listOfOutHistory.push({
              type: h.type,
              to: h.token.to,
              value: web3.utils.fromWei(h.token.value, 'ether'),
              txid: h.txid,
            });
          } else {
            listOfOutHistory.push({
              type: h.type,
              to: h.to,
              value: web3.utils.fromWei(h.value, 'ether'),
              txid: h.txid,
            });
          }
        } 
        if (h.to === address) {
          listOfInHistory.push({
            type: h.type,
            from: h.from,
            value: web3.utils.fromWei(h.value, 'ether'),
            txid: h.txid,
          });
        }
      }) 
    } else {  
      status = 2;
      // historyObj = contractAddr에 대한 컨트랙트 트랜잭션 히스토리 가져오기  http://106.10.58.158:9000/#api-Addresses-GetAddressesAddressTransactions
      historyObj = await request({ url: `${url}/v1/addresses/${address}/transactions`, qs: { type: 'erc20', contractAddress: contractAddr }, json: true});
      historyObj.forEach(h => {
        listOfAllHistory.push({
          from: h.from,
          to: h.token.to,
          value: web3.utils.fromWei(h.token.value, 'ether'),
          txid: h.txid,
        });
        if (h.from === address) {
          listOfOutHistory.push({
            to: h.token.to,
            value: web3.utils.fromWei(h.token.value, 'ether'),
            txid: h.txid,
          });
        }
        if (h.token.to === address) {
          listOfInHistory.push({
            from: h.from,
            value: web3.utils.fromWei(h.token.value, 'ether'),
            txid: h.txid,
          });
        }
      }) 
    }
  
    history = {
      address,
      status,
      all: listOfAllHistory,
      in: listOfInHistory,
      out: listOfOutHistory,
    };
  } catch (e) {
    history.status = 3;
  }
  res.json(history);
})

module.exports = router;
