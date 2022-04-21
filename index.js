const express = require('express');
const port = 8000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
// session used for session cookie
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo');
// const MongoStore = require('connect-mongodb-session')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
// extract styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    // when running in production mode, use debug: false
    outputStyle: 'extended',
    // outputStyle: 'compressed'
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
// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Codeial',
    //To do : change secret key before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // in milliseconds
    },
    // store: new MongoStore({
    //     mongooseConnection: db,
    //     autoRemove: 'disabled'
    // }, function(err){
    //     console.log(err || 'connect-mongodb setup ok');
    // })
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/userSignUpSignIn',
        autoRemove: 'disabled'
    })
}));
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

