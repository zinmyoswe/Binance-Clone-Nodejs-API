const WebSocket = require('ws');

// Binance Futures Testnet WS base
// Example: wss://stream.binancefuture.com/ws/btcusdt@ticker
const BINANCE_FUTURES_WS_BASE = 'wss://stream.binancefuture.com/ws/';

/**
 * Create WebSocket connection to Binance Futures Testnet and broadcast to Socket.IO clients
 * @param {string[]} symbols - array of symbols like ['btcusdt', 'ethusdt']
 * @param {object} io - Socket.IO server instance
 */
function createAndBridge(symbols = ['btcusdt'], io) {
  symbols.forEach(symbol => {
    const wsUrl = `${BINANCE_FUTURES_WS_BASE}${symbol}@ticker`;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => console.log('Connected to Binance Futures WS:', wsUrl));

    ws.on('message', (data) => {
      try {
        const payload = JSON.parse(data.toString());
        // Emit the ticker data to frontend
        io.emit('market-tick', { symbol, data: payload });
      } catch (err) {
        console.error('WS parse error', err);
      }
    });

    ws.on('close', () => {
      console.log(`Binance WS ${symbol} closed, reconnecting in 2s...`);
      setTimeout(() => createAndBridge([symbol], io), 2000);
    });

    ws.on('error', (err) => {
      console.error(`Binance WS ${symbol} error`, err);
      ws.terminate();
    });
  });
}

module.exports = { createAndBridge };
