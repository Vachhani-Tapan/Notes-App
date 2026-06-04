const express = require("express")
const router = express.Router();

const {
    createNote, bulkNotes, getNotes, getNotesID, replaceNote, replacePart, deletebyID, deleteBulkbyID
    , home, getNotesByCategory, getNotesByPinnedStatus, getNoteSummary, filterNotes
    , filterPinnedNotes, filterCategoryNotes, filterNotesByDateRange, paginateNotes
    , paginateNotesByCategory, sortNotes, sortPinnedNotes
} = require('../controllers/note.controller');


router.get('/', home);
router.post('/api/notes', createNote);
router.post('/api/notes/bulk', bulkNotes);
router.get('/api/notes', getNotes);

// Filter routes
router.get('/api/notes/filter/pinned', filterPinnedNotes);
router.get('/api/notes/filter/category', filterCategoryNotes);
router.get('/api/notes/filter/date-range', filterNotesByDateRange);
router.get('/api/notes/filter', filterNotes);

// Category and status routes
router.get('/api/notes/category/:category', getNotesByCategory);
router.get('/api/notes/status/:isPinned', getNotesByPinnedStatus);

// Paginate routes
router.get('/api/notes/paginate/category/:category', paginateNotesByCategory);
router.get('/api/notes/paginate', paginateNotes);

// Sort routes
router.get('/api/notes/sort/pinned', sortPinnedNotes);
router.get('/api/notes/sort', sortNotes);

// ID-specific routes
router.get('/api/notes/:id/summary', getNoteSummary);
router.get('/api/notes/:id', getNotesID);
router.put('/api/notes/:id', replaceNote);
router.patch('/api/notes/:id', replacePart);
router.delete('/api/notes/bulk', deleteBulkbyID);
router.delete('/api/notes/:id', deletebyID);

module.exports = router;