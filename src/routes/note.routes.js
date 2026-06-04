const express = require("express")
const router = express.Router();

const {
    createNote, bulkNotes, getNotes, getNotesID, replaceNote, replacePart, deletebyID, deleteBulkbyID
    , home, getNotesByCategory, getNotesByPinnedStatus, getNoteSummary, filterNotes
    , filterPinnedNotes, filterCategoryNotes, filterNotesByDateRange, paginateNotes
    , paginateNotesByCategory, sortNotes, sortPinnedNotes, searchTitleOnly, searchContentOnly
    , searchTitleAndContent, filterAndSortNotes, filterAndPaginateNotes, sortAndPaginateNotes
    , searchAndFilterNotes, searchSortAndPaginateNotes, filterSortAndPaginateNotes, queryMasterNotes
} = require('../controllers/note.controller');


router.get('/', home);
router.post('/api/notes', createNote);
router.post('/api/notes/bulk', bulkNotes);
router.get('/api/notes', getNotes);

// Search routes
router.get('/api/notes/search/content', searchContentOnly);
router.get('/api/notes/search/all', searchTitleAndContent);
router.get('/api/notes/search', searchTitleOnly);

// Combined concepts routes
router.get('/api/notes/filter-sort', filterAndSortNotes);
router.get('/api/notes/filter-paginate', filterAndPaginateNotes);
router.get('/api/notes/sort-paginate', sortAndPaginateNotes);
router.get('/api/notes/search-filter', searchAndFilterNotes);
router.get('/api/notes/search-sort-paginate', searchSortAndPaginateNotes);
router.get('/api/notes/filter-sort-paginate', filterSortAndPaginateNotes);

// Master route
router.get('/api/notes/query', queryMasterNotes);

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