const express = require('express');
require('dotenv').config();
const app = express();
const auth = require("./routes/auth");
const user_management = require("./routes/user_management");
const weather_analytics = require("./routes/weather_analytics");
const authMiddleware = require("./middlewares/auth_middleware");
app.use(express.json())

// Public routes
app.use("/auth", auth);

app.use(authMiddleware);

// Private Routes
app.use('/user_management', user_management);
app.use('/weather_analytics', weather_analytics);


app.listen(9000, () => {
    console.log('Server is running on port 9000');
});
