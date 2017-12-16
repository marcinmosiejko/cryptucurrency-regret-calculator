var Bitcoin         = require("../models/bitcoin"),
    Ethereum        = require("../models/ethereum"),
    Litecoin        = require("../models/litecoin"),
    Dash            = require("../models/dash"),
    Monero          = require("../models/monero");

var apiM = {};

apiM.cryptos = {
    bitcoin: Bitcoin,
    ethereum: Ethereum,
    litecoin: Litecoin,
    dash: Dash,
    monero: Monero
}

apiM.dataSetup = function(req) {
    // check if there are all required inputs,
    // if saving is a number
    // if request asks for a crypto that exists in DB
    if (
        req.query.saving
        && req.query.day
        && req.query.month
        && req.query.year
        && req.query.crypto
        && !isNaN(req.query.saving)
        && Object.keys(this.cryptos).indexOf(req.query.crypto) !== -1
    ) {
        var userData = req.query;
        return userData;
    }
}

apiM.createFinalData = function(foundData, userData) {
    // starting date setup
    var startingDate = this.startingDateSetup(foundData, userData);
    // build final data array
    finalData = this.buildDataArray(foundData, startingDate);

    return finalData;
}

////////////////////////////////////////////////////////
// SUPPORTING METHODS

apiM.startingDateSetup = function(foundData, userData) {
  // dates setup
  var inputDate = userData.month + ' ' + userData.day + ' ' + userData.year;
  var oldestDate = foundData[0]["date"];
  var newestDate = foundData[foundData.length-1]["date"];
  // starting date setup
  var startingDate = this.createStartingDate(inputDate, newestDate, oldestDate);

  return startingDate;
}

apiM.createStartingDate = function(input, newest, oldest) {
  // check if input date is not before/after the oldest/most recent date in DB
  if (new Date(input).setHours(0,0,0,0) < oldest.setHours(0,0,0,0)) {
      var starting = oldest.toDateString();
  } else if (new Date(input).setHours(0,0,0,0) >= newest.setHours(0,0,0,0)) {
      var starting = newest.toDateString();
  } else {
      var starting = new Date(input).toDateString();
  }

  return starting;
}

apiM.buildDataArray = function(foundData, startingDate) {
  var finalData = [];
  // loop through DB to create final array
  foundData.forEach(function(data) {
      if ((data["date"]).toDateString() === startingDate) {
          // create obj
          var dataObj = {
              date: startingDate.substr(4), // gets rid of the day of the week
              avgPrice: data["avgPrice"]
          }
          // add obj to final array
          finalData.push(dataObj);
          //update starting date to next day
          startingDate = apiM.addDays(data["date"], 1).toDateString();
      }
  });

  return finalData;
}

apiM.addDays = function(date, days) {
  date.setDate(date.getDate() + days);

  return date;
}

module.exports = apiM;
