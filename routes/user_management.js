const express = require("express");
const router = express.Router();
const users = require("../models/users")

router.get('/', (req, res) => {
    return res.status(200).json({ message: "OK" });
});

router.patch('/modify_user_role', (req, res) => {
    const userEmail = req.body.email;
    const userRole = req.body.role;

    // TODO: get userID from DB
    const userId = users.findIndex(user => user.email === userEmail);

    if (userId >= 0) {
        users[userId].role = userRole;
        return res.status(200).json({ data: users[userId] });
    } else {
        return res.status(404).json({ message: 'User not found' });
    }
});


module.exports = router;