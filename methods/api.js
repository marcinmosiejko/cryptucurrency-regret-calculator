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
    // var setup
    var finalData = [];
    var inputDate = userData.month + ' ' + userData.day + ' ' + userData.year;
    var oldestDate = foundData[0]["date"];
    var newestDate = foundData[foundData.length-1]["date"];
    // user's input: starting date
    // check if input date is not before/after the oldest/most recent date in DB
    if (new Date(inputDate).setHours(0,0,0,0) < oldestDate.setHours(0,0,0,0)) {
        var startingDate = oldestDate.toDateString();
    } else if (new Date(inputDate).setHours(0,0,0,0) >= newestDate.setHours(0,0,0,0)) {
        var startingDate = newestDate.toDateString();
    } else {
        var startingDate = new Date(inputDate).toDateString();
    }
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
