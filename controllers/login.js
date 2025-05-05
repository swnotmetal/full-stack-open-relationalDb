const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')


router.post('/', async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === 'goodboykielo';

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  // Check if the user is disabled before creating a session
  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, contact admin for more information.',
    });
  }

  // Set session data
  request.session.authenticated = true;
  request.session.user = {
    id: user.id,
    username: user.username,
    name: user.name,
  };

  // Generate token
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  console.log('Generated Token:', token);

  // Send response (only once)
  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
  });
});

router.delete('/logout', async (request, response) => {
  request.session.destroy((err) => {
      if (err) {
          return response.status(500).json({ error: 'Logout failed' });
      }
      response.status(200).json({ message: 'Logged out successfully' });
  });
});


if (process.env.NODE_ENV === 'development') {
  router.get('/debug-session', async (req, res) => {
    res.json({
      sessionID: req.sessionID,
      session: req.session,
      isAuthenticated: req.session.authenticated,
      user: req.session.user,
      cookie: req.session.cookie
    });
  });
}
module.exports = router