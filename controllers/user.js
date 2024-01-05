import { genSalt, hash, compare } from 'bcrypt';

import User from '../models/user.js';

const validEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

const userSignup = async (name, email, password) => {
    if (!name || !email || !password) {
        return { status: 400, message: 'All fields are required' }
    }

    if (!validEmailFormat(email)) {
        return { status: 400, message: 'Invalid email format' }
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const user = await User.findOne({ email });
    if (user) {
        return { status: 400, message: 'Email already registered' }
    }

    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return { status: 201, message: 'User registered successfully' }

    } catch (error) {
        return { status: 500, message: 'Internal Server Error' }
    }
}

const userLogin = async (email, password) => {
    try {
        if (!email || !password) {
            return { status: 400, message: 'All fields are required' }
        }

        if (!validEmailFormat(email)) {
            return { status: 400, message: 'Invalid email format' }
        }

        const user = await User.findOne({ email });

        if (!user) {
            return { status: 401, message: 'Invalid credentials' }
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return { status: 401, message: 'Invalid credentials' }
        }

        return { status: 200, message: 'Login successful' }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

export {
    userSignup, userLogin
}