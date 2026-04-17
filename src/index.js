// importing the app from the app.js because we have splited the first two line of index.js

require("dotenv").config();

const app = require("./app")
const mongoose = require("mongoose")
const ConnectDB = require("./config/db")

// importing the mongoDB connection in the config logic
ConnectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log("Server Started on the PORT")
})