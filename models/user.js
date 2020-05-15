let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')

// Create user schema
let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    pic: String,
    admin: {
        type: Boolean,
        default: false
    }
})

//hash passwords
userSchema.pre('save', function(anything) {
    //make sure its new, as opposed to modified
    if(this.isNew) {
        this.password = bcrypt.hashSync(this.password, 12)
    }
    anything()
})

//Make a JSON representation of the user (for sending on the JWT payload)
userSchema.set('toJSON', {
    transform: (doc, user) => {
        delete user.password
        delete user.__v
        return user
    }
})

//make a function that compares passwords
userSchema.methods.validPassword = function (typedPassword) {
    return bcrypt.compareSync(typedPassword, this.password)
}

// TODO: Export user model
module.exports = mongoose.model('User', userSchema)