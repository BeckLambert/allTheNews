//required packages
var mongojs = require('mongojs');
var cheerio = require('cheerio');
var axios = require('axios');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var PORT = process.env.PORT || 8080
app.use(express.static('public'));






app.listen(PORT, function () {
    console.log("App running on port 8080!");
});