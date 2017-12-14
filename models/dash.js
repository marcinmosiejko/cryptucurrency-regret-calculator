var mongoose = require("mongoose");


var dashSchema = new mongoose.Schema({
    date: Date,
    avgPrice: Number
});


module.exports = mongoose.model("Dash", dashSchema);