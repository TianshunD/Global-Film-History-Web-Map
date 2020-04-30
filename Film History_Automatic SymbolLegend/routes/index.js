var express = require('express');
var router = express.Router();
var pg = require("pg"); // require Postgres module
/* PostgreSQL and PostGIS module and connection setup */
const { Client, Query } = require('pg')
//const { Pool } = require('pg');

// Setup connection
var username = "postgres" // sandbox username
var password = "postgre" // read only privileges on our table
var host = "localhost:5432"
var database = "theater_test3" // database name
var conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection

// query attributes from joined table from Mumbai_theaters table, theater_film relationship table and film information table   
var data_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((name, address, film_information, language)) As properties FROM (select Mumbai_Theaters.Theater_Name as name, Mumbai_Theaters.Address, Mumbai_Theaters.geom, Theater_Film.Mar_1_1970 as film_information, Films.language from Mumbai_Theaters join Theater_Film on Mumbai_Theaters.Theater_Name=Theater_Film.Theater_Name join Films on Theater_Film.Mar_1_1970=Films.title) As lg) As f)As fc";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

/* GET Postgres JSON data */
router.get('/data', function (req, res) {
    var client = new Client(conString);
    client.connect();
    var query = client.query(new Query(data_query));
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        res.send(result.rows[0].row_to_json);
        res.end();
    });
});

/* GET the map page */
router.get('/map', function(req, res) {
    var client = new Client(conString); // Setup our Postgres Client
    client.connect(); // connect to the client
    var query = client.query(new Query(data_query)); // Run our Query
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    // Pass the result to the map page
    query.on("end", function (result) {
        var data = result.rows[0].row_to_json // Save the JSON as variable data
        res.render('map', {
            title: "Express API", // Give a title to our page
            jsonData: data // Pass data to the View
        });
    });
});

/* GET the filtered page */
router.get('/filter*', function (req, res) {
    var name = req.query.Month + '_' + req.query.Date + '_' + req.query.Year;
	//var Pool = require('pg');
    if (name.indexOf("--") > -1 || name.indexOf("'") > -1 || name.indexOf(";") > -1 || name.indexOf("/*") > -1 || name.indexOf("xp_") > -1){
        console.log("Bad request detected");
        res.redirect('/map');
        return;
    } else {
        console.log("Request passed");
		//var filter_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((Theater_Name, Address, Notes, Theater_ID)) As properties FROM Mumbai_Theaters As lg WHERE lg.Theater_Name = \'" + name + "\') As f) As fc";
		//var filter_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((name, address, film_information, language)) As properties FROM (select Mumbai_Theaters.Theater_Name as name, Mumbai_Theaters.Address, Mumbai_Theaters.geom, tf.film_information, Films.language from Mumbai_Theaters join (Select Theater_Name," + name + "from Theater_Film) tf on Mumbai_Theaters.Theater_Name=tf.Theater_Name join Films on tf.film_information = Films.title) As lg) As f)As fc";
		var filter_query = "SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json((name, address, " + name + ", language)) As properties FROM (select Mumbai_Theaters.Theater_Name as name, Mumbai_Theaters.Address, Mumbai_Theaters.geom, tf." + name + ", Films.language from Mumbai_Theaters join (Select Theater_Name, " + name + " from Theater_Film) tf on Mumbai_Theaters.Theater_Name=tf.Theater_Name join Films on tf." + name + " = Films.title) As lg) As f)As fc";
		var client = new pg.Client(conString);
        client.connect();
		const query = client.query(new Query(filter_query))
		query.on('row', (row, result) => {
			result.addRow(row);
		})
		query.on('end', result => {
			var data = result.rows[0].row_to_json
            res.render('map', {
                title: "Express API",
                jsonData: data
            });
		})
		query.on('error', result => {
			console.log(result);
		})
		
		
		//var client = new pg.Client(conString);
        //client.connect();
		/*const query = client.query(new Query(filter_query))
        //var query = client.query(filter_query);
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            var data = result.rows[0].row_to_json
            res.render('map', {
                title: "Express API",
                jsonData: data
            });
        });*/
    };
});


