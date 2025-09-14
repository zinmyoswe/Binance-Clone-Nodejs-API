const express = require('express');
const router = express.Router();
const { publicGet } = require('../binance/binanceClient');

// Get 24h ticker info
router.get('/ticker', async (req, res) => {
  const symbol = (req.query.symbol || 'BTCUSDT').toUpperCase();
  try {
    const resp = await publicGet('/fapi/v1/ticker/24hr', { symbol });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticker', details: err?.response?.data || err.message });
  }
});

// Get order book
router.get('/orderbook', async (req, res) => {
  const symbol = (req.query.symbol || 'BTCUSDT').toUpperCase();
  const limit = req.query.limit || 5;
  try {
    const resp = await publicGet('/fapi/v1/depth', { symbol, limit });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orderbook', details: err?.response?.data || err.message });
  }
});

module.exports = router;
