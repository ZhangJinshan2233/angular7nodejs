'use strict'
const config = require('../config');
const jwt = require('jsonwebtoken');
/**
 * @function create_token.
 * @param   {user} pass the userinfo:username
 * @returns string.
 */

let create_token = (user) => {

    return jwt.sign({
        userName: user.userName
    },
        config.jwtSecret, {
            expiresIn: 900
        })
}

    module.exports = {
        create_token
    }