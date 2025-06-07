const express = require("express");
const morgan = require("morgan");
const { loggerStream, logger } = require("./loggers");
const { dbConnection, dbCleanOff } = require("./config/db");
const { Products } = require("./models/products.model");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(morgan("dev", {stream: loggerStream}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const ProductModel = Products;

app.get("/", async (_, res) => {
    try {
        const products = await ProductModel.find();
        res.render("home", {items: products, title: "EJS Todo App"});
    }catch(err) {
        logger.error("Error Occurred While Trying To Retrieve Items From The Database");
        logger.error("\n Error Mesage:", err?.message ?? err?.stack);
    }
    res.render('home', {title: "EJS Todo App"});
});

app.get("/products", async (_, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).json(products);
        res.render("home", {products, title: "List Of Products"});
    }catch(err) {
        logger.error("Error Occurred While Trying To Fetch Products");
    }
})

app.post("/api/products", async (req, res) => {
    const {productName} = req.body;
    try {
        const product = await ProductModel.insertOne({productName});
        logger.info("Product Added Successfully");
        res.status(201).json({message: "Product Added Successfully", error: false, productId: product._id});
    }catch(err) {
        logger.error("Failed To Add Product To The Database, Error Message: " + err?.message);
    }
});

dbConnection().then(() => {
    dbCleanOff();
    const server = app.listen(PORT, () => { 
        logger.info("Server Is Successfully Running on Port", PORT);
    });

    server.on("error", (err) => {
        logger.error("Error Occurred While Trying To Connect To PORT 3000", err.message);
    });

    process.on("uncaughtException", (err) => {
        const {stack, ...rest} = err;
        logger.error("Unexpected Error Occurred In index.js file: " + err?.message || err?.stack);
        logger.error("\n", JSON.stringify({...rest}));
    });

    process.on("unhandledRejection", (reason, promise) => {
        logger.error("Unhandled Rejection: " + promise + "Error dectected: " + (typeof reason === "string" ? reason : JSON.stringify(reason)));
    });

}).catch(err => {
    logger.error("Error Occurred While Trying To Connect To MongoDB, Error Message: " + err?.message);
});