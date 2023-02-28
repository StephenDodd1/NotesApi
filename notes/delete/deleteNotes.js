const express = require('express')
const router = express.Router()
const logger = require('../../logger')
const { fileTypes } = require('../../common/constants')
const { getData, writeData } = require('../../common/commonFunctions')

router.delete('/:noteId', async (req,res) => {
    try {
        const dataString = getData('Notes')
        const dataJson = JSON.parse(dataString)
        const noteObject = dataJson.notes.filter(note => req.params.noteId === note.id)[0]
        noteObject['inactive'] = true
        writeData(JSON.stringify(dataJson), 'Notes')
        res.status(202).send('deleted successfully')
    }
    catch(err){
        logger.error(err.message)
        res.send(err)
    }
})

module.exports = router