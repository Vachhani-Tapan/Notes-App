const mongoose = require("mongoose")
async function ConnectDB() {
    mongoose.connect("mongodb://localhost:27017/NotesApp")
        .then(() => console.log("Successfully Connected to the DB"))
        .catch((err) => console.log(err.message))
}

module.exports = ConnectDB