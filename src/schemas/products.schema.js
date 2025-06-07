const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: String,
    inputDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = {productSchema};