require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json');
const userRoutes = require('./routes/user.routes');
const noteRoutes = require('./routes/note.routes');

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(config.connectionString);

app.use(express.json());
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
	res.json({ data: 'hello' });
});

app.use('', userRoutes);
app.use('', noteRoutes);

// Error handling middleware
app.use((req, res, next) => {
	res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
