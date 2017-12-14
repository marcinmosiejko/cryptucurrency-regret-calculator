var mongoose = require("mongoose");


var moneroSchema = new mongoose.Schema({
    date: Date,
    avgPrice: Number
});


module.exports = mongoose.model("Monero", moneroSchema);