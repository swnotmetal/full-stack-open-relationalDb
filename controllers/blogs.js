const router = require('express').Router()

const {Blog} = require('../models')

router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  })

router.post('/', async(req, res) => {
    try {
        if(!req.body.title && !req.body.url) {
            return res.status(400).json({ error: "Title and URL is required"})
        }

        const blog = await Blog.create(req.body)
        console.log(blog.toJSON());
        return res.json(blog)
    }catch(error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.delete('/:id', async(req, res) => {
    const {id} = req.params

    try {
        const blog = await Blog.findByPk(req.params.id)
        if(blog) {
            await blog.destroy()
            res.status(200).json({message: `Blog with ID ${id} deleted`})
        } else {
            res.status(404).json({message: `Blog with ID ${id} not found`})
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({message: 'Internal Server Error'})
    }
        
})

router.put('/:id', async(req, res) => {
    const { id } = req.params
    const { likes } = req.body

    try {
        const blog = await Blog.findByPk(id) //remember this is under sequelize
        
        if (!blog) {
            return res.status(404).json({ message: "No blog found" })
        }

        if (likes !== undefined) {
            blog.likes = likes
            await blog.save()
        }

        res.json(blog)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router