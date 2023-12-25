const redis = require('redis');
const mongoose = require('mongoose');
const database = require('./database');

const redisClient = redis.createClient();
database.connect();

const Message = mongoose.model('Message', {
  text: String,
});

const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

redisClient.subscribe('messages');

redisClient.on('message', (channel, message) => {
  const data = JSON.parse(message);

  const newMessage = new Message({ text: data.text });
  newMessage.save();

  io.emit('message', { text: data.text }); // Broadcast to all connected clients

  console.log(`Received message: ${data.text}`);
});

http.listen(5000, () => {
  console.log(`Consumer listening on *:5000`);
});
