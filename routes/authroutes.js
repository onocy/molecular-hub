const User = require('../models/User');
const bcrypt = require('bcrypt');


module.exports = app => {
        app.post('/sign-up', (req, res) => {
        const { firstName, lastName, email, password } = req.body
        User.findOne({ email }, (err, user) => {
            if (err) { console.log('Post Error: ', err) }
            else if (user) { res.json('User Exists') }
            else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) { console.log('Hash generation error: ', err) };
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) { console.log('Hash error: ', err) };
                        let hash_password = hash;
                        const newUser = new User({ firstName, lastName, email, password: hash_password });
                        newUser.save((err, savedUser) => {
                            if (err) return res.json(err)
                            res.json('User Created')
                        })
                    });
                });
            }
        })
    });

    app.post('/sign-in', (req, res) => {
        console.log('...')
        console.log('signing in');
        console.log('req', req);
        console.log('req body', req.body);
        User.findOne({'email': req.body.email}, (err, user) => {
            if(!user) {
                res.json('User Not Found');
                console.log('not found');
            }
            else{
                console.log('req pass', req.body.password);
                console.log('user pass', user.password);
                bcrypt.compare(req.body.password, user.password, (err, match) => {
                    if(err) {console.log('Comparison error: ', err)}
                    if(match) {
                        // res.redirect('/dashboard')
                        return res.json('Logged In')
                    } else {
                        return res.json('Wrong Password')
                    }
                });
            }
        });
    });
};