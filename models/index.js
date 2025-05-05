const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')
const LogIn = require('./loginsession')



User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { 
  through: Reading, 
  as: 'readings',
  foreignKey: 'user_id'
})
Blog.belongsToMany(User,{ through: Reading, as: 'readers'})

Reading.belongsTo(Blog, { foreignKey: 'blog_id' })
Reading.belongsTo(User, { foreignKey: 'user_id' })

User.hasMany(LogIn, { foreignKey: 'user_id'})
LogIn.belongsTo(User, { foreignKey: 'user_id'})
/*
User.hasMany(Reading, { foreignKey: 'user_id' })
Blog.hasMany(Reading, { foreignKey: 'blog_id' })*/

module.exports = {
  Blog, User, Reading, LogIn
}