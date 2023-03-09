const app = require('./app')
const { createANewId } = require('./common/commonFunctions')
const { test, describe, assert } = require('@jest/globals')
const supertest = require('supertest')

describe('get requests', () =>{
    test('get id ', () =>{
        expect(createANewId()).toContain('N')
    })
    test('get tabs endpoint ', ()=>{
        supertest(app).get('/tabs/N4c7a1g4i11').then(res =>{
            expect(res.body.length).toBeGreaterThan(10000)
        })
    })

})