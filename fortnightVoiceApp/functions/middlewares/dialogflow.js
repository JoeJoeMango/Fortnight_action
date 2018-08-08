const {	dialogflow } = require('actions-on-google');
const Fortnite = require('./../libs/fortnite');
const fortnite = new Fortnite('0bfa97b1-d015-481e-8736-48d3fea8cb36');

const app = dialogflow();
const userData = {};
const values = {};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
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

app.intent('Default Welcome Intent', (conv) => {
    conv.ask(`whats your username?`)
});

app.intent('username_login', async(conv, {userName_one}) => {
    var user__ = {userName_one};
		console.log('Username login', conv.body.session);
		console.log('Username: ', userName_one);

		userData[conv.body.session] = {
			username: userName_one
		};

		await getLoggedUserData(userName_one);
    conv.data.usernameEntry = user__.userName_one;
    conv.ask(`<speak>Thankyou ${conv.data.usernameEntry} spelled. <say-as interpret-as="verbatim">${conv.data.usernameEntry}</say-as> What fortnight player would you like to compaire your stats to?</speak>`);
});


app.intent('kill_stats', async(conv, {username_two, LifeTimeSatas}) => {
	const { username } = userData[conv.body.session] || {};

    var user__two = {username_two};
    var statType = {LifeTimeSatas};


    conv.data.killsOrWins = statType.LifeTimeSatas;


    conv.data.usernameEntryTwo = user__two.username_two;

    // conv.data.killsKey = String('Kills');

  console.log(statType);

	if(!username) {
		return conv.ask('sorry what is your username again?');
	}

	await getLoggedUserData(username);
	const body = await fortnite.getUser(conv.data.usernameEntryTwo);
	// values[req.currentUser].push(body.epicUserHandle + ": " + body.stats.p2.top1.value
	values[username].values.push(`${body.epicUserHandle}:${body.stats.p2.top1.value}`);

  console.log('Requesting stats');
  console.log(body.lifeTimeStats, values[username].current.lifeTimeStats);


  const { lifeTimeStats: loggedStats } = values[username].current;
  const { lifeTimeStats: requestedStats } = body;
// capitalizeFirstLetter('string')
  const keys = [capitalizeFirstLetter(conv.data.killsOrWins)];
  const stats = [];

  loggedStats.forEach((item, index) => {
    if(!keys.includes(item.key))
      return;

      const diff = item.value - requestedStats[index].value;

      console.log(diff);


    if(diff > 0){
		stats.push(`<speak> ${conv.data.usernameEntryTwo} has ${requestedStats[index].value} ${item.key}. You have ${diff} more ${item.key} then player ${conv.data.usernameEntryTwo}. Keep up the good work ${conv.data.usernameEntry}</speak>`);
}else if (item.value < requestedStats[index].value){
  stats.push(`<speak> You have ${diff*-1} less ${item.key} then ${conv.data.usernameEntryTwo}. Yes I said ${diff*-1}. Seems like you have your work cut out for you.</speak>`);
};
	// 	stats.push(`The user has ${diff} ${item.key}` 
  });

  conv.ask(stats.join('\n'));
});

app.intent('username_check', (conv) => {
  conv.ask(`${conv.data.usernameEntry}`);
});

module.exports = app;
