const express = require('express');
const http = require('http');
const database = require('./database');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const redis = require('redis');
const mongoose = require('mongoose');


const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

// database connection
database.connect();

const redisClient = redis.createClient();
// Handle Redis client events
redisClient.on('error', (err) => {
    console.error(`Redis client error: ${err}`);
});
  
redisClient.on('end', () => {
    console.log('Redis client connection closed');
});

const server = http.createServer(app);
const io = socketIo(server);



// database model
const Message = mongoose.model('Message', {
    text: String,
})

app.use(express.json());




app.post('/publish', (req, res) => {
    const { message } = req.body;
  
    const newMessage = new Message({ text: message });
    newMessage.save();
  
    redisClient.publish('messages', JSON.stringify({ text: message }));
  
    io.emit('message', { text: message }); // Broadcast to all connected clients
  
    res.status(200).json({ status: 'Message published' });
  });


server.listen(PORT, () => {
    console.log(`Producer listening on port ${PORT}`);
});

