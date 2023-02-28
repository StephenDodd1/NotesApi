const express = require('express')
const router = express.Router()
const { getData } = require('../../common/commonFunctions')
const { fileTypes } = require('../../common/constants')

const logger = require('../../logger')

router.get("/notes/:folderId", async (req, res) => {
	const dataString = await getData(fileTypes.NOTES)
	const dataJson = JSON.parse(dataString) 
	const filteredJson = dataJson.notes.filter(note => !note.inactive )
	res.json(filteredJson)
})

module.exports = router