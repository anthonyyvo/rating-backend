const adminRouter = require('express').Router();
const Rating = require('../models/Rating');
const User = require("../models/User");
const json2csv = require('json2csv').parse;
const path = require("path");
const fs = require('fs');

const isoDateToUTC = (param) => {
    const isoDate =  new Date(param);
      const localDate =  isoDate.toLocaleDateString("en-GB");
      const localTime =  isoDate.toLocaleTimeString();
      return localDate + "-" + localTime
}
const positionList = ['Receptionist', 'Assistant', 'Doctor', 'Security' , 'Customer Service'];


adminRouter.get('/csv', (req, res) => {
    res.send('ok')
})
adminRouter.post('/csv', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        if (user.isAdmin === true) {
            try {
                const allRatings = await Rating.find({});
                const mapRatings = allRatings.reduce((acc,current,i) => {
                    let createdAt = isoDateToUTC(current.createdAt);
                    acc.push(
                        {...current._doc, 
                        createdAt: createdAt,
                        [positionList[0]]: current.position[0],
                        [positionList[1]]: current.position[1],
                        [positionList[2]]: current.position[2],
                        [positionList[3]]: current.position[3],
                        [positionList[4]]: current.position[4],
                    }
                    );
                    return acc;
                },[]);
                let csv;
                const dateTime = new Date().toISOString().slice(-24).replace(/\D/g,'').slice(0, 14);
                const filePath = path.join(__dirname, "../", "csv-" + dateTime + ".csv");
                const fields = ['name', 'phone','likely', 'rating',"satisfied", 'answer', "location", "username", "comments", "createdAt", ...positionList];

                try {
                    csv = json2csv(mapRatings, {fields});
                } catch (err) {
                    return res.status(500).json({err});
                }
                fs.writeFile(filePath, csv, function (err) {
                    if (err) {
                        return res.json(err).status(500);
                    }
                    else {
                        setTimeout(function () {
                            fs.unlink(filePath, function (err) { // delete this file after 30 seconds
                            if (err) {
                                console.error(err);
                            }
                            console.log('File has been Deleted');
                        });
            
                    }, 30000);
                        res.download(filePath);
                    }
                })
            

                // res.status(200).json(allRatings);

            } catch (err) {

            }
        }
        else {
            res.status(403).json('you are not admin')
        }
    } catch (err) {
        res.status(500).json('error server')

    }



});

module.exports = adminRouter;