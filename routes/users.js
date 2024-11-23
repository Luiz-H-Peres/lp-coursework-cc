const express = require('express')
const router = express.Router()

router.get('/', (req,res)=>{
    res.send('You are in the users!')
})

router.get('/Luiz', (req,res)=>{
    res.send('You are in Luiz and Fefe s Home Page! And obviously Ginger as well...')
})

module.exports = router

// Dont forget to link this to the app.js!!!