const mongoose = require("mongoose")
const Notes = require("../models/note.model")

const sanitizeId = (id) => (typeof id === "string" ? id.replace(/^:/, "") : id)
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)


// Home Route 
const home = async (req,res) => {
    res.status(200).json({message : "Hello Welcome!"})
}

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
        const noteId = sanitizeId(req.params.id);

        if (!isValidObjectId(noteId)) {
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
        const noteID = sanitizeId(req.params.id);

        if (!isValidObjectId(noteID)) {
            return res.status(400).json({ message: "Invalid note id" })
        }

        const updateNote = await Notes.findByIdAndUpdate(
            noteID,
            { $set: req.body }
        )

        if (!updateNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            message: "Note updated",
            user: updateNote
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

        const sanitizedIds = ids.map(sanitizeId)

        if (!sanitizedIds.every(isValidObjectId)) {
            return res.status(400).json({ message: "One or more ids are invalid" })
        }

        const deleteUser = await Notes.deleteMany({
            _id: { $in: sanitizedIds }
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
        const noteID = sanitizeId(req.params.id);

        if (!isValidObjectId(noteID)) {
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


module.exports = { createNote, bulkNotes, getNotes, getNotesID, replaceNote, replacePart, deletebyID, deleteBulkbyID }