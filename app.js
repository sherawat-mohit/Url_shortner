const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');

// initializing express
const app = express();

// Passport config
require("./config/passport")(passport)
// DB config
const db = require('./config/keys.js').MongoURI;


// setting port for out application
const PORT = process.env.PORT || 5000;

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})

// Routes
app.use("/", require("./routes/index.js"))
app.use("/users", require("./routes/users.js"))


// connect to mongo
mongoose.connect(db)
    .then(() => console.log("Connected to the MongoDB Database"))
    .catch(err => console.log(err));


app.listen(PORT, console.log(`Server is up and running on port : ${PORT}`));