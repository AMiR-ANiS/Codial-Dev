const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codial_db_test');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to db'));
db.once('open', function(){
    console.log('Connected to database');
});

module.exports = db;