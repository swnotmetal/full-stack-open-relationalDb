
const express = require('express')
const app = express()
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
require('express-async-errors')

const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use((err, req, res, next) => {
  console.error('Error details:', err)

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: err.errors.map(e => e.message)
    })
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ 
      error: 'Unique constraint violation',
      details: 'A unique field already has this value'
    })
  }

  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    return res.status(500).json({
      error: 'Database connection error',
      details: 'Could not connect to the database'
    })
  }


  if (err.name === 'TypeError' || err.name === 'SequelizeDatabaseError') {
    return res.status(400).json({
      error: 'Invalid data type',
      details: 'Please check your input values'
    })
  }


  res.status(500).json({
    error: 'Something went wrong',
    details: err.message || 'Unknown error'
  })
})

app.use((req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
})
const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
  
  start()