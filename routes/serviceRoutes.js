const { File, Molecule, Playlist, User } = require('../models/Models');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

module.exports = app => {
    app.get('/create-files', (req, res) => {
        filewalker('./assets/molecules', function(err, files){
            if(err){
                throw err;
            }
            files.forEach(filePath => {
                let currFile = file.split('\\').pop().split('.')[0]
                let newFile = new File({data: Buffer.from(filePath), name: currFile[0], contentType: currFile[1]})
                newFile.save((err, savedFile) => {
                    if(err) console.log(err);
                    else { 
                        console.log('File Created')
                        console.log(savedFile)
                    };
                });
            })
            res.json(data);
        });
    })

    app.post('/create-file', (req, res) => {
        const file = new File({data: Buffer.from('../assets/molecules/amino_acids/ala.mol'), name: 'ala', contentType: '.mol'});
        file.save((err, savedFile) => {
            if(err) console.log(err);
            else { 
                console.log('File Created')
                res.send(savedFile); 
            };
        });
    })
    
    app.get('/receive-file',  (req, res) => {
        const id = '5d114fca9ac89a0ed88257da';
        File.findById(id, (err, file) => {
            if(err) console.log(err);
            else {
                res.send(file);
            }
        });
    })

    app.get('/playlists', (req, res) => {
        Playlist.find({}, (err, playlists) => {
            if(err) console.log(err);
            res.json(playlists);
        })
    })
    
    app.post('/playlist', (req, res) => {
        const curr_date = new Date(); 
        const newPlaylist = new Playlist({displayInterval: 2000, name: 'newPlaylist', createdAt: curr_date, status: 'queued'});
        newPlaylist.save((err, savedPlaylist) => {
            if(err) console.log(err);
            console.log('playlist saved');
            res.send(savedPlaylist);
        })
    });


    function filewalker(dir, done) {
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
};