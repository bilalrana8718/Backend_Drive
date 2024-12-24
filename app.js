

const express = require("express");
const morgan = require('morgan');
const userRouter = require('./routes/user.routes');


const app = express();
app.use(morgan('combined'));

app.set('view engine', 'ejs');

app.use('/users', userRouter);
app.get("/", (req, res) => {
    res.send("Hello, World!");
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
});
