import { Router } from 'express';
import jwt from 'jsonwebtoken';
const router = Router();
import User from '../models/user.js';
import { extractToken } from '../utils/token.js';
import { searchNotes } from '../controllers/note.js';

// Seach for a note

router.get('/', async (req, res) => {
    try {
        const tokenResponse = await extractToken(req);
        const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });
        const { q } = req.query;
        const response = await searchNotes(user._id, q);
        return res.status(response.status).json({ message: response.message });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;