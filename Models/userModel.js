const mongoose = require('mongoose')
const moment = require('moment');
moment.locale('fr');
require('dotenv').config()

const userSchema = new mongoose.Schema({

        nom: {
            type: String,
            minLength: 2,
            maxLength: 55,
            unique: true,
            trimp: true,
            index: true
        },
        prenom: {
            type: String,
            minLength: 2,
            maxLength: 55,
            unique: true,
            trimp: true,
            index: true
        },
        entreprise: {
            type: String,
            maxLength: 55,
            trimp: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        telephoneMobile: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minLength: 6
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSuperAdmin: {
            type: Boolean,
            default: false
        },
        date_creation_user: {
            type: String
        },
        doubleAuth: {
            type: String,
            default: process.env.DOUBLE_AUTH_DEFAULT,
            trim: true

        }
    }, {
        timestamps: true
    }
)

const my_user = mongoose.model('user', userSchema)
module.exports = my_user