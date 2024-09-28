const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const CORS = require('cors')
require("dotenv").config();

const URI = process.env.MONGODB_URL;
const port = process.env.PORT || 5000;
const app = express();

app.use(CORS());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
}));

app.use('/user', require('./routes/userRoutes'))
app.use('/api', require('./routes/upload'))


//get request
app.get("/", (req, res) => {
  res.send("Welcome to NexTalk server");
});

// Mongoose connection
const connectDB = async (req, res) => {
  try {
    await mongoose.connect(URI);
    console.log("Mongo Connected...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});