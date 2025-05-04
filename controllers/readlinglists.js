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

  router.get('/', async (req, res) => {
    const readings = await Reading.findAll({
      attributes: ['id', 'blog_id', 'user_id', 'read'],
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

    // Clean up the response format
    const cleanReadings = readings.map(reading => ({
      id: reading.id,
      blog_id: reading.blog_id,
      user_id: reading.user_id,
      read: reading.read,
      blog: reading.blog,
      user: reading.user
    }))

    res.json(cleanReadings)
})

router.put('/:id', async(req, res) => {
 const readingList = await Reading.findByPk(req.params.id)

 if (!readingList) {
  return res.status(404).json({ error: 'Reading list entry not found' })
}
 readingList.read = req.body.read ?? readingList.read
await readingList.save()
res.json(readingList)
})
 
module.exports = router