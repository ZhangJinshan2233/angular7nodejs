'use strict'

'use strict'
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('../config');

//set up options of passport
const opts = {

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};

module.exports = () => {
    
    passport.serializeUser(function (user, done) {
        done(null, user.userName)
    });
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            //If the token has expiration, raise unauthorized
            let expirationDate = new Date(jwt_payload.exp * 1000)
            if (expirationDate < new Date()) {
                return done(null, false);
            }

            let user = jwt_payload
            return done(null, user)

        } catch (err) {
            throw Error(err)
        }
    }))
}