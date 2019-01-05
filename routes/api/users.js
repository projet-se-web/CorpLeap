const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// Load User model
const User = require('../../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {

  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    }
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      type: req.body.type
    });

    // Hash password before saving in database

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        console.log(newUser);
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {

  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email

  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: 'Password incorrect' });
      }
    });
  });
});

router.get('/', (req, res) => {
  User.find().then(users => {
    if (users.length === 0) {
      return res.status(404).json({ noUser: 'No user exists' });
    } else {
      return res.status(200).json(users);
    }
  });
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    if (!user) {
      return res.status(404).json({ userNotFound: 'User not found' });
    } else {
      return res.status(200).json(user);
    }
  });
});

router.delete('/:id', (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, response) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).json(response);
    }
  });
});

router.put('/:id', (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.birthday = req.body.birthday;
    user
      .save()
      .then(user => res.json(user))
      .catch(err => {
        res.json(err);
      });
  });
});

module.exports = router;