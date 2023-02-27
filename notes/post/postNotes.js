const express = require('express')
const router = express.Router()

const getData = (txtName) => fs.promises.readFile(`./my${txtName}.txt`, 'utf-8', (err, data) => {
	if(!err){
		return data
	} else console.log(err)
})
const writeData = (newDataString, txtName) => {
	console.log('txtName: ', txtName)
	return fs.promises.writeFile(`./my${txtName}.txt`, newDataString, (err) => {
		if(err){
			throw new Error(err)
		}
	})
}

const createANewId = () => {
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
// create a new note
router.post("/", async (req,res) =>{
	const dataString = await getData('Notes')
	let dataJson
	try {
		dataJson = JSON.parse(dataString)
	} catch(err){
		dataJson = {"notes":[]}
	}
	let id = createANewId()
	let idAlreadyExists = Boolean(
		dataJson.notes.filter(obj => obj.id === id).length
	)

	if(idAlreadyExists){
		createANewId()
	} 

	const body = req.body
	const possibleKeys = [...['notes','comment'], ...Object.keys(body)]

	try {
		if(body?.note?.length && body?.note !== undefined){
			console.log('body.note ', body.note)
		} else if(new Set(possibleKeys).length < possibleKeys.length){
			console.log('key was not note')
			throw new Error('key was not correct, should be note')
		}
		else throw new Error('TEST')
	} catch(err){
		console.log('Error: note is not defined', err)
		return res.status(406).send(err)
	}

	body['id'] = id
	dataJson.notes.push(body)
	const newDataString = JSON.stringify(dataJson)

	await writeData(newDataString, 'Notes')
		.catch(() => res.status(500).send('failed to update'))	
	res.send(dataJson)
})

module.exports = router