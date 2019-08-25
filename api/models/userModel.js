const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    addresses:[{
        address:{
            type:String
        }
    }],
    country:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    postcode:{
        type:String,
        required:true,
    },
    dateOfBirth:{
        type:Date,
        required:true
    },
    imageData:{
        type:Buffer
    }

}, {
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
})

userSchema.pre('save', function (next) {

    var user = this;

    if (!user.isModified('password')) return next(err);

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next()
        })
    })
})

userSchema.methods.comparePassword = async function (candidatePassword) {

    try {
        let match = await bcrypt.compare(candidatePassword, this.password);
        return match
    } catch (err) {
        throw Error(err)
    }
}

module.exports = mongoose.model('User', userSchema)