const {	dialogflow } = require('actions-on-google');
const Fortnite = require('./../libs/fortnite');
const fortnite = new Fortnite('xxx-xxx-xxx-xxx-xxx');


const app = dialogflow();
const values = {};
const intentOff = {};

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

async function getLoggedUserData(usernames) {
  const { username, data } = await fortnite.tryUsernames(usernames);
  // console.log('Body retrieved', body);
  if(!values[username]) {
    values[username] = {
      current: data,
      values: []
    };
  }
  return username;
}

function normalizeUsername(username) {

  return username
    .replace(/underscore/gi, '_')
    .replace(/hyphen|dash/gi, '-')
    .replace(/ +/g, '');

}

app.intent('Default Welcome Intent', (conv) => {
  console.log(conv.user.storage.username);

  if(conv.user.storage && conv.user.storage.username) {
    return conv.ask('Welcome back ' + conv.user.storage.username + '. Which fortnight player and stat type would you like to compaire your stats to?');
  }

  conv.ask(`Welcome to the fortnight stat comparison tool. I can compare your kills, wins, Matches Played, or score against any fornite player. So Lets get started, whats your fortnight username?`);
});

app.intent('username_login', async(conv, {userName_one}) => {
  // console.log(conv, 'username_login');

  if (!intentOff[conv.body.session]){
  intentOff[conv.body.ssesion] = true;

      var user__ = {userName_one};
      const normalizedUsername = normalizeUsername(userName_one);
  		console.log('Username login', conv.body.session);

      try {
        const loggedUsername = await getLoggedUserData([userName_one, normalizedUsername]);
        conv.data.usernameEntry = user__.userName_one;
        conv.user.storage.username = loggedUsername;
        conv.ask(`<speak>Thankyou ${loggedUsername} spelled. <say-as interpret-as="verbatim">${loggedUsername}</say-as> Which fortnight player and stat type would you like to compaire your stats to?</speak>`);
        // intentOff = true;
      } catch(e) {
        conv.ask(`Invalid username: ${userName_one}`);
      }
    }else{
      conv.ask(`to change user say change user then the username`);
    }
  });

  app.intent('unsername_change', async(conv) => {
      conv.ask(`which fornight player do you want to log in with?`);
    intentOff[conv.body.ssesion] = false;
  });

app.intent('kill_stats', async(conv, {username_two, LifeTimeStats}) => {
    console.log(conv, 'kill_stats');

	const { username } = conv.user.storage || {};
    var user__two = {username_two};
    var statType = {LifeTimeStats};
    conv.data.killsOrWins = statType.LifeTimeStats;
    conv.data.usernameEntryTwo = user__two.username_two;
    username_two = username_two.replace(/ +/g, "");
    console.log(username_two);

    if(username_two) {
      conv.user.storage.lastComparison = username_two;
    }

    if(!username_two) username_two = conv.user.storage.lastComparison;

	if(!username) {
		return conv.ask('sorry what is your username again?');
	}

	await getLoggedUserData(username);
	const body = await fortnite.getUser(username_two);
	// values[req.currentUser].push(body.epicUserHandle + ": " + body.stats.p2.top1.value
	values[username].values.push(`${body.epicUserHandle}:${body.stats.p2.top1.value}`);

  console.log('Requesting stats');
  console.log(body.lifeTimeStats, values[username].current.lifeTimeStats);

  const { lifeTimeStats: loggedStats } = values[username].current;
  const { lifeTimeStats: requestedStats } = body;
  // console.log(toTitleCase(conv.data.killsOrWins));

  const keys = [toTitleCase(conv.data.killsOrWins)];
  const stats = [];

  loggedStats.forEach((item, index) => {
    if(!keys.includes(item.key))
      return;

      const diff = item.value - requestedStats[index].value;

    if(diff > 0){
		    stats.push(`<speak> ${username_two} has ${requestedStats[index].value} ${item.key}. You have ${diff} more ${item.key} then player ${conv.data.usernameEntryTwo}. Which other stat would you like to compare? If not just say goodbye, i'm done, see ya. </speak>`);

    }else if (item.value < requestedStats[index].value){
        stats.push(`<speak> You have ${diff*-1} less ${item.key} then ${username_two}. Yes I said ${diff*-1}. Which other stat would you like to compare? If not just say goodbye, i'm done, see ya. </speak>`);

    }
  });
  conv.ask(stats.join('\n'));
  // conv.close(stats.join('\n'));
});

app.intent('ending', (conv) =>{
  conv.ask(`<speak> This is not goodbye, this is ill see you later. </speak>`);
});

app.intent('username_check', (conv) => {
  conv.close(`${conv.data.usernameEntry}`);
});

module.exports = app;
