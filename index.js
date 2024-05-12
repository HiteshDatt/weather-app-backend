const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const auth = require("./routes/auth");

app.use("/auth", auth);

// one file will contain all the routes starting with "/analytics" and middleware wont allow this file routes to if requested user is not admin, like  /analytics/wheather

// another file with all routes starting with "/management" like /management/user

// private Route
app.get('/private', (req, res) => {
    // Verify JWT token
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, JWT_SECRET);
        res.send({ message: `Welcome, ${user.name}! This is a private area.` });
    } catch {
        res.send({ message: `NOT ALLOWED! This is a private area.` });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
