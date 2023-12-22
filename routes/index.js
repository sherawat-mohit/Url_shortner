const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth");

// Welcome Page
router.get('/', (req,res) => {
    res.render('welcome.ejs');
})

// URL shortner
router.get('/url-shortner',ensureAuthenticated, (req,res) => 
    res.render('url-shortner.ejs',{
        user : req.user
    }));


module.exports = router;