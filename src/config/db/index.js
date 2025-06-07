const mongoose = require("mongoose");
const { logger } = require("../../loggers");
const { TRIAL_COUNT, CONNECTED_MESSAGE, DISCONNECTED_MESSAGE, RETRY_DURATION } = require("../../shared/db.constants");
require("dotenv").config();

const SERVER_URL = process.env.SERVER_URL ?? "mongodb://localhost:27017/ejsproject";
let trial_count = 0;
const dbConnection = async () => {
    mongoose.set("strictQuery", true);
    mongoose.set("debug", true);
    mongoose.set("runValidators", true);

    while(trial_count < TRIAL_COUNT) {
        try {
            await mongoose.connect(SERVER_URL);
            logger.info(CONNECTED_MESSAGE);
            return;
        }catch(err) {
            trial_count++;

            logger.error("Error Occurred While Trying To Connect To The Database");
            logger.error("\n Error Message: " + err?.message + "\n Error Stack: " + err?.stack);

            logger.info(`You've ${trial_count}/${TRIAL_COUNT} Trials Remaining`);

            if (trial_count >= TRIAL_COUNT) {
                logger.info("You've Reached Your Trials, Please Try Again After Some Few Minutes");
                process.exit(1);
            }

            await new Promise(resolve => setTimeout(resolve, RETRY_DURATION));
        }
    }
}

const dbCleanOff = () => {
    const handler = async () => {
        logger.info("Disconnecting The MongoDB database");
        try {
            await mongoose.disconnect();
            logger.info(DISCONNECTED_MESSAGE);
        }catch(err) {
            logger.error("Error Occurred While Trying To Disconnect The Database");
            logger.error("\n Error Message: " + err.message);
        }
    }

    process.on("SIGINT", handler);
    process.on("SIGTERM", handler);

    mongoose.connection.on("disconnected", () => {
        logger.info("Mongo DB Connection Successfully Disconnected");
    });

    mongoose.connection.on("error", (err) => {
        logger.error("MongoDB Error Message: " + err.message);
    });
}

module.exports = {dbConnection, dbCleanOff};