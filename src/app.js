// Split the first 2 line to the app.js then export the app and import on the index.js
const express = require("express")
const app = express()
const userRoutes = require('./routes/note.routes')

app.use(express.json());
app.use(userRoutes);

// 404 — no route matched
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found.' });
});

module.exports = app 