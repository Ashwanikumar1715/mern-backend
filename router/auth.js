const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')


//middleware requiring 

const authentication = require('../middleware/authentication')


//databse connectivity
require('../db/conn');
const User = require('./models/UserSchema');


//to store cookies 
const cookies = require('cookie-parser');
router.use(cookies());

//router in use
router.get('/', (req, res) => {
    res.send("hello this is home page using the router");
})

//register router
router.post('/register', async (req, res) => {
    const { name, email, phone, password, cpassword } = req.body;
    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(422).json({ error: "plz provide valid info" });
    }

    try {

        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "user alredy exist" });
        }
        const user = new User({ name, email, phone, password, cpassword });

        const userRegister = await user.save();
        if (userRegister) {
            res.status(201).json({ message: "registered succesfully" });
        }
        else {
            res.status(500).json({ error: "failed to register" })
        }

    } catch (err) {
        console.log(err);
    }
})

//login router
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "fill the data first" });
        }
        const userLogin = await User.findOne({ email: email });


        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            const token = await userLogin.generateAuthToken();
            //  console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            if (!isMatch) {
                res.status(400).json({ message: " Invalid credentials" });
            }
            else {
                res.json({ message: "login succesfull" });
            }
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }

    } catch (err) {
        console.log(err);
    }
})

router.get('/about', authentication, (req, res) => {

    res.send(req.rootuser);
})
router.get('/userdata', authentication, (req, res) => {

    res.send(req.rootuser);
})

router.post('/contact', authentication, async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.json({ error: "plz fill th form" });
        }
        const usercontact = await User.findOne({ _id: req.userId });


        if (usercontact) {
            const usermessage = await usercontact.addmessage(name, email, message);
            await usercontact.save();
            res.status(201).json({ message: "success" });
        }

    } catch (err) {
        console.log(err);
    }
})


router.get('/logout', (req, res) => {
    console.log("logout ko mera hello");
    res.clearCookie('jwtoken', { path: '/' });
    res.status(200).send("user logout");
})


module.exports = router;