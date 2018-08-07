'use strict';

const request = require('request');


class Fortnite {

	static get url() {
		return 'https://api.fortnitetracker.com/v1/profile/';
	}

	constructor(apiKey) {
    // console.log(apiKey);
		this.apiKey = apiKey;
    // console.log(this);
	}


	getUser(nickname, platform = 'pc') {
    console.log({
				headers: {
					'TRN-Api-Key': this.apiKey
				}
		});
		
		return new Promise((resolve, reject) => {
			request.get(`${this.constructor.url}/${platform}/${nickname}`, {
				headers: {
					'TRN-Api-Key': this.apiKey
				}
			}, (error, responce, body) => {
				try {
					const result = JSON.parse(body);
					return resolve(result);
				} catch(e) {
					return reject(e);
				}
			});
		});
	}
}

module.exports = Fortnite;
