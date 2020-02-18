const express = require('express');
const router = express.Router();
const {VisaNet} = require('@arturoblack/visanet');

const visa = new VisaNet({
  user: '---',
  password: '---',
  merchantId: '--',
  env: 'dev',
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/pagar', async function(req, res, next) {
  const {amount, product} = req.body;
  const clientIp = '192.168.1.10';
  const domain = 'http://localhost:3000';

  try {
    const securityToken = await visa.createToken();
    const body = { 
      amount, 
      channel: visa.channel, 
      antifraud: 
        { 
          clientIp, 
          merchantDefineData: {MDD1: 'web', MDD2: 'Canl', MDD3: 'Canl'},
        },
    };
    const {
      sessionKey,
      expirationTime
    } = await visa.createSession(securityToken, body);

    let purchaseNumber = Math.floor(Math.random() * 1000000);
    req.session.visa = {securityToken, sessionKey, amount, product, purchaseNumber};
    res.render('pagar', {
      sessionKey,
      expirationTime,
      merchantId: visa.merchantId,
      amount,
      product,
      domain,
      purchaseNumber,
    });
  } catch(error) {
    res.status(500).json(error);
  }
});

router.post('/visa/respuesta', async function(req, res, next) {
  try {
    const {
      transactionToken,
      customerEmail,
      channel,
    } = req.body;

    const {
      securityToken, 
      sessionKey, 
      amount, 
      product,
      purchaseNumber,
    } = req.session.visa;

    // inventamos un numero de compra
    

    const body = {
      antifraud: null,
      captureType: 'manual',
      channel,
      countable: true,
      order: {
        amount:  amount,
        currency: visa.currency,
        purchaseNumber,
        tokenId: transactionToken
      },
    };

    const payload = await visa.getAuthorization(securityToken, body);
    res.render('complete', {payload, product});
  } catch (error) {
    res.json(error);
  }
});
module.exports = router;
