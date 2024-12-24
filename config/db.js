const mongoose = require('mongoose');

// Connect to MongoDB
function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
}

module.exports = connectToDB;