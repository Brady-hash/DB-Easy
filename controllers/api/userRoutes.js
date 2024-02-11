const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');


// Route handles new sign ups
router.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password, phone, role } = req.body;

  // Validate the input fields
  if (!first_name || !last_name || !email || !password || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
  }

  try {
      // Hash password before saving to the database
      const hashedPassword = await bcrypt.hash(password,8);

      // Create new user
      const newUser = await User.create({
          first_name,
          last_name,
          email,
          password: hashedPassword,
          phone,
          role,

      });
      res.redirect('/login');
  } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Error! Please try again.' });
  }
});

// Route handles logins
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { email: req.body.email } });
  
      if (!userData) {
        res
          .status(400)
          .json({ message: 'Try again!' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Try again!' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        
        res.json({ user: userData, message: 'logged in!' });
      });
  
    } catch (err) {
      res.status(400).json(err);
    }
  });
// Route handles logouts  
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

  module.exports = router;