
const jwt = require('jsonwebtoken')
const {SECRET} = require('../util/config')
const { User } = require('../models')


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


const sessionCheck = async (req, res, next) => {
    if (!req.session.authenticated || !req.session.user) {
        return res.status(401).json({ error: 'Session not found. Login required' })
    }

    const user = await User.findByPk(req.session.user.id)
    if (!user || user.disabled) {
        req.session.destroy(() => {
            res.status(401).json({ error: 'Account disabled' })
        })
        return
    }

    req.user = user
    next()
}

module.exports = { sessionCheck }


module.exports = { tokenAuthen, sessionCheck }