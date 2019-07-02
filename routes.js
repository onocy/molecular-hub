const { File, Molecule, Playlist, User } = require('../models/Models');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


// ------------------------------ HELPERS ----------------------------------------------


const filewalker = (dir, done) => {
    let results = [];    
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file){
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat){
                if (stat && stat.isDirectory()) {
                    // results.push(file);
                    filewalker(file, function(err, res){
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};


// --------------------------------- AUTH -------------------------------------------

const authRoutes = app => {

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
                            req.session.id = savedUser._id;
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
                        req.session.id = user._id;
                        return res.status(200).json(user);
                    } else {
                        return res.status(401).json('Wrong Password')
                    }
                });
            }
        });
    });


    app.post('/sign-out', (req, res) => {
        req.session.destroy(err => {
            if (err) { console.log(err) }
            res.clearCookie('sid');
            res.redirect('/');
        })
    }); 
};

// --------------------------------- SERVICE -------------------------------------------


const serviceRoutes = app => {

    // ---------------- MOLECULES ---------------------  
    
    app.get('/gen-molecules', (req, res) => {
        const mol_dict = {}
        File.find({}, (err, file) => {
            if (err) console.log(err);
            else {
                file.forEach(f => {
                    if (mol_dict[f.name]){
                        mol_dict[f.name].push(f)
                    } else {
                        mol_dict[f.name] = [f]
                    }
                })
            }
            Object.keys(mol_dict).forEach(key => {
                const newMolecule = new Molecule ({name: key, files: mol_dict[key]})
                newMolecule.save((err, savedMolecule) => {
                    if (err) console.log(err);
                    // console.log('molecule saved: ', savedMolecule);
                    // res.send(savedMolecule)
                }); 
            });
            return res.send(mol_dict);
        });
    });
    
    // ---------------- FILES ---------------------

    app.get('/gen-files', (req, res) => {
        filewalker('./assets/molecules', function (err, files) {
            if (err) {
                throw err;
            }
            files.forEach(filePath => {
                let currFile = filePath.split('\\').pop().split('.')
                let newFile = new File({ data: Buffer.from(filePath), name: currFile[0], contentType: currFile[1] })
                newFile.save((err, savedFile) => {
                    if (err) console.log(err);
                    else {
                        console.log('File Created')
                        console.log(newFile)
                    };
                });
            })
            res.json(files);
        });
    })

    app.post('/file', (req, res) => {
        const file = new File({ data: Buffer.from('../assets/molecules/amino_acids/ala.mol'), name: 'ala', contentType: '.mol' });
        file.save((err, savedFile) => {
            if (err) console.log(err);
            else {
                console.log('File Created')
                res.send(savedFile);
            };
        });
    })

    app.get('/file', (req, res) => {
        const id = '5d114fca9ac89a0ed88257da';
        File.findById(id, (err, file) => {
            if (err) console.log(err);
            else {
                res.send(file);
            }
        });
    })

    app.get('/filenames', (req, res) => {
        const result = [];
        File.find({}, (err, file) => {
            if (err) console.log(err);
            else {
                console.log('file_length', file.length);
                console.log(typeof (file));
                file.forEach(f => {
                    result.push({ name: f.name, contentType: f.contentType });
                })
                res.json(result);
            }
        });
    })

    app.get('/files', (req, res) => {
        File.find({}, (err, file) => {
            if (err) console.log(err);
            else {
                res.json(file);
            }
        });
    })

    // ---------------- PLAYLISTS ---------------------
    
    app.get('/playlist', (req, res) => {
        Playlist.find({_id: req.body.id}, (err, playlist) => {
            if (err) console.log(err);
            if (playlist) { res.json(playlist) }
            else { res.json('Not Found')}
        })
    })

    app.get('/playlists', (req, res) => {
        Playlist.find({}, (err, playlists) => {
            if (err) console.log(err);
            res.json(playlists);
        })
    })

    app.post('/gen-playlist', (req, res) => {
        const curr_date = new Date();
        const newPlaylist = new Playlist({ displayInterval: 2000, name: 'newPlaylist', createdAt: curr_date, status: 'queued' });
        newPlaylist.save((err, savedPlaylist) => {
            if (err) console.log(err);
            console.log('playlist saved');
            res.send(savedPlaylist);
        })
    });

    app.delete('/playlist', (req, res) => {
        console.log('attempting delete')
        Playlist.remove({ _id: req.body.id }, (err, playlists) => {
            if (err) console.log(err);
            res.status(200).send('Removed');
        })
    });
};

// ------------------------------------ INSTALLATION ----------------------------------------


const installationRoutes = app => {
    app.get('/current', (req, res) => {
        const key = '123';
        if (req.body.key == key){
            res.send('This is where the current playlist will be sent out after a lookup is performed in the database for the current users current molecule')
        } else {
            res.send('This is an incorrect key. Please connect with the Molecular Hub to receive the key associated with your account.')
        }
    });
}


// ----------------------------------------------------------------------------


module.exports = {
    installationRoutes,
    serviceRoutes, 
    authRoutes
}