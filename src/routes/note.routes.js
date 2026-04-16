const express = require("express")
const router = express.Router();

const{
    createNote , bulkNotes
} = require('../controllers/note.controller');

router.post('/api/notes' , createNote);
router.post('/api/notes/bulk' , bulkNotes);

module.exports = router;