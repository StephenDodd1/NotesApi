const express = require('express')
const router = express.Router()
const fs = require('fs')

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

router.delete('/:noteId', async (req,res) => {
    console.log(req.params)
	const dataString = await getData('Notes')
	const dataJson = JSON.parse(dataString)
	const noteObject = dataJson.notes.filter(note => req.params.noteId === note.id)[0]
	noteObject['inactive'] = true
	writeData(JSON.stringify(dataJson), 'Notes')
	res.status(202).send('deleted successfully')
})

module.exports = router