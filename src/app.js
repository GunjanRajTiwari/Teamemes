// Import dependencies
const express = require('express')
require('./db/mongoose')
// const bodyParser = require('body-parser')
const app = express()

// Routes
const userRouter = require('./routers/users')
const memeRouter = require('./routers/memes')

// Settings
app.use(express.json())
app.use(userRouter)
app.use(memeRouter)

// Listening to server
app.listen(process.env.PORT || 3000, (error, result) => {
    if (error){
        console.log('Unable to run server')
    } else {
        console.log('Server is running...')
    }
    
})