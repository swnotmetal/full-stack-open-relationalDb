const router = require('express').Router()
const {Blog, User} = require('../models')
const jwt = require('jsonwebtoken')
const {SECRET} = require('../util/config')
const {Op} = require('sequelize')
const tokenAuthen = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    console.log('Extracted Token:', token);
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

router.get('/', async(req, res) => {
    const where = {}

    if(req.query.search) {
        where.title = {
            [Op.iLike]: `%${req.query.search}%`  // using ILIKE to handle cases in PostgreSQL instead of [Op.substring]
        }
    }
    const blogs = await Blog.findAll({
        include : {
            model: User,
            attributes: ['id', 'username', 'name']
        },
        where
    })
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
})

router.post('/', tokenAuthen, async (req, res) => {
    const user = req.user; // Logged-in user
    const blog = await Blog.create({ ...req.body, userId: user.id });
    res.json(blog);
});

router.delete('/:id', tokenAuthen, async (req, res) => {
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

router.put('/:id', async(req, res) => {
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