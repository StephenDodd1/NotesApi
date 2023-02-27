
const winston = require('winston')

const logger = winston.createLogger({
	transports: [
		new winston.transports.File({filename: 'log/errors.csv', level: "error",}),
		new winston.transports.Console()
	]
})
module.exports = logger