const mongoose = require('mongoose');

// Connect to MongoDB
function connectToDB() {
    mongoose.connect()
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Error connecting to MongoDB:', err));
}