const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const User = require('./models/User');
const bcrypt = require('bcrypt');


var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy(
    (username, password, done) => {
        new User({ username, password }).save();
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

const app = express();

const port = process.env.PORT || 3001;

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(console.log('dbconnected'));

app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'molecular hub', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(passport.initialize());
app.use(passport.session());


app.post('/sign-up', (req, res) => {
    const { firstName, lastName, email, password } = req.body
    console.log(req.body);
    User.findOne({ email }, (err, user) => {
        if (err) { console.log('Post Error: ', err) }
        else if (user) { res.json({ error: `A user already exists with email: ${email}` }) }
        else {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) { console.log('Hash generation error: ', err) };
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) { console.log('Hash error: ', err) };
                    let hash_password = hash;
                    const newUser = new User({ firstName, lastName, email, password: hash_password });
                    newUser.save((err, savedUser) => {
                        if (err) return res.json(err)
                        res.json(savedUser)
                    })
                });
            });
        }
    })
})

app.post('/sign-in', (req, res) => {
    User.findOne({'email': req.body.email}, (err, user) => {
        if(!user) res.json('User Not Found');
        else{
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if(err) {console.log('Comparison error: ', err)}
                if(match) {
                    return res.json('Logged In')
                } else {
                    return res.json('Wrong Password')
                }
            });
        }
    });
});

app.listen(port, console.log(`Port is now running on port: ${port}`));  