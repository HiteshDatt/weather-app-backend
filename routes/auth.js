const express = require("express");
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const users = require('../models/users');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";

const client = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI
});


router.get('/google', (req, res) => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email']
    });
    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {

    // Using Oauth to authenticate using google (without username/password)
    const { code } = req.query;
    const { tokens } = await client.getToken({ code });
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();


    // TODO: Get user role from DB instead. (Should be present at the time that user is invited)
    let userRole = users?.find((user) => user?.email === payload?.email)?.role;

    if (!userRole) {
        //TODO: Optional- adding the new user in DB or we can reject it if it is an invite-only platform 
        userRole = "user";
        users.push({
            id: users.length + 1,
            email: payload?.email,
            role: userRole,
        })
    }

    //TODO: Save user data to database
    const user = {
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        role: userRole
    };

    // User authenticated without password from the code above (trusting google for that)
    const token = jwt.sign(user, JWT_SECRET);

    res.send({ token });
});


module.exports = router;