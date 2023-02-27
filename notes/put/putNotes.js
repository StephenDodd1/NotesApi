const express = require('express')
const router = express.Router()
const fs = require('fs')
const logger = require('../../app')

// get data function runs dynamically with the txtName parameter
const getData = (txtName) => fs.promises.readFile(`./my${txtName}.txt`, 'utf-8', (err, data) => {
	if(!err){
		return data
	} else console.log(err)
})
// write data file dynamically from any endpoint
const writeData = (newDataString, txtName) => {
	console.log('txtName: ', txtName)
	return fs.promises.writeFile(`./my${txtName}.txt`, newDataString, (err) => {
		if(err){
			throw new Error(err)
		}
	})
}

router.put('/:noteId', async (req, res) => {
    logger.info(req.params.noteId)
    const dataString = await getData('Notes')
    const dataJson = JSON.parse(dataString)
    let filteredData = dataJson.notes.filter(note => note.id === req.params.noteId)[0]
    filteredData = {...req.body, id: req.params.noteId}
    writeData(JSON.stringify(dataJson), 'Notes').catch(err => logger.error('failed to write'))
    res.send(dataJson)
})

module.exports = router