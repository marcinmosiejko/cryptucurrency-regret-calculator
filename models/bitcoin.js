var mongoose = require("mongoose");


var bitcoinSchema = new mongoose.Schema({
    date: Date,
    avgPrice: Number
});


module.exports = mongoose.model("Bitcoin", bitcoinSchema);