const fs = require('fs')
const logger = require('../logger')
// get data function runs dynamically with the txtName parameter
exports.getData = (txtName) => fs.promises.readFile(`./my${txtName}.txt`, 'utf-8', (err, data) => {
	if(!err){
		return data
	} else {
        throw new Error(err)
    }
})
// write data file dynamically from any endpoint
exports.writeData = (newDataString, txtName) => {
	console.log('txtName: ', txtName)
	return fs.promises.writeFile(`./my${txtName}.txt`, newDataString, (err) => {
		if(err){
			throw new Error(err)
		}
	})
}

exports.createANewId = () => {
	let id = 'N'
	try {
		while (id.length < 10) {
			if(id.length % 2 === 0){
				id += String.fromCharCode(97 + Math.floor(Math.random() * 26))
			}
			else id += Math.floor(Math.random()*13)
		}
	} catch(err){
		console.log('error at createANewId: ', err.name, err.message)
	}
	return id
}