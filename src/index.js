// importing the app from the app.js because we have splited the first two line of index.js
const app = require("./app")
const mongoose = require("mongoose")
const ConnectDB = require("./config/db")

// importing the mongoDB connection in the config logic
ConnectDB();

app.listen(3000 , () => {
    console.log("Server Started on the PORT 3000")
})