const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_150');
});


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar:ImageSchema
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User', userSchema);
module.exports = User;