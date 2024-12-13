const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    feedback:String,
    date: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
});

module.exports = mongoose.model("feedbacks",userSchema)