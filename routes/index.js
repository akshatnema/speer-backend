import { Router } from 'express';
import { userSignup, userLogin } from '../controllers/user.js';
import jwt from 'jsonwebtoken'; // Add the missing import statement for 'jsonwebtoken'
const router = Router();

router.post('/signup', async (req, res) => {
    const { email, name, password } = req.body;

    const response = await userSignup(name, email, password);
    res.status(response.status).json({ message: response.message });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const response = await userLogin(email, password);

    if (response.status === 200) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(response.status).json({ message: response.message, token });
    } else {
        res.status(response.status).json({ message: response.message });
    }
});

export default router;