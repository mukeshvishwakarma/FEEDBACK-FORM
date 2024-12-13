const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    cpassword:String,
    admin: String,
});

module.exports = mongoose.model("users",userSchema)