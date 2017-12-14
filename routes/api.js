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
        apiM.cryptos[selected].find({}).sort({date: 1}).exec(function(err, foundData) {
            if (err) {
                console.log(err);
                res.send({
                    message: "something went wrong"
                });
            } else {
                //============================================================
                // create array cotaining crypto data objs day by day
                var finalData = apiM.createFinalData(foundData, userData);
                //===========================================================
                // get date of oldest data point
                var oldestDataPoint = (foundData[0].date).toDateString().substr(4);
                }
                //===========================================================
                // RENDER! :)
                res.send(
                    {
                        data: finalData,
                        userData: userData,
                        oldestDataPoint: oldestDataPoint
                    }
                )
        });
    } else {
        res.send({
            message: "wrong query, please check for mistakes"
        });
    }
});


module.exports = router;
