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
    // var cryptoAmount = 0;
    // var cryptoValue = 0;
    // var spentAmount = 0;
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
    // user's input: saving amount
    // var savingAmount = Number(userData.saving);
    // loop through DB to create final array
    foundData.forEach(function(data) {
        if ((data["date"]).toDateString() === startingDate) {
            // update total amount of btc, it's current value and spent amount
            // spentAmount += savingAmount;
            // cryptoAmount += savingAmount / data["avgPrice"];
            // cryptoValue = cryptoAmount * data["avgPrice"];
            // create saving obj
            var dataObj = {
                date: startingDate.substr(4), // gets rid of a day of the week
                avgPrice: data["avgPrice"],
                // cryptoAmount: cryptoAmount.toFixed(6),
                // cryptoValue: cryptoValue.toFixed(2),
                // spent: spentAmount.toFixed(2)
            }
            // add saving obj to savings array
            finalData.push(dataObj);
            //update starting date to next day
            startingDate = apiM.addDays(data["date"], 1).toDateString();
        }
    });
    // var result = {
    //     amount: cryptoAmount,
    //     savings: cryptoSavings
    // }
    return finalData;
}

apiM.addMonths = function(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }

  return date;
}

apiM.addDays = function(date, days) {
  date.setDate(date.getDate() + days);

  return date;
}

module.exports = apiM;
