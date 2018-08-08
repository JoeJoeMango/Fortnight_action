

//your need to run
// ------>    lt --port 3000     <--- This command in the terminal in a seprate tab
// then run node dataHandler.js

var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
// var capitalize = require('lodash.capitalize');

const asyncHandler = require('./middlewares/async-handler');

const dialogflow = require('./middlewares/dialogflow');

app.use(bodyParser.json());
app.use(dialogflow);

app.use((err, req, res, next) => {
	console.log('err', err.message);
	res
		.status(500)
		.end('Error');
});

var port = 3000;
app.listen(port, () => {
	console.log("listening on port:  " + port);
});
