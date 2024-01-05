import express, { json, urlencoded } from 'express';
import db from './config/db.js';
import mainRoute from './routes/index.js';
import notesRoute from './routes/notes.js';
import searchRoute from './routes/search.js';
import { authenticatedUser } from './middleware/user.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(urlencoded({ extended: true }))
app.use(cors());

app.use('/api/notes', authenticatedUser, notesRoute)
app.use('/api/auth', mainRoute)
app.use('/api/search', authenticatedUser, searchRoute)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});