const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Format: "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        
        // Add user info to request object
        req.user = decoded;  // Contains { id, username }
        
        next();  // Continue to the route handler
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;