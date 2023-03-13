const mongoose = require("mongoose");
const RateSchema = new mongoose.Schema({
    name: {
        type: String,
        require: false
    },
    answer: {
        type: String,
        require: false
    },
    likely: {
        type: Number,
        require: false
    },
    rating: {
        type: Number,
        required: false
    },
    satisfied: {
        type: Number,
        require: false
    },
    location: {
        type: Number,
        require: true
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false
    },
    record: {
        type: Number,
        required: false
    },
    position: {
        type: [String],
        required: false
    },
    comments: {
        type: [String],
        required: false
    }

},
 {timestamps: true}
);

module.exports =  mongoose.model("Rating", RateSchema);