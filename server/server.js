// const express = require('express');
// const cors = require('cors');
// const app = express();
// require('dotenv').config();
// const port = process.env.PORT;
// require('./config/mongoose.config'); // This is new
// app.use(cors());
// app.use(express.json()); // This is new
// app.use(express.urlencoded({ extended: true })); // This is new
// require('./routes/user.routes')(app);
    
// app.listen(port, () => console.log(`Listening on port: ${port}`) );


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Add this line
const app = express();
require("dotenv").config();
const port = process.env.PORT;
require("./config/mongoose.config");

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this line to use cookie-parser

// Import and use routes
require("./routes/user.routes")(app);

app.listen(port, () => console.log(`Listening on port: ${port}`));
