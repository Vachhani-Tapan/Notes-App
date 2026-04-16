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

module.exports = { createNote }