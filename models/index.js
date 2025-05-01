const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, {through: Reading, as: 'readings'})
Blog.belongsToMany(User,{ through: Reading, as: 'readers'})

Reading.belongsTo(Blog, { foreignKey: 'blog_id' })
Reading.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Reading)
Blog.hasMany(Reading)

module.exports = {
  Blog, User, Reading
}