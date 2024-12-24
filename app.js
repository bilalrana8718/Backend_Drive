

const express = require("express");
const morgan = require('morgan');
const userRouter = require('./routes/user.routes');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json()); // JSON request logger
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



app.use(morgan('combined'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('index');
})

app.use('/users', userRouter);
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
});
