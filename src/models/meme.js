const mongoose = require('mongoose')
const User = require('./user')

const memeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    image: {
        type: Buffer
    },
    public: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true
})

const Meme = mongoose.model('Meme', memeSchema)
module.exports = Meme