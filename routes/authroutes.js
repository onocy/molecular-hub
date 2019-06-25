const { File, Molecule, Playlist, User } = require('../models/Models');
const bcrypt = require('bcrypt');


module.exports = app => {

    /* Sign up with parameters sent via request body
    Password is hashed before added to DB */

    app.post('/sign-up', (req, res) => {
        const { firstName, lastName, email, password } = req.body
        User.findOne({ email }, (err, user) => {
            if (err) { console.log('Post Error: ', err) }
            else if (user) { res.status(403).json('User Exists') }
            else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) { console.log('Hash generation error: ', err) };
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) { console.log('Hash error: ', err) };
                        let hash_password = hash;
                        const newUser = new User({ firstName, lastName, email, password: hash_password });
                        newUser.save((err, savedUser) => {
                            if (err) return res.json(err)
                            res.status(201).json(savedUser)
                        })
                    });
                });
            }
        })
    });

    /* Sign in with parameters sent via request body
    Hashed password is checked with stored password */

    app.post('/sign-in', (req, res) => {
        User.findOne({ 'email': req.body.email }, (err, user) => {
            if (!user) {
                res.status(404).json('User Not Found');
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, match) => {
                    if (err) { console.log('Comparison error: ', err) }
                    if (match) {
                        return res.status(200).json(user);
                    } else {
                        return res.status(401).json('Wrong Password')
                    }
                });
            }
        });
    });
};