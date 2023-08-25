const mongoose = require("mongoose");
const QuestionSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true, 
        unique: true
    },
    question: {
        type: String,
        require: true
    },
    questionEng: {
        type: String,
        require: true
    },
    options: {
        type: [String],
        required: false
    },
    optionsEng: {
        type: [String],
        required: false
    },
    order: {
        type: Number,
        require: false
    },
    comments: {
        type: [String],
        required: false
    }
},
 {timestamps: true}
);

module.exports =  mongoose.model("Question", QuestionSchema);