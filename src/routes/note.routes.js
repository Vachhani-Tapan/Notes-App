const express = require("express")
const router = express.Router();

const{
    createNote
} = require('../controllers/note.controller');

router.post('/api/notes' , createNote);

module.exports = router;