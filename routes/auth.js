'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares');

const saltRounds = 10;
const router = express.Router();

// Signup user
router.get('/signup', isLoggedIn, (req, res, next) => {
  res.render('signup');
});

router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.findOne({ username });
    if (user) {
      return res.redirect('/auth/signup');
    }
    const newUser = await User.create({
      username,
      password: hashedPassword
    });
    req.session.currentUser = newUser;
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

// Login user
router.get('/login', isLoggedIn, (req, res, next) => {
  res.render('login');
});

router.post('/login', isLoggedIn, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect('/auth/login');
    }
    // compare user's passw w/ the encrypted version
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      return res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
  } catch (error) {
    next(error);
  }
});

// Log out
router.post('/logout', isNotLoggedIn, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
