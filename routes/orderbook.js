// routes/orderbook.js
const express = require("express");
const router = express.Router();
const { publicGet } = require("../binance/binanceClient");

/**
 * GET /api/orderbook/:symbol
 * Returns orderbook data (bids & asks) for the given symbol
 */
router.get("/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params;

    // Use Binance Depth API (public)
    const resp = await publicGet("/fapi/v1/depth", { symbol, limit: 50 });

    res.json({
      bids: resp.data.bids,
      asks: resp.data.asks,
    });
  } catch (err) {
    console.error(`[OrderBook] Failed to fetch ${req.params.symbol}:`, err.message);
    res.status(500).json({
      error: "Failed to fetch orderbook",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;
