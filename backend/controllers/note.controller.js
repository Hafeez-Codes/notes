const Note = require('../models/note.model');

// @desc    Add new note
// @route   POST /api/notes/add-note
// @access  Public
const addNote = async (req, res) => {
	const { title, content, tags } = req.body;
	const user = req.user.user;

	if (!title) {
		return res
			.status(400)
			.json({ error: true, message: 'Title is required' });
	}

	if (!content) {
		return res
			.status(400)
			.json({ error: true, message: 'Content is required' });
	}

	try {
		const note = new Note({
			title,
			content,
			tags: tags || [],
			userId: user.id,
		});

		await note.save();

		return res.json({
			error: false,
			note,
			message: 'Note added successfully',
		});
	} catch (error) {
		console.error('Error adding note:', error);
		return res.status(500).json({
			error: true,
			message: error.message || 'Internal Server Error',
		});
	}
};

// @desc    Edit note
// @route   POST  /api/notes/edit-note/:noteId
// @access  Public
const editNote = async (req, res) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ error: true, message: 'User not authenticated' });
	}

	const noteId = req.params.noteId;
	const { title, content, tags, isPinned } = req.body;
	const user = req.user.user;

	if (!title && !content && !tags) {
		return res
			.status(400)
			.json({ error: true, message: 'No changes Provided' });
	}

	try {
		const note = await Note.findOne({ _id: noteId, userId: user.id });

		if (!note) {
			return res
				.status(404)
				.json({ error: true, message: 'Note not found' });
		}

		if (title) note.title = title;
		if (content) note.content = content;
		if (tags) note.tags = tags;
		if (isPinned) note.isPinned = isPinned;

		await note.save();

		return res.json({
			error: false,
			note,
			message: 'Note updated successfully',
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: true, message: 'Internal Server Error' });
	}
};

// @desc    Get all notes
// @route   GET /api/notes/get-all-notes
// @access  Public
const getAllNote = async (req, res) => {
	const userId = req.user.user.id;

	try {
		const notes = await Note.find({ userId }).sort({
			isPinned: -1,
		});

		return res.json({
			error: false,
			notes,
			message: 'All notes retrieved successfully',
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: 'Internal Server Error',
		});
	}
};

// @desc    Delete note
// @route   DELETE api/notes/delete-note/:noteId
// @access  Public
const deleteNote = async (req, res) => {
	const noteId = req.params.noteId;
	const userId = req.user.user.id;

	try {
		const note = await Note.findOne({ _id: noteId, userId });

		if (!note) {
			return res
				.status(404)
				.json({ error: true, message: 'Note not found' });
		}

		await Note.deleteOne({ _id: noteId, userId });

		return res.json({
			error: false,
			message: 'Note deleted successfully',
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: 'Internal Server Error',
		});
	}
};

// @desc    Update isPinned Value of a note
// @route   PUT api/notes/update-note-pinned/:noteId
// @access  Public
const updateIsPinned = async (req, res) => {
	if (!req.user) {
		return res
			.status(401)
			.json({ error: true, message: 'User not authenticated' });
	}

	const noteId = req.params.noteId;
	const { isPinned } = req.body;
	const user = req.user.user;

	try {
		const note = await Note.findOne({ _id: noteId, userId: user.id });

		if (!note) {
			return res
				.status(404)
				.json({ error: true, message: 'Note not found' });
		}

		note.isPinned = isPinned || false;

		await note.save();

		return res.json({
			error: false,
			note,
			message: 'Note updated successfully',
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ error: true, message: 'Internal Server Error' });
	}
};

// @desc    Search for notes
// @route   GET api/notes/search-notes/
// @access  Public
const searchNotes = async (req, res) => {
	const user = req.user.user;
	const { query } = req.query;

	if (!query) {
		return res
			.status(400)
			.json({ error: true, message: 'Search query is required' });
	}

	try {
		const matchingNotes = await Note.find({
			userId: user.id,
			$or: [
				{ title: { $regex: new RegExp(query, 'i') } },
				{ content: { $regex: new RegExp(query, 'i') } },
			],
		});

		return res.json({
			error: false,
			notes: matchingNotes,
			message: 'Notes matching the search query retrieved succesfully',
		});
	} catch (error) {
		return res.status(500).json({
			error: true,
			message: 'Internal Server Error',
		});
	}
};

module.exports = {
	addNote,
	editNote,
	getAllNote,
	deleteNote,
	updateIsPinned,
	searchNotes,
};
