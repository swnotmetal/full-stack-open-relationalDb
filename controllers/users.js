const router = require('express').Router()

const { User, Blog, Reading } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll(
    {include: {
      model: Blog
    }}
  )
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.put('/:username', async (req, res) => {
    const username = req.params.username
    const updateData = req.body
    const [updatedRows] = await User.update( updateData, {
        where:{username}
    })

    if (updatedRows === 0) {
        return res.status(404).json({ message: 'User not found or no changes made' });
      }

    const updatedUser = await User.findOne({ where: { username: username } });
    return res.json(updatedUser);
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['read','id'],
        as: 'readinglists',
        where: {
          read: req.query.read === "true"
        }
      },
      attributes: ['id', 'url', 'title','author','likes','year'],
    }
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router