const express = require('express');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 8 }),
    body('username').trim().isLength({ min: 5 }),
    async (req, res) => {
        // do add the name attribute in the input field HTML code
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid Inputs"
            });
        }

        const { username, email, password } = req.body;

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username: username,
            email: email,
            password: hashedpassword
        });
        console.log(req.body);
        res.json(newUser);
    });


router.get('/login', (req, res) => {
    res.render("login");
});

router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 8 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid Inputs"
            });
        }

        const { username, password } = req.body;

        const user = await userModel.findOne({ username: username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = await jwt.sign(
            {
                userId: user._id,
                email: user.email,
                password: user.password
            },
            process.env.JWT_SECRET
        )

        res.cookie('token', token);
        res.send("token is valid");

    });


module.exports = router