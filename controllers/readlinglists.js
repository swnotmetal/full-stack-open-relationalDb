const router = require('express').Router()
const { tokenAuthen } = require('../util/middleware')
const { User, Blog, Reading } = require('../models')

router.get('/', async (req, res) => {
    const readings = await Reading.findAll({
      include: [
        { 
          model: Blog,
          attributes: ['title', 'author', 'url', 'year']
        },
        {
          model: User,
          attributes: ['username', 'name']
        }
      ]
    })
    res.json(readings)
  })

router.post('/', tokenAuthen, async (req, res) => {
  try {
  //find the blog
  const blog = await Blog.findByPk(req.body.blogId)
  if(!blog) {
    return res.status(400).json({ error: 'Blog not found'})
  }

  //find the user
  const user = await User.findByPk(req.body.userId)
  if(!user) {
    return res.status(400).json({ error: 'User not found'})
  }
  // entry already exists?
  const existing = await Reading.findOne({
    where: {
        blog_id: req.body.blogId,
        user_id: req.body.userId
    }
  })
  if(existing) {
    return res.status(400).json({ error: 'Blog already in the list'})
  }

  //creating the list
  const reading = await Reading.create({
    blog_id: req.body.blogId,
    user_id: req.body.userId,
    read: false
  })

  res.json(reading)
    
} catch(error) {
    return res.status(400).json({ error })
  }
})

module.exports = router