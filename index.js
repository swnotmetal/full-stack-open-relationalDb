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
Blog.sync()
app.get('/api/blogs', async(req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  })

app.post('/api/blogs', async(req, res) => {
    try {
        if(!req.body.title && !req.body.url) {
            return res.status(400).json({ error: "Title and URL is required"})
        }

        const blog = await Blog.create(req.body)
        console.log(blog.toJSON());
        return res.json(blog)
    }catch(error) {

    }
})

app.delete('/api/blogs/:id', async(req, res) => {
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

const PORT = process.env.PORT || 3008
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})