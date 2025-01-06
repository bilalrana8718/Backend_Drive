const jwt = require('jsonwebtoken');


function auth (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }

}

module.exports = auth;