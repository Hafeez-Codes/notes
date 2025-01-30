const express = require('express');
const {
	addNote,
	editNote,
	getAllNote,
} = require('../controllers/note.controller');
const { authenticateToken } = require('../utilities');
const router = express.Router();

router.post('/add-note', authenticateToken, addNote);
router.put('/edit-note/:noteId', authenticateToken, editNote);
router.get('/get-all-notes/', authenticateToken, getAllNote);

module.exports = router;
