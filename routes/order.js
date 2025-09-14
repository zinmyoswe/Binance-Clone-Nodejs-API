const express = require('express');
const router = express.Router();
const { signedRequest } = require('../binance/binanceClient');

// Place a new order
router.post('/place', async (req, res) => {
  const { symbol='BTCUSDT', side, type='MARKET', quantity, price, timeInForce='GTC' } = req.body;
  if (!side || !quantity) return res.status(400).json({ error: 'side and quantity required' });

  const params = { symbol, side, type, quantity };
  if (type === 'LIMIT') { params.price = price; params.timeInForce = timeInForce; }

  try {
    const resp = await signedRequest('POST', '/fapi/v1/order', params);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', details: err?.response?.data || err.message });
  }
});

// Test order endpoint
router.get('/test', async (req, res) => {
  try {
    await signedRequest('POST', '/fapi/v1/order/test', { symbol: 'BTCUSDT', side: 'BUY', type: 'MARKET', quantity: '0.001' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'test failed', details: err?.response?.data || err.message });
  }
});

module.exports = router;
