const router = require('express').Router()
const {Blog, User} = require('../models')

const {SECRET} = require('../util/config')
/*
const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try{
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch {
        return res.status(401).json({
          error: 'invalid token'
        })
      }
    } else{
      return res.status(401).json({
        error: 'token missing'
      })
    }
    next() //move on the middleware
  }*/

router.get('/', async(req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

router.post('/', async(req, res) => {
    if(!req.body.title || !req.body.url) { // Changed && to || to require both fields
        return res.status(400).json({ error: "Title and URL are required"})
    }
    const user = await User.findOne()
    const blog = await Blog.create({...req.body, userId: user.id})
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