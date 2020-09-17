const express = require("express");
const app = express();
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://postgres:1234@localhost:3001/postgres");

app.get("/", function(req, res){
    res.send("<h2>Welcome to Wather server</h2>");
});

app.get("/weather/:city", function(req, res){
    var city = req.params.city;
    db.any('SELECT city_id FROM city WHERE city_name = ${citys}', { citys: city })
    .then(function(data) {
        db.any('SELECT * FROM weather WHERE city_id = ${citys}', { citys: data[0].city_id })
        .then(function(data) {
            var json = JSON.parse(JSON.stringify(data[0]))
            json.week_average = ((Number(data[0].today_t) + Number(data[0].yesterday_t)) / 2).toString();
            res.send(json);
        })
        .catch(function(error) {
            console.log("ERROR - " + error);
        });
    })
    .catch(function(error) {
        console.log("ERROR - " + error);
    });
});

app.listen(3000, function(){
    console.log('listening - 3000');
});