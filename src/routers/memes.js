const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Meme = require('../models/meme')
const auth = require('../middleware/auth')
const router = new express.Router()

// multer config for image
const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
    }
})

router.post('/memes', auth, upload.single('image'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 360, height: 360 }).png().toBuffer()
    const meme = new Meme({
        ...req.body,
        author: req.user._id,
    })
    meme.image = buffer
    try {
        await meme.save()
        res.status(201).send(meme)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/memes', auth, async (req,res) => {
    try {
        const memes = await Meme.find({})
        res.send(memes)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET /memes/me?public=true
// GET /memes/me?limit=10&skip=20
//GET /memes/me?sortBy=createdAt:desc
router.get('/memes/me', auth, async (req,res) => {
    const match = {}
    const sort = {}

    if (req.query.public) {
        match.public = req.query.public === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'memes',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.memes)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/memes/:id', auth, async (req,res) => {

    try {
        const meme = await Meme.findOne({_id: req.params.id, public: true})

        if (!meme) {
            return res.status(404).send()
        }
        res.send(meme)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/memes/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["content","public"]
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({error: "Invalid Updates!"})
    }

    try {
        const meme = await Meme.findOne({_id: req.params.id, author: req.user._id})
        
        if (!meme) {
            return res.status(404).send()
        }
        updates.forEach((update) => meme[update] = req.body[update])
        await meme.save()
        res.send(meme)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/memes/:id', auth, async (req,res) => {
    try {
        const meme = await Meme.findOneAndDelete({_id: req.params.id, author: req.user._id})

        if (!meme) {
            return res.status(404).send()
        }
        res.send(meme)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports = router