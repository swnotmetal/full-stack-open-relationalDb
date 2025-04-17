const router = require('express').Router()
const { sequelize } = require('../util/db')
const {Blog} = require('../models')

router.get('/', async(req, res) => {

    const blogCount = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('Count', sequelize.col('id')), 'Articles'],
            [sequelize.fn('Sum', sequelize.col('likes')), 'Total Likes']
        ],
        group: ['author'],
        order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']]

    })
    res.json(blogCount)
})

module.exports = router