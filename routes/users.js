const router = require("express").Router();

const User = require("../models/User");
const bcrypt = require('bcrypt');

//UPDATE
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id) {
        try {
            const newUpdateUser = {};
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10)
                newUpdateUser.password = await bcrypt.hash(req.body.password, salt)
            };
            if (req.body.username) {newUpdateUser.username = req.body.username};
            if (req.body.email) {newUpdateUser.email = req.body.email}
            if (req.body.profilePicture) {
                newUpdateUser.profilePicture = req.body.profilePicture
            }
            if (req.body.displayName) {
                newUpdateUser.displayName = req.body.displayName
            }
            if (req.body.location) {
                newUpdateUser.location = req.body.location
            }

            try {
                const updateUser = await User.findByIdAndUpdate(req.params.id,{
                    $set: newUpdateUser
                },
                {new: true}
                );
                res.status(200).json(updateUser)

            } catch (err) {
                res.status(500).json(err)
            }

        } catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(401).json("you can update only your account!")
    }
    
})
//DELETE
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                try {
                    await Post.deleteMany({username: user.username});
                    await User.findByIdAndDelete(req.params.id);
                    res.status(200).json("User has been deleted");
    
                } catch (err) {
                    res.status(500).json(err);
                }
    
            } catch (err) {
                res.status(500).json(err);
            }
        } catch (err) {
            res.status(404).json("User not found");
        }
    }
    else {
        res.status(401).json("you can update only your account!");
    }
    
})
// GET
router.get('/:id', async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...other} = user._doc;
        res.status(200).json(other)
    } catch (err) {
        res.status(404).json(err)
    }
})
module.exports = router;
