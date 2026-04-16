const express = require("express")
const router = express.Router();

const{
    createNote , bulkNotes , getNotes, getNotesID, replaceNote, replacePart
} = require('../controllers/note.controller');

router.post('/api/notes' , createNote);
router.post('/api/notes/bulk' , bulkNotes);
router.get('/api/notes' , getNotes);
router.get('/api/notes/:id' , getNotesID);
router.put('/api/notes/:id' , replaceNote);
router.patch('/api/notes/:id' , replacePart);

module.exports = router;