const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: [10, 'Email must be at least 10 characters']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, 'password must be at least 8 characters']
    }
});

const users = mongoose.model('User', userSchema);

module.exports = users;