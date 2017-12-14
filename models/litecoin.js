var mongoose = require("mongoose");


var litecoinSchema = new mongoose.Schema({
    date: Date,
    avgPrice: Number
});


module.exports = mongoose.model("Litecoin", litecoinSchema);