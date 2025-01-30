const express = require('express');
const {
	addNote,
	editNote,
	getAllNote,
	deleteNote,
	updateIsPinned,
} = require('../controllers/note.controller');
const { authenticateToken } = require('../utilities');
const router = express.Router();

router.post('/add-note', authenticateToken, addNote);
router.put('/edit-note/:noteId', authenticateToken, editNote);
router.get('/get-all-notes/', authenticateToken, getAllNote);
router.delete('/delete-note/:noteId', authenticateToken, deleteNote);
router.put('/update-note-pinned/:noteId', authenticateToken, updateIsPinned);

module.exports = router;
