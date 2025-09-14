require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { createAndBridge } = require('./binance/wsConnector');

const marketRoutes = require('./routes/market');
// const orderRoutes = require('./routes/order');
const orderbookRouter = require("./routes/orderbook");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/market', marketRoutes);
// app.use('/api/order', orderRoutes);
app.use("/api/orderbook", orderbookRouter);

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Frontend connected:', socket.id);
  socket.on('subscribe', (data) => {
    socket.join('market'); 
  });
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

const streams = ['btcusdt', 'ethusdt', 'bnbusdt']; // symbols you want
createAndBridge(streams, io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
