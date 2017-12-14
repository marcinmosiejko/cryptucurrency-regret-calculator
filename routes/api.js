var express         = require("express"),
    router          = express.Router({mergeParams: true}),
    apiM            = require("../methods/api.js");

    
 
    
// CALC API - CALCULATE & RENDER CRYPTO SAVINGS
router.get("/calculator", function(req, res) {
    //====================================================================
    // check if there's proper user's input
    var userData = apiM.dataSetup(req);
    if (userData) {
        //====================================================================
        // retrieve and sort crypto data from oldest to newest
        var selected = userData.crypto;
        apiM.cryptos[selected].find({}).sort({date: 1}).exec(function(err, cryptoData) {
            if (err) {
                console.log(err);
                res.send({
                    message: "something went wrong"
                });
            } else {
                //============================================================
                // create array cotaining crypto savings objs month by month
                var savingResults = apiM.createSavings(cryptoData, userData);
                var cryptoSavings = savingResults.savings;
                //===========================================================
                // get date of oldest data point
                var oldestDataPoint = (cryptoData[0].date).toDateString().substr(4);
                // get latest price (first check if cryptoData is not empty)
                if (cryptoData[cryptoData.length - 1]) {
                    var latestPrice = (cryptoData[cryptoData.length - 1].avgPrice);
                }
                //===========================================================
                // RENDER! :)
                res.send(
                    {
                        cryptoSavings: cryptoSavings,
                        userData: userData,
                        oldestDataPoint: oldestDataPoint,
                        latestPrice: latestPrice
                    }
                )
            }
        }); 
    } else {
        res.send({
            message: "wrong query, please check for mistakes"
        });
    }
});

    
module.exports = router;