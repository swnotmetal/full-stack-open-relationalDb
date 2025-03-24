require('dotenv').config()
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres'  // or 'mysql', 'sqlite', 'mssql', etc.
  })

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    author : {
        type: DataTypes.STRING,
        allowNull: true
    },
    url : {
        type: DataTypes.STRING,
        allowNull: false
    },
    title : {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes : {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
}
)

app.get('/api/blogs', async(req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
  })

const PORT = process.env.PORT || 3008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})