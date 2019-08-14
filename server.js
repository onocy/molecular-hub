const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

const port = process.env.PORT || 3001;

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).catch(error => console.log(error));
    
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    name: 'sid',
    saveUninitialized: false,
    resave: false,
    secret: 'This is where the secret goes.',
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
});

app.listen(port, console.log(`Port is now running on port: ${port}`));  