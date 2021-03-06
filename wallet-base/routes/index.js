const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  if (req.session.address && req.session.privateKey) {
    const instance = req.app.get('axiosInstance');
    const web3 = req.app.get('web3');

    const address = req.session.address;

    ////
    //  address에 대한 토큰 잔액  가져오기 
    //
    //  const { data: { balance: balanceUnitWei }} = 
    //
    //// 

    const balanceUnitEther = web3.utils.fromWei(balanceUnitWei, 'ether');

    res.render('index', { address, balance: balanceUnitEther });
  } else {
    res.render('login');
  }
})

module.exports = router;
