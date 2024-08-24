const { config } = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const WebSocket= require('ws');

const URI = process.env.URI;

const app = express();
const PORT = process.env.port || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res)=>{
    res.send('Welcome to NexTalk server');
})

const connectDB = async(req, res)=>{
    try {
        await mongoose.connect(URI);
        console.log('Mongo Connected...')
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

connectDB();

// const ws = new WebSocket('ws://localhost:5000');
// ws.on('error', console.log(error));
// ws.on('open', ()=>{
//     ws.send('Welcome to Websocket')
// })
