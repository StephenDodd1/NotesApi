
const winston = require('winston')

const runtimeEnvTransports = process.argv[2] === 'dev' ? 
    [new winston.transports.Console()]:
    [
		new winston.transports.File({filename: 'log/errors.csv', level: "error",}),
        new winston.transports.File({filename: 'log/requestData.csv', level: "info",}),
		new winston.transports.Console()
	]

const logger = winston.createLogger({
	transports: runtimeEnvTransports
})
module.exports = logger