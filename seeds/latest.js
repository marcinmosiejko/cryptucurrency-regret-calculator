var mongoose        = require("mongoose"),
    request         = require("request"),
    seedsM          = require("../methods/seeds.js");


function seedingLatest() {
    seedsLatest();
    setTimeout(seedingLatest, 10000);
}

function seedsLatest() {
    seedsM.cryptos.forEach(function(crypto) {
        // =============================================================
        // retrieve bitcoin historical data objects from CMC table
        request(crypto.urlLatest, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    var bodyParsed = JSON.parse(body);
                    var db = crypto.model;
                    // store  latest data in an object
                    var latestData = seedsM.createLatestData(bodyParsed);
                    // =====================================================
                    // remove old btc data from DB
                    db.find({date: new Date(new Date().toDateString().substr(4))}, function(err, foundData) {
                        if (err) {
                            console.log(err);
                        } else if (foundData[0]) {
                            // update latest data in DB
                            foundData[0].avgPrice = Number(bodyParsed[0].price_usd).toFixed(2);
                            foundData[0].save();
                            console.log(crypto.name.toUpperCase() + " latest data updated");
                        } else {
                            var latestData = seedsM.createLatestData(bodyParsed);
                            db.create(latestData, function(err, createdData) {
                                if (err) {
                                    console.log(err);
                                } else {
                                console.log(crypto.name.toUpperCase() + " latest data created");  
                                }
                            });
                        }
                    });
                } else {
                    console.log("something went wrong");
                }
            }
        );
    });
}


module.exports = seedingLatest;