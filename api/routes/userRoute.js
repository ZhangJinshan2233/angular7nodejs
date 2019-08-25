'use strict'

const express = require('express');

const router = express.Router();

const userCtrl = require('../constrollers/userController');

const passport = require('passport')

router
    .route('/signup')
    .post(userCtrl.signup)

router
    .route('/signin')
    .post(userCtrl.signin)

router
    .route('/profile')
    .get(passport.authenticate('jwt'), userCtrl.get_whole_userInfo)
    .post(passport.authenticate('jwt'), userCtrl.update_profile_field)
   
    
router
    .route('/refreshAccessToken')
    .post(userCtrl.refresh_get_access_token)

router
    .route('/logout')
    .post(userCtrl.logout);
module.exports = router;