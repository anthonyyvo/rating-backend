const rateRouter = require("express").Router();
const { default: mongoose } = require("mongoose");
const Rating = require("../models/Rating");
const User = require("../models/User");

rateRouter.post('/', async (req, res) => {
    const newRating =  new Rating(req.body);
    try { 
        const findUser = await User.findOne({username: req.body.username});
        if (findUser) {
            try {
                const savedRating = await newRating.save();
                res.status(200).json(savedRating);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You are not allow");

        }
    } catch (err) {
        res.status(500).json("Can not authorized");

    }
});
rateRouter.get("/", async (req,res) => {
    const location = req.query.location;
    const satisfied = req.query.satisfied;
    const days = req.query.days;
    try {
        let allRatings;
        if (location) {
            allRatings = await Rating.find({location}).sort({createdAt: -1});
        } else if (satisfied) {
            allRatings = await Rating.find({satisfied}).sort({createdAt: -1});
        } else if (days) {
            var d = new Date();
            d.setDate(d.getDate() - days);
            allRatings = await Rating.find(
                {createdAt : { $gte : d} }
                ).sort({createdAt: -1})
        }
         else {
             allRatings = await Rating.find({}).sort({createdAt: -1});
        }
        res.status(200).json(allRatings)
    } catch (err) {
        res.status(500).json(err)
    }
})
rateRouter.get("/:id", async (req,res) => {
    const ratingId =  req.params.id;

    try {
         const rating = await Rating.findById(ratingId);
        res.status(200).json(rating);
    } catch (err) {
        res.status(500).json(err)
    }
})
rateRouter.put("/:id", async (req, res) => {
    console.log(req.body);
    try {
        const rating = await Rating.findById(req.params.id);
        const {userLocation, ...other} = req.body;
        if (!userLocation || rating.location === userLocation ) {
            try {
                const updateRating = await Rating.findByIdAndUpdate(req.params.id,
                    {
                        $set: other
                    }, {new: true})
                res.status(200).json(updateRating);
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(500).json("You can only update your location rating")
        }
    } catch (err) {
        res.status(401).json(err)
    }
})
rateRouter.delete("/:id", async (req,res) => {
    const ratingId =  req.params.id;
    console.log(req.body);
    console.log(ratingId);
    try {
         if (req.body.isAdmin || req.body.isMod) {
            const deleteRes = await Rating.findByIdAndDelete(ratingId);
            res.status(200).json(deleteRes);
         } else {
            res.status(403).json('Only admin or mod can delete.')
         };
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = rateRouter;