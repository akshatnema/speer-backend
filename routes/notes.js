import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
import { addNote, updateNote, deleteNote, shareNote, getAllNotes, getNote } from '../controllers/note.js';
import User from '../models/user.js';
import { extractToken } from '../utils/token.js';

// Add a note
router.post('/', async (req, res) => {
    const tokenResponse = await extractToken(req);

    const { title, content } = req.body;
    const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    const response = await addNote(title, content, user._id);
    return res.status(response.status).json({ message: response.message });
})

// Get all notes of a user
router.get('/', async (req, res) => {
    const tokenResponse = await extractToken(req);

    const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (req.query.id !== undefined) {
        const noteId = req.query.id;
        const response = await getNote(user._id, noteId);
        return res.status(response.status).json({ message: response.message });
    } else {
        const response = await getAllNotes(user._id);
        return res.status(response.status).json({ message: response.message });
    }
})

// Delete a note
router.delete('/', async (req, res) => {
    const tokenResponse = await extractToken(req);;
    const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
    if (req.query.id === undefined) return res.status(400).json({ message: 'Note id is required' });

    const noteId = req.query.id;

    const user = await User.findOne({ email: decoded.email });

    const response = await deleteNote(user._id, noteId);
    return res.status(response.status).json({ message: response.message });
})

// Update a note
router.put('/', async (req, res) => {
    const tokenResponse = await extractToken(req);
    if(req.body.id === undefined) return res.status(400).json({ message: 'Note id is required' });

    const note = req.query.id;

    const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    const { title, content } = req.body;
    const response = await updateNote(note, user._id, title, content);
    return res.status(response.status).json({ message: response.message });
})

// Share a note
router.post('/:id/share', async (req, res) => {
    const tokenResponse = await extractToken(req);
    if(req.body.id === undefined) return res.status(400).json({ message: 'Note id is required' });
    if(req.body.email === undefined) return res.status(400).json({ message: 'Email is required' });

    const note = req.params.id;
    const email = req.body.email;

    const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    const sharedUser = await User.findOne({ email });
    const response = await shareNote(user._id, note, sharedUser._id);
    return res.status(response.status).json({ message: response.message });
})

export default router;