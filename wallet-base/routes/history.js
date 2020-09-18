const express = require('express');
const router = express.Router();
const config = require('../config');
const request = require('request-promise-native');
const url = config.getHttpEndpoint();

router.get('/', async function(req, res, next) {
  try {
    res.render('history');
  } catch (e) {
    res.redirect('/');
  }
});

router.get('/getHistory', async function (req, res) {
  try {
    const instance = req.app.get('axiosInstance');
    const web3 = req.app.get('web3');

    const address = req.session.address;
    const contractAddr = req.query.contractAddress;
  
    let historyObj;
    let listOfAllHistory = [];
    let listOfInHistory = [];
    let listOfOutHistory = [];
  
    if (!contractAddr) {
      status = 1;
      ////
      //  address에 대한 전체 트랜잭션 히스토리 가져오기 
      //
      //  const resAPI =  
      //
      ////   
      const historyObj = resAPI.data
      historyObj.forEach(h => {
        listOfAllHistory.push({
          type: h.type,
          from: h.from,
          to: h.type === 'erc20' ? h.token.to : h.to,
          value: h.type === 'erc20' ? web3.utils.fromWei(h.token.value, 'ether') : web3.utils.fromWei(h.value, 'ether'),
          txid: h.txid
        })

        if (h.from === address) {
          listOfOutHistory.push({
            type: h.type,
            to: h.type === 'erc20' ? h.token.to : h.to,
            value: h.type === 'erc20' ? web3.utils.fromWei(h.token.value, 'ether') : web3.utils.fromWei(h.value, 'ether'),
            txid: h.txid
          })
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

      ////
      //  address에 대한 특정 컨트랙트 트랜잭션 히스토리 가져오기 
      //
      //  const resAPI =  
      //
      //   
      ////
      const historyObj = resAPI.data;
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