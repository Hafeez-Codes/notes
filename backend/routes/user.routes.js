const express = require('express');
const router = express.Router();
const { createAccount, login, getUser } = require('../controllers/user.controller');
const { authenticateToken } = require('../utilities');

router.post('/create-account', createAccount);
router.post('/login', login);
router.get('/get-user', authenticateToken, getUser);

module.exports = router;
