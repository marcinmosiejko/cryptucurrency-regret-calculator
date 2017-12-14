var mongoose = require("mongoose");


var ethereumSchema = new mongoose.Schema({
    date: Date,
    avgPrice: Number
});


module.exports = mongoose.model("Ethereum", ethereumSchema);