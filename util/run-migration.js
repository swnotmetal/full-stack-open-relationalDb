const { connectToDatabase } = require('./db')

// This will call runMigrations() inside connectToDatabase
connectToDatabase()
  .then(() => {
    console.log('Migration completed')
    process.exit(0)
  })
  .catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
  })