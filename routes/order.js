const express = require("express");
const router = express.Router();
const { signedRequest } = require("../binance/binanceClient");

/**
 * 1. Place New Order
 * POST /api/orders/place
 */
router.post("/place", async (req, res) => {
  const {
    symbol = "BTCUSDT",
    side, // BUY or SELL
    type = "MARKET", // MARKET or LIMIT
    quantity,
    price,
    timeInForce = "GTC"
  } = req.body;

  if (!side || !quantity) {
    return res.status(400).json({ error: "side and quantity required" });
  }

  const params = { symbol, side, type, quantity };
  if (type === "LIMIT") {
    params.price = price;
    params.timeInForce = timeInForce;
  }

  try {
    const resp = await signedRequest("POST", "/fapi/v1/order", params);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to place order",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * 2. Test Order (does not execute)
 * GET /api/orders/test
 */
router.get("/test", async (req, res) => {
  try {
    await signedRequest("POST", "/fapi/v1/order/test", {
      symbol: "BTCUSDT",
      side: "BUY",
      type: "MARKET",
      quantity: "0.001",
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({
      error: "Test failed",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * 3. Get Order Status
 * GET /api/orders/:orderId?symbol=BTCUSDT
 */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { symbol = "BTCUSDT" } = req.query;
    const resp = await signedRequest("GET", "/fapi/v1/order", { symbol, orderId });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch order",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * 4. Get All Open Orders
 * GET /api/orders/open?symbol=BTCUSDT
 */
router.get("/open/all", async (req, res) => {
  try {
    const { symbol = "BTCUSDT" } = req.query;
    const resp = await signedRequest("GET", "/fapi/v1/openOrders", { symbol });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch open orders",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * 5. Cancel Order
 * DELETE /api/orders/:orderId?symbol=BTCUSDT
 */
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { symbol = "BTCUSDT" } = req.query;
    const resp = await signedRequest("DELETE", "/fapi/v1/order", { symbol, orderId });
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to cancel order",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * 6. Account Info (Balances, Positions)
 * GET /api/orders/account
 */
router.get("/account/info", async (req, res) => {
  try {
    const resp = await signedRequest("GET", "/fapi/v2/account", {});
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch account info",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * GET /api/orderbook/:symbol
 * Returns bids and asks
 */
// router.get("/:symbol", async (req, res) => {
//   try {
//     const { symbol } = req.params;

//     // Binance Depth API
//     const resp = await signedRequest("GET", "/fapi/v1/depth", { symbol, limit: 50 });

//     res.json({
//       bids: resp.data.bids, // [[price, qty], ...]
//       asks: resp.data.asks,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to fetch orderbook",
//       details: err?.response?.data || err.message,
//     });
//   }
// });

module.exports = router;
