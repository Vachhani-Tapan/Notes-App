const mongoose = require("mongoose")
const Notes = require("../models/note.model")


// Home Route 
const home = async (req,res) => {
    res.status(200).json({message : "Hello Welcome!"})
}

// 1. POST Single Note (/api/notes)
const createNote = async (req, res) => {
    try {
        const { title, content, category, isPinned } = req.body;

        const newNote = new Notes({ title, category, content, isPinned });
        await newNote.save();

        res.status(201).json({
            msg: 'Notes added successfully.',
            note: newNote,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 2. POST Multiple Notes (/api/notes/bulk)
const bulkNotes = async (req, res) => {
    try {
        const notes = req.body;
        const newNotes = await Notes.insertMany(notes);

        res.status(201).json({
            msg: 'Multiple notes added successfully.',
            notes: newNotes,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// GET Get all Notes (/api/notes)
const getNotes = async (req, res) => {
    try {
        const data = await Notes.find();

        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message })
    }
}


// GET Get notes by ID (/api/notes/:id)
const getNotesID = async (req, res) => {
    try {
        const noteId = (req.params.id);

        if (!noteId) {
            return res.status(400).json({ message: "Invalid note id" })
        }

        const Note = await Notes.findById(noteId);

        if (!Note) {
            res.status(404).json({ message: "User Not Found Enter valid ID", err: err.message })
        }

        res.status(200).json({
            message: "Note fetched Successfully",
            note: Note
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message })
    }
}


// PUT (/api/notes/:id) — Replace a note completely
const replaceNote = async (req, res) => {
    try {
        const notes = req.body;
        const noteID = req.params.id;

        const Note = await Notes.findByIdAndUpdate(
            noteID, notes
        )
        if (!Note) {
            return res.status(404).json({
                message: "Note not found. Enter a valid ID"
            });
        }
        res.status(200).json({
            message: "Note updated successfully",
            note: Note
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message })
    }
}


// PATCH /api/notes/:id — Update specific fields only
const replacePart = async (req, res) => {
    try {
        const noteID = (req.params.id);

        if (!noteID) {
            return res.status(400).json({ message: "Invalid note id" })
        }

        const updateNote = await Notes.findByIdAndUpdate(
            noteID,
            { $set: req.body },
            { new: true }
        )

        if (!updateNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            message: "Note updated",
            note: updateNote
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server side Error", err: err.message })
    }
}


// DELETE /api/notes/bulk — Delete multiple notes
const deleteBulkbyID = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "ids must be a non-empty array"
            });
        }

        const deleteUser = await Notes.deleteMany({
            _id: { $in: ids }
        })

        res.status(200).json({
            message: "Users deleted Successfully",
            deletedCount: deleteUser.deletedCount
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
}


// DELETE /api/notes/:id — Delete a single note
const deletebyID = async (req, res) => {
    try {
        const noteID = (req.params.id);

        if (!(noteID)) {
            return res.status(400).json({ message: "Invalid note id" })
        }

        const deleteUser = await Notes.findByIdAndDelete(noteID);

        if (!deleteUser) {
            return res.status(404).json({ msg: "User not found" })
        }
        res.status(200).json({ message: "User deleted Successfully" })
    }
    catch (err) {
        res.status(500).json({
            message: "Server Error",
            err: err.message
        });
    }
}


// 9. GET /api/notes/category/:category — Filter notes by category
const getNotesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ["work", "personal", "study"];

        if (!validCategories.includes(category.toLowerCase())) {
            return res.status(400).json({
                message: `Invalid category. Must be one of: ${validCategories.join(", ")}`
            });
        }

        const notes = await Notes.find({ category: category.toLowerCase() });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 10. GET /api/notes/status/:isPinned — Filter notes by pinned status
const getNotesByPinnedStatus = async (req, res) => {
    try {
        const { isPinned } = req.params;

        if (isPinned !== "true" && isPinned !== "false") {
            return res.status(400).json({
                message: "isPinned parameter must be 'true' or 'false'"
            });
        }

        const pinnedVal = isPinned === "true";
        const notes = await Notes.find({ isPinned: pinnedVal });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 11. GET /api/notes/:id/summary — Route param + field select
const getNoteSummary = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Notes.findById(id).select('title content category isPinned');

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            message: "Note summary fetched successfully",
            note: {
                _id: note._id,
                title: note.title,
                category: note.category,
                isPinned: note.isPinned,
                summary: note.content.length > 60 ? note.content.substring(0, 60) + "..." : note.content
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 12. GET /api/notes/filter — Query params
const filterNotes = async (req, res) => {
    try {
        const { category, isPinned } = req.query;
        const query = {};

        if (category) {
            query.category = category.toLowerCase();
        }
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const notes = await Notes.find(query);
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 13. GET /api/notes/filter/pinned — Query params
const filterPinnedNotes = async (req, res) => {
    try {
        const { category } = req.query;
        const query = { isPinned: true };

        if (category) {
            query.category = category.toLowerCase();
        }

        const notes = await Notes.find(query);
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 14. GET /api/notes/filter/category — Query params
const filterCategoryNotes = async (req, res) => {
    try {
        const { name, category, isPinned } = req.query;
        const categoryVal = name || category;

        if (!categoryVal) {
            return res.status(400).json({ message: "Category parameter 'name' or 'category' is required" });
        }

        const query = { category: categoryVal.toLowerCase() };
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const notes = await Notes.find(query);
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 15. GET /api/notes/filter/date-range — Query params
const filterNotesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Both 'startDate' and 'endDate' query parameters are required" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
        }

        const query = {
            createdAt: {
                $gte: start,
                $lte: end
            }
        };

        const notes = await Notes.find(query);
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 16. GET /api/notes/paginate — Pagination
const paginateNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalNotes = await Notes.countDocuments();
        const notes = await Notes.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 17. GET /api/notes/paginate/category/:category — Pagination + Route param
const paginateNotesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { category: category.toLowerCase() };
        const totalNotes = await Notes.countDocuments(query);
        const notes = await Notes.find(query)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            category,
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 18. GET /api/notes/sort — Sorting
const sortNotes = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const notes = await Notes.find().sort({ [sortBy]: order });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// 19. GET /api/notes/sort/pinned — Sorting on filtered set
const sortPinnedNotes = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const notes = await Notes.find({ isPinned: true }).sort({ [sortBy]: order });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Search — 9. GET /api/notes/search — Search title only
const searchTitleOnly = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query parameter 'q' is required" });
        }
        const notes = await Notes.find({ title: { $regex: q, $options: 'i' } });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Search — 10. GET /api/notes/search/content — Search content only
const searchContentOnly = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query parameter 'q' is required" });
        }
        const notes = await Notes.find({ content: { $regex: q, $options: 'i' } });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Search — 11. GET /api/notes/search/all — Search title + content
const searchTitleAndContent = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query parameter 'q' is required" });
        }
        const notes = await Notes.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ]
        });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Two Concepts Combined — 12. GET /api/notes/filter-sort — Query params + Sorting
const filterAndSortNotes = async (req, res) => {
    try {
        const { category, isPinned, sortBy, order } = req.query;
        const query = {};

        if (category) {
            query.category = category.toLowerCase();
        }
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const notes = await Notes.find(query).sort({ [sortField]: sortOrder });
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Two Concepts Combined — 13. GET /api/notes/filter-paginate — Query params + Pagination
const filterAndPaginateNotes = async (req, res) => {
    try {
        const { category, isPinned } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (category) {
            query.category = category.toLowerCase();
        }
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const totalNotes = await Notes.countDocuments(query);
        const notes = await Notes.find(query).skip(skip).limit(limit);

        res.status(200).json({
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Two Concepts Combined — 14. GET /api/notes/sort-paginate — Sorting + Pagination
const sortAndPaginateNotes = async (req, res) => {
    try {
        const { sortBy, order } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const totalNotes = await Notes.countDocuments();
        const notes = await Notes.find()
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Two Concepts Combined — 15. GET /api/notes/search-filter — Search + Query params
const searchAndFilterNotes = async (req, res) => {
    try {
        const { q, category, isPinned } = req.query;
        const query = {};

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ];
        }
        if (category) {
            query.category = category.toLowerCase();
        }
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const notes = await Notes.find(query);
        res.status(200).json(notes);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Three Concepts Combined — 16. GET /api/notes/search-sort-paginate — Search + Sort + Paginate
const searchSortAndPaginateNotes = async (req, res) => {
    try {
        const { q, sortBy, order } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ];
        }

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const totalNotes = await Notes.countDocuments(query);
        const notes = await Notes.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Three Concepts Combined — 17. GET /api/notes/filter-sort-paginate — Filter + Sort + Paginate
const filterSortAndPaginateNotes = async (req, res) => {
    try {
        const { category, isPinned, sortBy, order } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (category) {
            query.category = category.toLowerCase();
        }
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const totalNotes = await Notes.countDocuments(query);
        const notes = await Notes.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


// Master Endpoint — 18. GET /api/notes/query — Everything — search + filter + sort + paginate
const queryMasterNotes = async (req, res) => {
    try {
        const { q, category, isPinned, sortBy, order } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ];
        }
        if (category) {
            query.category = category.toLowerCase();
        }
        if (isPinned !== undefined) {
            query.isPinned = isPinned === 'true';
        }

        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;

        const totalNotes = await Notes.countDocuments(query);
        const notes = await Notes.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit),
            currentPage: page,
            limit,
            notes
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", err: err.message });
    }
}


module.exports = {
    createNote,
    bulkNotes,
    getNotes,
    getNotesID,
    replaceNote,
    replacePart,
    deletebyID,
    deleteBulkbyID,
    home,
    getNotesByCategory,
    getNotesByPinnedStatus,
    getNoteSummary,
    filterNotes,
    filterPinnedNotes,
    filterCategoryNotes,
    filterNotesByDateRange,
    paginateNotes,
    paginateNotesByCategory,
    sortNotes,
    sortPinnedNotes,
    searchTitleOnly,
    searchContentOnly,
    searchTitleAndContent,
    filterAndSortNotes,
    filterAndPaginateNotes,
    sortAndPaginateNotes,
    searchAndFilterNotes,
    searchSortAndPaginateNotes,
    filterSortAndPaginateNotes,
    queryMasterNotes
}