const mongoose = require("mongoose");
const { productSchema } = require("../schemas/products.schema");

const Products = mongoose.model("products", productSchema);

module.exports = {Products};