var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const asyncHandler = require('./middlewares/async-handler');
const Fortnite = require('./libs/fortnite');

const fortnite = new Fortnite('0bfa97b1-d015-481e-8736-48d3fea8cb36')

var values = {};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use('/public', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/static/index.html'));
});

async function getLoggedUserData(username) {

  const body = await fortnite.getUser(username);
  // console.log('Body retrieved', body);
  if(!values[username]) {
    values[username] = {
      current: body,
      values: []
    };
  }
}

app.get('/login', asyncHandler(async(req, res, next) => {

		const username = req.query.username;

    await getLoggedUserData(username);
    res.cookie('username', username);
      res.json(values[username]);
      // console.log(username);

}));

app.post('/', asyncHandler(async(req, res, next) => {

	// console.log(req.body);
  const username = req.cookies.username;
  await getLoggedUserData(username);


	const body = await fortnite.getUser(req.body.epicNickName, req.body.dropDownValue);
	// values[req.currentUser].push(body.epicUserHandle + ": " + body.stats.p2.top1.value
	values[username].values.push(`${body.epicUserHandle}:${body.stats.p2.top1.value}`);

  console.log(body.lifeTimeStats, values[username].current.lifeTimeStats);

  const { lifeTimeStats: loggedStats } = values[username].current;
  const { lifeTimeStats: requestedStats } = body;

  const keys = ['Kills'];

  loggedStats.forEach((item, index) => {

    if(!keys.includes(item.key))
      return;

    const diff = item.value - requestedStats[index].value;

    console.log(`The user has ${diff} ${item.key}`);

  });
	// console.log(user__.userName_one);

}));

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
