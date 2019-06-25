const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

const port = process.env.PORT || 3002;

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(console.log('dbconnected'));

app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('express-session')({ secret: 'molecular hub', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'client/build')));

require('./routes/serviceRoutes')(app);
require('./routes/authRoutes')(app);

app.get('*', (req, res) => {                       
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));                               
});

app.listen(port, console.log(`Port is now running on port: ${port}`));  