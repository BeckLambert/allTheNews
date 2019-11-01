//required packages
var mongojs = require('mongojs');
var cheerio = require('cheerio');
var axios = require('axios');
var express = require('express');
var exphbs = require('express-handlebars');
// var mongoose = require('mongoose');

var app = express();
var PORT = process.env.PORT || 8080
app.use(express.static('public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var collections = ['scrapedData'];

var MONGODB_URI =process.env.MONGODB_URI || "mongodb://localhost/scraper"
var db = mongojs( MONGODB_URI, collections);
db.on('error', function(error) {
    console.log('Database Error:', error);
});

// var db = mongoose.connect(MONGO_URI);

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/scrape', function(req, res) {
        db.scrapedData.drop();

    axios.get('https://thewirecutter.com/')
        .then(function(response) {
            var $ = cheerio.load(response.data);
            
            $('ul').each(function(i, element) {
                var title = $(element).find('h4').children('a').text().trim();
                var summary = $(element).find('p').text().trim();
                var link = $(element).find('h4').children('a').attr('href');
                var time = $(element).find('time').text().trim();
                
        if(title && summary && link && time) {
            db.scrapedData.insert({
                title: title,
                summary: summary,
                link: link,
                time:time
            },
            function(err, inserted) {
                if(err) {
                    console.log(err)
                } else {
                    console.log('scrapedData')
                    console.log('inserted', inserted)
                }
            });
        }
    });
    res.send('to find scraped data go to localhost:8080/');
})
});

app.get('/all', function(req, res) {
    db.scrapedData.find({}, function(err, found) {
        if(err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });
});

app.get('/title', function(req, res) {
    db.scrapedData.find().sort({ title: 1}, function(error, found) {
        if(error) {
            console.log(error);
        } else {
            res.send(found);
        }
    });
});

app.listen(PORT, function () {
    console.log("App running on port 8080!");
});