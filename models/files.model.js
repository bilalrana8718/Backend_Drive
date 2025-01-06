const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({

    originalname: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

module.exports = mongoose.model('File', fileSchema);