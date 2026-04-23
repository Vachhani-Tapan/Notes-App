// importing the app from the app.js because we have splited the first two line of index.js

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const app = require("./app")
const mongoose = require("mongoose")
const ConnectDB = require("./config/db")

// importing the mongoDB connection in the config logic
ConnectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`Server started on PORT ${PORT}`)
})