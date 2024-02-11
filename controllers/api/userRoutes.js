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


  module.exports = router;