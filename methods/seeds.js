var Bitcoin         = require("../models/bitcoin"),
    Ethereum        = require("../models/ethereum"),
    Litecoin        = require("../models/litecoin"),
    Dash            = require("../models/dash"),
    Monero          = require("../models/monero"),
    Lisk            = require("../models/lisk");

// ========================================================
// DATA SETUP
var Crypto = function(model, name) {
    this.model = model;
    this.urlHistorical =
        "https://coinmarketcap.com/currencies/"
        + name
        + "/historical-data/?start=20100428&end=20200101";
    this.urlLatest =
        "https://api.coinmarketcap.com/v1/ticker/"
        + name
        + "/";
    this.name = name;
}

var bitcoin = new Crypto(Bitcoin, "bitcoin");
var ethereum = new Crypto(Ethereum, "ethereum");
var litecoin = new Crypto(Litecoin, "litecoin");
var dash = new Crypto(Dash, "dash");
var monero = new Crypto(Monero, "monero");
var lisk = new Crypto(Lisk, "lisk");

// ========================================================
// CREATE SEEDS METHODS OBJECT
var seedsM = {};

seedsM.cryptos = [
    bitcoin,
    ethereum,
    litecoin,
    dash,
    monero,
    lisk
]

seedsM.historicalCryptoData = function(data, url) {
    var cryptoData = [];
    // get into actual data array
    var workingData = data[0];
    // loop through the array starting from oldest entry
    workingData.forEach(function(singleObj) {
        // format btc data into an object (date + avg price)
        var cryptoObject = {
            date: singleObj["Date"],
            avgPrice: ((Number(singleObj["Open"]) + Number(singleObj["Close"]))/2).toFixed(2)
        }
        // push formatted data into cryptoData array
        cryptoData.push(cryptoObject);
    });

    return cryptoData;
}

seedsM.createLatestData = function(bodyParsed) {
    var latestPrice = Number(bodyParsed[0].price_usd).toFixed(2);
    var latestData = {
        date: new Date().toDateString().substr(4), // get rid of day of the week and time
        avgPrice: latestPrice
    };

    return latestData;
}

seedsM.seeding = function(dataArray, db, toHistorical) {
    dataArray.forEach(function(newData) {
        db.create(newData, function(err, createdData) {
            if (err) {
                console.log(err);
            }
        });
    });
    toHistorical();
}


module.exports = seedsM;
