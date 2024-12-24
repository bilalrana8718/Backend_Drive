const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 8 }),
    body('username').trim().isLength({ min: 5 }),
    (req, res) => {
        // do add the name attribute in the input field HTML code
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid Inputs"
            });
        }

        console.log(req.body);
        res.send("User Registered Successfully");
    });

module.exports = router