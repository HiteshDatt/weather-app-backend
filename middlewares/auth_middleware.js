const jwt = require('jsonwebtoken');
require('dotenv').config();
const user_roles = require("../models/user_roles");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    let role;

    try {
        const tokenValue = token.split(' ')[1];
        const user = jwt.verify(tokenValue, process.env.JWT_SECRET);
        role = user.role;
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (!role) {
        return res.status(403).json({ message: 'Unauthorized role' });
    }

    const pathPrefix = req.path?.split("/")?.[1];

    // Check if permission is present for this role from DB
    if (user_roles.find((user_role) => user_role.role === role).permissions.includes(pathPrefix)) {
        return next();
    } else {
        return res.status(403).json({ message: 'Unauthorized role' });
    }

}

module.exports = authMiddleware