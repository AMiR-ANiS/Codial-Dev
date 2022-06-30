const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// For session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
// const passportJWT = require('./config/passport-jwt-strategy');
// const passportGoogle = require('./config/passport-google-oauth2-strategy');
// const passportGithub = require('./config/passport-github-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// Setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port: 5000');

app.set('view engine', 'ejs');
app.set('views', './views');

// extract styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: false,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static('./assets'));

// make the uploads path available to the browser.
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
app.use(session({
    name: 'Codial',
    secret: 'blahSomethingSecret',
    saveUninitialized: false,
    resave: false,

    //maxAge = 60 minutes
    cookie: { maxAge: (1000 * 60 * 60) },

    //MongoStore used for storing session cookie in database
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codial_db_test',
        autoRemove: 'disabled'
    })
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is up and running on port: ${port}`);
});

