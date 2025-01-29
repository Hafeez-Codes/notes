const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
		if (err) return res.sendStatus(403); // Unauthorized access

		req.user = decodedToken; // 🔹 Ensure consistency with JWT payload
		next();
	});
}

module.exports = { authenticateToken };
