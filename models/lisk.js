var mongoose = require("mongoose");


var liskSchema = new mongoose.Schema({
    date: Date,
    avgPrice: Number
});


module.exports = mongoose.model("Lisk", liskSchema);
