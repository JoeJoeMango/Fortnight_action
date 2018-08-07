'use strict';
const request = require('request');



class Diaflow {
  getUsernameFromDialogflow(dialogUsername_one){
    return new Promise((resolve, reject) => {
      request.get(`${dialogUsername_one}`);
    });
  };
};


module.exports = Diaflow;
