const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({extended : false}));

 

// Routes
app.use("/", require("./routes/index.js"))
app.use("/users", require("./routes/users.js"))

// DB config
const db = require('./config/keys.js').MongoURI;

// connect to mongo
mongoose.connect(db)
    .then(() => console.log("Connected to the MongoDB Database"))
    .catch(err => console.log(err));


app.listen(PORT, console.log(`Server is up and running on port : ${PORT}`));