const { File, Molecule, Playlist, User } = require('../models/Models');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { filewalker } = require('./helpers')

module.exports = app => {

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