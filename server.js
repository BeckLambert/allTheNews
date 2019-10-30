//required packages
var mongojs = require('mongojs');
var cheerio = require('cheerio');
var axios = require('axios');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var PORT = process.env.PORT || 8080
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var collections = ['scrapedData'];

var db = mongojs(process.env.MONGO_URI || 'scraper', collections);
db.on('error', function(error) {
    console.log('Database Error:', error);
});






app.listen(PORT, function () {
    console.log("App running on port 8080!");
});