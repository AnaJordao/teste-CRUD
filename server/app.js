const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const { request, response } = require('express')
dotenv.config()

const dbService = require('./dbService')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : false }))

// Here we create our routes 

// CREATE
app.post('/insert', (request, response) => {
    const { name } = request.body
    const { countryCode } = request.body
    const { district } = request.body
    const { population } = request.body
    const db = dbService.getDbServiceInstance()

    const result = db.insertNewName(name, countryCode, district, population)

    result
    .then(data => response.json({ data : data }))
    .catch(err => console.log(err))
})

// READ
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance()
    
    const result = db.getAllData()
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
})

// UPDATE
app.patch('/update', (request, response) => {
    const { ID, Name} = request.body
    const db = dbService.getDbServiceInstance()

    const result = db.updateNameById(ID, Name)
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err))
})

// DELETE
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params
    const db = dbService.getDbServiceInstance()

    const result = db.deleteRowById(id)
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err))
})

app.get('/search/:name', (request, response) => {
    const { name } = request.params
    const db = dbService.getDbServiceInstance()

    const result = db.searchByName(name)
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err))
})


// npx nodemon app.js
app.listen(process.env.PORT, () => console.log('app is running'))
