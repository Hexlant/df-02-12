var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login');
})

router.post('/', function(req, res, next) {
  if (!req.body.address || !req.body.privateKey) {
    res.redirect('/login');
  } else {
    req.session.address = req.body.address;
    req.session.privateKey = req.body.privateKey;
    req.session.save(() => {
      res.redirect('/');
    }) 
  }
});

module.exports = router;
