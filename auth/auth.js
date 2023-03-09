const express = require('express')
const router = express.Router()
const {v4} = require('uuid')
const bcrypt = require('bcrypt')
const { getData, createANewId, writeData } = require('../common/commonFunctions')
const { fileTypes } = require('../common/constants')
const jwt = require('jsonwebtoken')
const { hashFunc } = require('./utilities')
const xss = require('xss')

const sanitize = (body) =>{
    const sanitized = {}
    Object.keys(body).forEach(key => sanitized[key] = xss(body[key]))
    return sanitized
}

router.post('/signup', async (req, res)=>{
    const usersString = await getData(fileTypes.USERS)
    const usersObj = JSON.parse(usersString)
    const id = createANewId()
    const userObj = {id: id}
    const sanitized = sanitize(req.body)
    console.log('sanitized: ',sanitized)
    const body = req.body
    for(let key in body){
        if(key!=='pw'){
            userObj[key] = body[key]
        }
    }
    const saltRounds = 10
    let salt;
    let hash = await new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function(err, slt) {
            salt = slt
            bcrypt.hash(body.pw, salt, function(err, hash) {
                if(err){
                    reject(err)
                }
                else resolve(hash)
            });
        });
    })
    console.log('hash is ', hash)
    usersObj.users.push({...userObj, salt: salt, hash: hash})
    await writeData(JSON.stringify(usersObj),fileTypes.USERS).catch(err => res.status(500).send('error'))
    console.log("userObj",usersObj)
    res.send(req.body)
})

router.post('/signin', async(req, res) => {
    try{
        const body = req.body
        const actual = "$2b$10$TwEgdrtmPADWGhtQWcv/0ubY7yU82OG3tZOWfWKyh.ix82aL0qm3K"
        const salt = "$2b$10$TwEgdrtmPADWGhtQWcv/0u"
        let hash = await hashFunc(body.pw, salt).then(res=> console.log(res));
        console.log('hash is ', hash)
        console.log('actual is ', actual)
        if(hash === actual){
            console.log('ran5')
            const token = jwt.sign({data: body.username}, salt, {expiresIn: 30000})
            console.log('token is ', token)
        }
        else res.send('bad pw')
    } catch(err) {
        res.status(401).send(err)
    }
})

module.exports = router