const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Token received:", token); // Debugging statement

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            console.error("Token verification error:", err); // Debugging statement
            return res.sendStatus(403); // Forbidden
        }

        req.user = decodedToken; // Ensure consistency with JWT payload
        console.log("Decoded token:", decodedToken); // Debugging statement
        next();
    });
}

module.exports = { authenticateToken };
