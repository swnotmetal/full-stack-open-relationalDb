const router = require('express').Router()
const {Blog} = require('../models')

router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

router.post('/', async(req, res) => {
    if(!req.body.title || !req.body.url) { // Changed && to || to require both fields
        return res.status(400).json({ error: "Title and URL are required"})
    }

    const blog = await Blog.create(req.body)
    console.log(blog.toJSON())
    return res.json(blog)
})

router.delete('/:id', async(req, res) => {
    const {id} = req.params
    
    const blog = await Blog.findByPk(id)
    if(blog) {
        await blog.destroy()
        res.status(200).json({message: `Blog with ID ${id} deleted`})
    } else {
        res.status(404).json({message: `Blog with ID ${id} not found`})
    }
})

router.put('/:id', async(req, res) => {
    const { id } = req.params
    const { likes } = req.body

    const blog = await Blog.findByPk(id)
    
    if (!blog) {
        return res.status(404).json({ message: "No blog found" })
    }

    if (likes !== undefined) {
        blog.likes = likes
        await blog.save()
    }

    res.json(blog)
})

module.exports = router