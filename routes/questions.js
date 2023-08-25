const question_router = require("express").Router();
const Question = require("../models/Question");
const User = require("../models/User");

// ROUTER POST 1 QUESTION BY USERNAME

question_router.post('/', async (req,res) => {
    const newQuestion = new Question(req.body);
try {
    const findUser = User.findOne({username: req.body.username});
    if (findUser) {
        try {
            const savedQuestion = await newQuestion.save();
            res.status(200).json({savedQuestion});
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("You are not allow post question")
    }

} catch (err) {
    res.status(500).json("Can not authorize")
};

});

// ROUTER GET 1 QUESTION BY NAME
question_router.post('/:name', async (req,res) => {
try {
    const findQuestion = await Question.findOne({name: req.params.name});
    if (findQuestion) {
        res.status(200).json(findQuestion);
    } else {
        res.status(500).json("Can not find question")
    }
  

} catch (err) {
    res.status(500).json("Can not authorize")
};

});

// ROUTER GET ALL QUESTION
question_router.get('/', async (req,res) => {
    try {
        const findQuestions = await Question.find();
        if (findQuestions) {
            res.status(200).json(findQuestions);
        } else {
            res.status(500).json("Can not find all")
        }
      
    
    } catch (err) {
        res.status(500).json("Can not authorize")
    };
    
    });
// ROUTER UPDATE QUESTION BY ID in params and username

question_router.put('/:id', async (req,res) => {
    try {
        const findUser = await User.findOne({username: req.body.username});
        if (findUser && findUser.isAdmin) {
            const updateQuestion = {...req.body}

            try {
                const updated = await  Question.findByIdAndUpdate(req.params.id, {
                    $set: updateQuestion
                },
                {new: true}
                )
                res.status(200).json({updated});
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("You are not allow edit question")
        }
    
    } catch (err) {
        res.status(500).json("Can not authorize")
    };
    
    });

    question_router.delete('/:id', async (req,res) => {
        try {
            const findUser = await User.findOne({username: req.body.username});
            if (findUser && findUser.isAdmin) {
    
                try {
                    const deleted = await  Question.findByIdAndDelete(req.params.id
                    )
                    res.status(200).json({deleted});
                } catch (error) {
                    res.status(500).json(error);
                }
            } else {
                res.status(401).json("You are not allow delete question")
            }
        } catch (err) {
            res.status(500).json("Can not authorize delete")
        };
        
        });
module.exports = question_router;
