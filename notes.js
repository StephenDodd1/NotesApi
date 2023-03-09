const app = require('./app')
const { test, describe, assert } = require('@jest/globals')
const { fileTypes } = require('./common/constants')
const { getData } = require('./common/commonFunctions')
const supertest = require('supertest')

describe('notes', () => {
    test('get notes', () => {
        supertest(app).get('/notes/1').expect(200).end()
    })
    test('get notes from non-existent folder', () => {
        supertest(app).get('/notes/12').expect(200).end()
    })
    test('post notes', () => {
        supertest(app).post('/notes')
            .send({
                "title":"TEST NOTE", 
                "note":"THIS NOTE WAS CREATED AS A PART OF A TEST IN SUPERTEST", 
                "folder_id": 3
            }).expect(200).end()
    })

})