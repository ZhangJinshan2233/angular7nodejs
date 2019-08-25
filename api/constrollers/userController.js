'use strict'
const Model = require('../models');
const bcrypt = require('bcrypt');
const helper = require('../helpers');
const randToken = require('rand-token');
let refreshTokens = {};

module.exports = {
    /**
     * @function signup.
     * @param {req.body}:username,password,firstName,lastName.
     * @returns string.
     */
    signup: async (req, res) => {
        let {
            userName,
            firstName,
            lastName,
            password,
            phoneNumber,
            address1,
            country,
            city,
            postcode,
            address2,
            dateOfBirth,
            imageData,
        } = req.body.userInfo

        if (!userName || !password || !firstName || !lastName
            || !phoneNumber || !address1 || !country || !city ||
            !postcode || !dateOfBirth || !imageData) {

            throw Error('You need to input required information');
        }

        let user = await Model.User.findOne({
            userName: userName
        });

        if (user) throw Error('user name already existed');

        let addresses = []
        let newAddress1 = {
            address: address1
        }
        addresses.push(newAddress1)
        if (address2) {
            let newAddress2 = {
                address: address2
            }
            addresses.push(newAddress2)
        }
        let newUser = new Model.User({
            userName,
            password,
            firstName,
            lastName,
            phoneNumber,
            country,
            addresses,
            city,
            postcode,
            dateOfBirth,
            imageData: Buffer.from(imageData, 'base64')
        });

        await newUser.save();

        return res.status(200).json({
            msg: "registed successfully"
        })
    },

    /**
     * @function signin.
     * @param {req.body}:username password
     * @returns json object(access_token,refresh_token).
     */

    signin: async (req, res) => {

        let {
            userName,
            password
        } = req.body

        let is_password_match = false;

        if (!userName || !password)

            throw Error('input user name or password');

        let user = await Model.User.findOne({
            userName: userName
        })

        if (!user)

            throw Error('The user does not exist');

        is_password_match = await user.comparePassword(password);

        if (is_password_match) {

            let refreshToken = randToken.uid(256);

            refreshTokens[refreshToken] = userName;

            return res.status(200).json({

                access_token: helper.create_token(user),

                refresh_token: refreshToken

            });

        } else {

            throw Error('The user ID and password don\'t match.')
        }
    },

    /**
     * @function get_whole_userInfo
     * @public
     * @param {req, res}
     * @returns user object.
     */
    get_whole_userInfo: async (req, res) => {
        try {
            let userName = req.user.userName

            let user = await Model.User.findOne({
                userName: userName
            })

            let currentuser = {}
            currentuser = {
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                country: user.country,
                addresses: user.addresses,
                city: user.city,
                postcode: user.postcode,
                dateOfBirth: user.dateOfBirth,
                imageData: "data:image/jpeg;base64," + Buffer.from(user.imageData).toString('base64')
            }

            return res.status(200).json({
                user: currentuser
            })

        } catch (err) {
            throw err
        }


    },

    /**
     * @function refresh
     * @param {req.body}:username,password,firstName,lastName.
     * @returns json object{access_token}.
     */
    refresh_get_access_token: async (req, res) => {

        const refresh_token = req.body.refreshToken;

        if (refresh_token in refreshTokens) {
            const user = {
                'userName': refreshTokens[refresh_token]
            }

            res.json({
                access_token: helper.create_token(user),
            })

        } else {

            throw Error('Unauthorized')
        }
    },

    /**
     * @function logout 
     */
    logout: async (req, res, next) => {
        const refresh_token = req.body.refreshToken;
        if (refresh_token in refreshTokens) {
            delete refreshTokens[refresh_token];
        }
        return res.sendStatus(204);
    },

    /**
     * @function update_profile_field 
     */
    update_profile_field: async (req, res) => {
        let {
            userName,
        } = req.user;

        let changedFields = req.body;
        let currentUser = await Model.User.findOne({
            userName: userName
        })

        try {
            await currentUser.updateOne({
                $set: changedFields
            }).exec()
            res.status(200).json({
                message: "updated successfully"
            })
        } catch (error) {
            throw err
        }


    }

}