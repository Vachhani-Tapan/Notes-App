const Notes = require("../models/note.model")


// 1. POST Single Note (/api/note)
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


module.exports = { createNote, bulkNotes }