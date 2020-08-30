const mongoose = require('mongoose')
// require('dotenv/config')

// Connecting to database
mongoose.connect('mongodb+srv://gunjan:gunjan321@rest-5vjof.mongodb.net/rest?retryWrites=true&w=majority',{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex:true,
    useFindAndModify: false
}, (error,result) => {
    if (error){
        console.log('Unable to connect to the database.')
    } else {
        console.log('Database Connected!')
    }
})

