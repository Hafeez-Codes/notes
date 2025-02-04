const express = require('express');
const {
	addNote,
	editNote,
	getAllNote,
	deleteNote,
	updateIsPinned,
	searchNotes,
} = require('../controllers/note.controller');
const { authenticateToken } = require('../utilities');
const router = express.Router();

router.use(authenticateToken)

router.post('/add-note', addNote);
router.put('/edit-note/:noteId', editNote);
router.get('/get-all-notes/', getAllNote);
router.delete('/delete-note/:noteId', deleteNote);
router.put('/update-note-pinned/:noteId', updateIsPinned);
router.get('/search-notes/', searchNotes);

module.exports = router;
