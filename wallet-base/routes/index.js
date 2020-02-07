const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', async function(req, res, next) {
  if (req.session.address && req.session.privateKey) {
    const web3 = req.app.get('web3');

    const address = req.session.address;

    // (1) #############
    // [ address의 토큰 잔액 가져오기 ]  https://web3js.readthedocs.io/en/v1.2.6/web3-eth.html#getbalance
    const balanceOfWei = ''
    // #############
    

    // (2) #############
    // [ balanceOfWei 값을 Ether 단위로 변환하기 ] https://web3js.readthedocs.io/en/v1.2.6/web3-utils.html#fromwei
    const  balance = ''
    // #############

    res.render('index', { address, balance });
  } else {
    res.render('login');
  }
})

module.exports = router;
