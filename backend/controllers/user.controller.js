const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// @desc    Create a new user
// @route   POST /api/users/create-account
// @access  Public
const createAccount = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email) {
        return res
            .status(400)
            .json({ error: true, message: 'Full Name and Email are required' });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: 'Password is required' });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ error: true, message: 'User already exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign(
        { user: { id: user._id, email: user.email } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '36000m' }
    );

    return res.json({
        error: false,
        user,
        accessToken,
        message: 'Account created successfully',
    });
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: 'Email is required' });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: 'Password is required' });
    }

    try {
        const userInfo = await User.findOne({ email: email });

        if (!userInfo) {
            return res
                .status(400)
                .json({ error: true, message: 'User not found' });
        }

        // 🔹 Compare hashed password using bcrypt
        const isMatch = await bcrypt.compare(password, userInfo.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ error: true, message: 'Invalid Credentials' });
        }

        // 🔹 Standardize JWT payload (Include user inside an object)
        const user = { user: { id: userInfo._id, email: userInfo.email } };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '36000m',
        });

        return res.json({ accessToken });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: 'Internal Server Error' });
    }
};

// @desc    Get user
// @route   GET /api/users/get-user
// @access  Private
const getUser = async (req, res) => {
    const userId = req.user.user.id; // Ensure correct extraction of user ID

    try {
        const isUser = await User.findById(userId); // Use findById for better readability

        if (!isUser) {
            return res.sendStatus(401);
        }

        return res.json({
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                id: isUser._id,
                createdOn: isUser.createdOn,
            },
            message: '',
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' });
    }
};

module.exports = { createAccount, login, getUser };
