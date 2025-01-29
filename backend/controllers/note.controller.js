const Note = require('../models/note.model');

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

const editNote = async (req, res) => {
	console.log('User:', req.user); // 🔍 Debugging

	if (!req.user) {
		return res
			.status(401)
			.json({ error: true, message: 'User not authenticated' });
	}

	const noteId = req.params.noteId;
	const { title, content, tags, isPinned } = req.body;
	const user = req.user;

	if (!title && !content && !tags) {
		return res
			.status(400)
			.json({ error: true, message: 'No changes Provided' });
	}

	try {
		const note = await Note.findOne({ _id: noteId, userId: user.user.id });

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

module.exports = { addNote, editNote };
