const express = require('express')
const router = express.Router()
const fs = require('fs')
const logger = require('../../logger')
const { getData, writeData } = require('../../common/commonFunctions')
const { fileTypes } = require('../../common/constants')


router.put('/:noteId', async (req, res) => {
    try{
        logger.info(req.params.noteId)
        const dataString = getData(fileTypes.NOTES)
        const dataJson = JSON.parse(dataString)
        const filteredData = dataJson.notes.map(note => {
            if(note.id === req.params.noteId){
                return({...req.body, id: req.params.noteId})
            } else{
                return(note)
            }
        })
        const newObj = {}
        newObj['notes'] = filteredData
        console.log('newObj', newObj, 'dataJson', dataJson)
        writeData(JSON.stringify(newObj), fileTypes.NOTES).catch(err => logger.error('failed to write'))
        res.send(newObj)
    } catch(err) {
        logger.error(err.message)
        console.log(err.name)
        if(err.name === 'SyntaxError'){
            res.status(500).send("An internal error has occurred, we're working on it.")
        } else if(err.name === 'TypeError'){
            res.status(400).send("Your data is improperly formatted, please check it and try again")
        } else {
            res.status(500).send(err.message)
        }
    }

})

module.exports = router