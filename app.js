const express = require("express");
const morgan = require('morgan');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const dotenv = require('dotenv');
const connectToDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();

connectToDB();
const app = express();

app.use(express.json()); // JSON request logger
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(morgan('combined'));

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('login');
})

app.use('/users', userRouter);
app.use('/index', indexRouter);
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
});
