const mongoose = require('mongoose')
// require('dotenv/config')

// Connecting to database
mongoose.connect(' [link to mongodb database] ', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (error, result) => {
    if (error) {
        console.log('Unable to connect to the database.')
    } else {
        console.log('Database Connected! Successfully Dhantarann!')
    }
})

