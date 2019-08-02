const { File, Molecule, Playlist, User } = require('./models');
const { filewalker } = require('./helpers');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


// --------------------------------- AUTH -------------------------------------------

module.exports = function(app) {


/**
 * Test the server to see if online on proper port.
 */
    app.get('/0', (req, res) => {
        res.json('Server is working.')
    });

    
/** 
 * Sign up - parameters sent via request body.
 * @param {string} firstName 
 * @param {string} lastName 
 * @param {email} email 
 * @param {string} password 
 * User is created with passed parameters.
 * Session id created from session id of new User.
 * Password is hashed before added to DB.
 */
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

/** 
 * Sign in with parameters sent via request body.
 * @param {string} email 
 * DB lookup on the user email.
 * Hashed password attempt is checked with stored hashed password of found user.
 */
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

/** 
 * Sign out by clearing cookie and redirecting to signin.
 */
    app.post('/sign-out', (req, res) => {
        req.session.destroy(err => {
            if (err) { console.log(err) }
            res.clearCookie('sid');
            res.redirect('/');
        })
    }); 
    
    // ---------------- FILES ---------------------

/**
 * Generates files as Buffers in DB from local directory of molecules. 
 * In this case './assets/molecules' is the folder with '.mol', '.pdb' pairs.
 * Files are saved as {data, name, contentType} objects.
 * name and content type are parsed from the filename.
 */
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
            res.status(201).json(files);
        });
    })

/**
 * Generates a single file within the DB. 
 * This endpoint is primarily used for testing.
 */
    app.post('/file', (req, res) => {
        const file = new File({ data: Buffer.from('../assets/molecules/amino_acids/ala.mol'), name: 'ala', contentType: '.mol' });
        file.save((err, savedFile) => {
            if (err) console.log(err);
            else {
                console.log('File Created')
                res.status(201).send(savedFile);
            };
        });
    })

/**
 * Finds a file via a passed id.
 * If no passed id in request body, a file id is used by default. 
 */    
    app.get('/file', (req, res) => {
        const id = '';
        if (req.body.id){
            id = req.body.id
        } else {
            id = '5d114fca9ac89a0ed88257da';
        }    
        File.findById(id, (err, file) => {
            if (err) console.log(err);
            else {
                res.status(200).send(file);
            }
        });
    })


/**
 * Finds all files, and prints their content.
 * Also initially prints the length of the result as well as the type.
 */
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
                res.status(200).json(result);
            }
        });
    })

    app.get('/files', (req, res) => {
        File.find({}, (err, file) => {
            if (err) console.log(err);
            else {
                res.status(200).json(file);
            }
        });
    })

    // ---------------- MOLECULES ---------------------  

/**
 * Iterates over the molecules and creates a dictionary with a fileName => file mapping. 
 * For each of the dictionary rows, a corresponding molecule is created and saved to the DB.
 * This structure is created ot have a visual representation of the list of molecules stored.
 * This 
 */
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
                }); 
            });
            return res.status(201).send(mol_dict);
        });
    });
    
   

    // ---------------- PLAYLISTS ---------------------
    

/**
 * 
 */
    app.get('/playlist', (req, res) => {
        Playlist.find({_id: req.body.id}, (err, playlist) => {
            if (err) console.log(err);
            if (playlist) { res.status(200).json(playlist) }
            else { res.status(404).json('Not Found')}
        })
    })

/**
 * Returns all playlists within the DB. 
 * If no playlists, returns an empty object.
 */
    app.get('/playlists', (req, res) => {
        Playlist.find({}, (err, playlists) => {
            if (err) console.log(err);
            res.status(200).json(playlists)
        })
    })

/**
 * Creates a new playlist
 * @param {number} displayInterval
 * @param {string} name
 * @param {date} createdAt
 * @param {string} status
 */
    app.post('/gen-playlist', (req, res) => {
        const curr_date = new Date();
        const newPlaylist = new Playlist({ displayInterval: 2000, name: 'newPlaylist', createdAt: curr_date, status: 'queued' });
        newPlaylist.save((err, savedPlaylist) => {
            if (err) console.log(err);
            console.log('playlist saved');
            res.send(savedPlaylist);
        })
    });

/**
 * @param {string} id The id of the playlist to be deleted
 */
    app.delete('/playlist', (req, res) => {
        console.log('attempting delete')
        Playlist.remove({ _id: req.body.id }, (err, playlists) => {
            if (err) console.log(err);
            res.status(200).send('Removed');
        })
    });

    // ------ INSTALLATION --- 

/**
 * This is a lookup that wil
 * @param {string} key The string key that is associated with a user account that will reference the database collection of the particular installation. 
 */
    app.get('/current', (req, res) => {
        console.log('here')
        const key = 123;
        try {
            if(req.body.pass == key){
                res.send('This is where the current playlist will be sent out after a lookup is performed in the database for the current users current molecule')
            }
        } catch (error) {
            res.json(`Key: ${key}, Error: ${error}`)
        }
    });
};