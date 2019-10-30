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

app.get('./', function(req, res) {
    res.render('index');
});

app.get('/scrape', function(req, res) {
        db.scrapedData.drop();

    axios.get('https://www.snowmagazine.com/ski-gear')
        .then(function(response) {
            var $ = cheerio.load(response.data);
            var results = [];
            
            $('article').each(function(i, element) {
                var title = $(element).find('h1').children('a').text().trim();
                var summary = $(element).find('p').text().trim();
                var link = $(element).find('h1').children('a').attr('href').trim();
                var image = $(element).find('source').attr('data-srcset').trim();
                
        if(title && summary && link && image) {
            db.scrapedData.insert({
                title: title,
                summary: summary,
                link: link,
                image: image
            },
            function(err, inserted) {
                if(err) {
                    console.log(err)
                } else {
                    console.log('scrapedData')
                    console.log('inserted')
                }
            });
        }
    });
    console.log(results);
})
});






app.listen(PORT, function () {
    console.log("App running on port 8080!");
});