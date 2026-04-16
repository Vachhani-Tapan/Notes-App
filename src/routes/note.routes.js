const express = require("express")
const router = express.Router();

const{
    createNote , bulkNotes , getNotes, getNotesID
} = require('../controllers/note.controller');

router.post('/api/notes' , createNote);
router.post('/api/notes/bulk' , bulkNotes);
router.get('/api/notes' , getNotes);
router.get('/api/notes/:id' , getNotesID);

module.exports = router;