const express = require('express');

const app = express();
const PORT = process.env.port || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res)=>{
    res.send('Welcome to NexTalk server');
})

