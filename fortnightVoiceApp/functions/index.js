'use strict';

const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const app = dialogflow({debug: true});
const firebase = require('firebase');
var request = require('request');
var bodyParser = require('body-parser');

// app.use(bodyParser.json());

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(`whats your username?`)
  });

app.intent('username_login', (conv, {userName_one}) => {
    var user__ = {userName_one};

    conv.data.usernameEntry = user__.userName_one;
    conv.ask(`${conv.data.usernameEntry}`);
  });

app.intent('username_check', (conv) => {
  conv.ask(`${conv.data.usernameEntry}`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);