const { File, Molecule, Playlist, User } = require('../models/Models');
const path = require('path');
const bcrypt = require('bcrypt');

module.exports = app => {
    app.get('/create-files', (req, res) => {
        pass;
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
};