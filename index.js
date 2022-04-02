const express = require('express');
const port = 8000;
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
// extract styles and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('./assets'));
app.use(expressLayouts);
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is up and running on port: ${port}`);
});

