const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;


// overrides default local strategy and specifies where to get values for varifyCallback
const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};


// our passport strategy needs a verify callback
const verifyCallback = (username, password, done) => {
    // done is a function that results of authentication is passed to
    // post request will have username/password from html form completed by user
    // parameters populated by passport framework
    // so passport local-strategy needs naming to be correct
    // can override and tell passport which filds to look in
    // essentially we're writing our own implementation of password verification
    // which database doesn't matter
    // how we verify credentials doesn't matter
    // all that matters is that parameters passed to 'done' are what passport expects

    // go to mongo database
    User.findOne({ username: username })
    .then( (user) => {
        // user populated by result of findOne

        // if not found. null=>no error, false=>no user found
        if (!user) { return done(null, false) }

        const isValid = validPassword(password, user.hash, user.salt);  // not yet implemented

        if (isValid) {
            return done(null,user);
        } else {
            return done(null, false);
        }
    })
    .catch( (err) => {
        done(err);
    });
}

// first define what passport strategy we are going to use
const strategy = new LocalStrategy();


// TODO: passport.use();