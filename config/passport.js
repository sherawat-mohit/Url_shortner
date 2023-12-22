const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require("../models/user");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({
                email: email
            }).then(user => {
                // Match email
                if (!user) {
                    return done(null, false, { message: "This email is not registered" });
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect' });
                    }
                })
            })
                .catch(err => console.log(err))
        })
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id)
        .then(user => {
            done(null, user);
        })
        .catch(err => {
            done(err);
        });
    });
}