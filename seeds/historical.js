var mongoose        = require("mongoose"),
    tabletojson     = require("tabletojson"),
    seedsM          = require("../methods/seeds.js");
    
    
function seedingHistorical() {
    seedsHistorical();
    setTimeout(seedingHistorical, 43200000);
}

function seedsHistorical() {
    seedsM.cryptos.forEach(function(crypto) {
        // =============================================================
        // retrieve bitcoin historical data objects from CMC table
        tabletojson.convertUrl(crypto.urlHistorical,
        { useFirstRowForHeadings: false },
        function(data) {
                if (data[0].length !== 0) {
                    var db = crypto.model;
                    // store  historical data objects in array
                    var cryptoData = seedsM.historicalCryptoData(data, crypto.urlCurrent);
                    // =====================================================
                    // remove old data from DB
                    db.remove({}, function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(crypto.name.toUpperCase() + " data removed from DB");
                            //==============================================
                            // seed new data (not sorted)
                            seedsM.seeding(cryptoData, db, function toHistorical() {
                                console.log(crypto.name.toUpperCase() + " DB seeding completed");
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


module.exports = seedingHistorical;