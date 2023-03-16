const auth_router = require("express").Router();

const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//REGISTER
auth_router.post("/register", async (req, res) => {
    console.log('auth...')
    try {
        const salt =  await bcrypt.genSalt(10);
        const hashPass =await bcrypt.hash(req.body.password,salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
            displayName: req.body.email,
            role: 'manager'
        })
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err)
    }
})
//LOGIN
auth_router.post("/login", async (req,res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) {
            res.status(400).json('Can not find user');
            
        } else {
            const validated =  bcrypt.compareSync(req.body.password, user.password);
            if(!validated) {
                res.status(400).json('Wrong Password');
            } else {
                const  {password, ...other} = user._doc;
                // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
                res.status(200).json(other);
            }
        }
    } catch(err) {
        res.status(500).json(err)
    }
})
module.exports = auth_router;
