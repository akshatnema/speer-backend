import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { extractToken } from '../utils/token.js';

// function to check whether API made by an authenticated user or not
const authenticatedUser = async (req, res, next) => {
    try {
        const tokenResponse = await extractToken(req);
        if (tokenResponse.status!==200) return res.status(tokenResponse.status).json({ error: tokenResponse.message });
        
        const decoded = jwt.verify(tokenResponse.message, process.env.JWT_SECRET);
        if (expiredToken(decoded)) res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findOne({ email: decoded.email });

        if (user) next();
        else return res.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// function to check whether token has expired or not
const expiredToken = (decodedToken) => {
    const currentTime = Math.floor(Date.now() / 1000);

    // Compare the current time with the expiration time
    return decodedToken.exp < currentTime;
}

export {
    authenticatedUser
}