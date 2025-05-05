const router = require('express').Router()
const {Blog, User} = require('../models')
const { Op } = require('sequelize')
const { tokenAuthen, sessionCheck  } = require('../util/middleware')


router.get('/', async(req, res) => {
    let where = {}

    if(req.query.search) {
        where = {
          [Op.or]: [
            { title: { [Op.iLike]: `%${req.query.search}%` } },
            { author: { [Op.iLike]: `%${req.query.search}%` } }
          ]
        }
      }
    const blogs = await Blog.findAll({
        include : {
            model: User,
            attributes: ['id', 'username', 'name']
        },
        where,
        order : [
            ['likes', 'DESC'] // order by likes DESC
        ]
    })
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

router.post('/', [tokenAuthen, sessionCheck], async (req, res) => {
    const user = req.user; // Logged-in user
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
});

router.delete('/:id', [tokenAuthen, sessionCheck], async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Current logged-in user
    console.log(`Logged-in user: ${req.user.username}, ID: ${userId}`);

    const blog = await Blog.findByPk(id);
    if (!blog) {
        console.log(`Blog with ID ${id} not found`);
        return res.status(404).json({ message: `Blog with ID ${id} not found` });
    }

    console.log(`Blog found: ${blog.title}, Author ID: ${blog.userId}`);

    if (blog.userId !== userId) {
        console.log(`Unauthorized delete attempt by user ID: ${userId}`);
        return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    await blog.destroy();
    console.log(`Blog with ID ${id} deleted by user ID: ${userId}`);
    res.status(200).json({ message: `Blog with ID ${id} deleted` });
});

router.put('/:id',[tokenAuthen, sessionCheck], async(req, res) => {
    const { id } = req.params
    const { likes } = req.body

    const blog = await Blog.findByPk(id, {
        include: {
            model:User,
            attributes: ['id', 'username', 'name']
        }
    })
    
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