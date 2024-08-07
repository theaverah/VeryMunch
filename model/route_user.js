import Router from 'express';
import User from './schema_user.js';

const router = Router();

// GET one user thru email (but for registration)
router.get('/register', async function(req, res) {
  try {
      const user = await User.findOne({ 'login.email': req.query.email }).exec();
      console.log(user);

      // If one user exists, send warning
      if (user) {
          res.sendStatus(409);
      }
      else {
          res.sendStatus(200);
      }
  } catch (err) {
      console.error(err);
      res.sendStatus(500);
  }
});

// GET one user thru email (but for login)
router.get('/login', async function(req, res) {
  try {
      const user = await User.findOne({ 'login.email': req.query.email }).exec();
      console.log(user);
      if (user) {
          res.sendStatus(409);
      }
      else {
          res.sendStatus(200);
      }
  } catch (err) {
      console.error(err);
      res.sendStatus(500);
  }
});

// POST (create) user
router.post('/user_created', (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    login: req.body.login,
    phone: req.body.phone,
    location: req.body.location
  });
  user.save();
  res.json({ message: "User has been successfully added."});
});

// PUT (update) user
router.put('/user_update', async(req, res) => {
  try {
    // gets username from the session
    const sessionId = req.session.user;
    
    // replace user info with NEW info
    await User.updateOne(sessionId, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        login: req.body.login,
        phone: req.body.phone,
        location: req.body.location
    });
    res.status(200).json({ message: 'User info updated successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// User logout
router.get('/logout', (req, res) => {
  if (req.session) {
      // Destroy the session
      req.session.destroy(err => {
          if (err) {
              res.status(500).send('Error while logging out');
          } else {
              // Redirect to homepage or login page after logout
              res.redirect('/');
          }
      });
  } else {
      // If wla session, just redirect
      res.redirect('/');
  }
});

export default router;
