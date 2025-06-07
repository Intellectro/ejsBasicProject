const winston = require("winston");
const path = require("path");
const { existsSync, mkdirSync } = require("fs");
const { error } = require("console");

const logDir = path.join(__dirname, "../logs");
if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        service: "api-service"
    },
    format: (
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.prettyPrint({colorize: true}),
        winston.format.printf(({level, message, ...meta}) => {
            const metaTags = Object.keys(meta).length ? JSON.stringify(meta) : "";
            return `[${new Date().toISOString()}] - ${level.toUpperCase()}: ${message} - ${metaTags}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: path.join(logDir, "error.log"), level: "error"}),
        new winston.transports.File({filename: path.join(logDir, "access.log")})
    ]
});


const loggerStream = {
    write: (message) => {
        return message.trim();
    }
};

module.exports = {logger, loggerStream};

