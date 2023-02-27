const fs = require('fs')
const express = require('express')
const cors = require('cors')
const logger = require('./logger')
const port = process.env.PORT || 3000

const notesRouter = require('./notes/notes')
const deleteNotesRouter = require('./notes/delete/deleteNotes')
const putNotesRouter = require('./notes/put/putNotes')

const app = express()

const bodyParser = express.json()

app.use(cors())
app.use(bodyParser)
/// enum
const fileTypes = {folders: 'Folders', notes: 'Notes', users: 'Users'}


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

app.get('/folders', async (req,res) => {
	try {
		const dataString = getData(fileTypes.folders)
		const dataJson = JSON.parse(dataString)
		const filteredData = dataJson.folders.filter(folder => folder.inactive !== true)
		logger.info({path: req.path})
		res.json(filteredData)
	} catch(err) {
		logger.error({path: req.path})
	}
})

// app.post('/users')

app.get('/tabs/:userId', async (req, res) => {
	const dataString = await getData(fileTypes.users)
	const dataJson = JSON.parse(dataString)
	const userObject = dataJson.users.filter(user => user.id === req.params.userId)[0]
	res.send(userObject.tabs)
})

// create a folder
app.post("/folders", bodyParser, async (req,res) =>{
	// get Folders
	try{
		logger.error(req.body)
		const dataString = await getData(fileTypes.folders);
		const dataJson = JSON.parse(dataString)
		dataJson.folders.push({id:dataJson.folders.length, name: req.body.folderNam})
		const newDataString = JSON.stringify(dataJson)
		await writeData(newDataString, fileTypes.folders)
			.catch(() => res.status(500).send('failed to update'))
		res.send(dataJson)
	}
	catch(err){
		logger.error(req.body)
	}
})


app.delete('/folders/:folderId', async (req, res) =>{
	const dataString = await getData(fileTypes.folders)
	const dataJson = JSON.parse(dataString)

	const updatedJson = dataJson.folders.map(folder => {
		if(String(folder.id) === req.params.folderId){
			folder['inactive'] = true
			return folder
		} else {
			folder['inactive'] = false
			return folder
		}
	})
	dataJson.folders = updatedJson
	const updatedString = JSON.stringify(dataJson)
	await writeData(updatedString,fileTypes.folders).catch((err) =>
		console.log('delete folder Error', err)
	)
	res.status(201).send(`deleted folder with id ` + req.params.folderId)
})

app.patch('/tabs', bodyParser, async (req,res) => {
	const dataString = await getData(fileTypes.users)
	const dataJson = JSON.parse(dataString)
	console.log('dataJson: ', dataJson, 'req.body:', req.body )
	const { user_id, tabs } = req.body;
	console.log('users', typeof dataJson.users[0].id, typeof user_id)
	const userObject = dataJson.users
		.filter(user => user.id === String(user_id))[0]
	console.log('userObject', userObject)
	userObject['tabs'] = tabs
	await writeData(JSON.stringify(dataJson), fileTypes.users)
		.catch(() => res.status(500).send('failed to update'))	

	res.send(userObject)
})


app.delete('/tabs/:noteId/:sessionId', async (req,res) =>{
	const dataString = await getData(fileTypes.users)
	const dataJson = JSON.parse(dataString)
	const currTabs = dataJson.users.filter(user => user.id === req.params.sessionId)[0].tabs
	let i = 0
	let j = 0
	while(i < currTabs.length && i < 6 && j < 10){
		if(currTabs[i].note_id === req.params.noteId){
			currTabs.splice(i,1)
		} else if(i !== currTabs[i].id){
			currTabs[i].id = i
			i++
		} else i++
		j++
	}
	const userString = JSON.stringify(dataJson)
	await writeData(userString, fileTypes.users).catch(err=> console.log(err))
	
	res.send('test')
})

app.use('/notes', notesRouter)
app.use('/notes', deleteNotesRouter)
app.use('/notes', putNotesRouter)
// app.get("/notes/:folderId", async (req, res) => {
//     console.log('ran')
// 	// call getData with name param dynamically
// 	const dataString = await getData(fileTypes.notes)
// 	const dataJson = JSON.parse(dataString) 
// 	const filteredJson = dataJson.notes.filter(note => !note.inactive )
// 	res.json(filteredJson)
// })
app.get('/*', (req,res) =>{
	console.log(req.path)
})

app.listen(port, () => console.log('listening on port ', port))

// {"users":
//     [    
//         { 
//             "id": "123",
//             "tabs": [
//                 {"id": 0, "note_id": "xyz132", "note_name": "Note 2"}, 
//                 {"id": 1, "note_id": "xyz133", "note_name": "Note 1"}
//             ]
//         },
//         { 
//             "id": "124",
//             "tabs": [
//                 {"id": 0, "note_id": "xyz132", "note_name": "Note 2"}, 
//                 {"id": 1, "note_id": "xyz133", "note_name": "Note 1"}
//             ]
//         }
//     ]
// }

// {"folders":[{"id":1,"name":"test 1"},{"id":3,"name":"test 3"},{"id":2,"name":"test 2"},{"id":0,"name":"test 0"},{"name":"test 4"},{"id":5,"name":"test 5"}]}
