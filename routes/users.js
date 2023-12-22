const express = require('express');
const bcrypt = require("bcryptjs"); 
const router = express.Router();
const passport = require('passport')

// Load User Model
const User = require("../models/user.js");

// Login Page
router.get('/login', (req,res) => {
    res.render("login");
})

// Register Page
router.get('/register', (req,res) => {
    res.render("register");
})

// Register Handle 
router.post('/register', (req, res) => {
    const {name, email,password, password2} = req.body;
    let errors = [];
    // Checking required fields
    if(!name || !email || !password || !password2){
        errors.push({msg : "Please fill in all fields"});
    }

    // Checking password match
    if(password !== password2){
        errors.push({msg : "Passwords do not match"});
    }

    // Checking password length
    if(password.length < 6){
        errors.push({msg : "Passwords should be atleast 6 characters"})
    }

    if(errors.length > 0){
        res.render('register',{
            errors, name, email, password, password2
        })
    }else{
        //Validation passed
        User.findOne({email : email})
        .then(user => {
            if(user){
                //User exists
                errors.push({msg:"Email is already registered"});
                res.render('register',{
                    errors, name, email, password, password2
                })
            }else{
                const newUser = new User({
                    name, email, password
                })
                
                // Hash password
                bcrypt.genSalt(10, (err, salt)=>
                    bcrypt.hash(newUser.password, salt,(err,hash)=>{
                        if(err) throw err;
                        
                        //Set password to hashed
                        newUser.password = hash;

                        //Saving the user
                        newUser.save()
                        .then(user =>{
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect("/users/login");
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }
})

// Login Handle
router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/url-shortner',
        failureRedirect : '/users/login',
        failureFlash:true
    })(req,res,next);
})

// Logout handler
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
  });

module.exports = router;