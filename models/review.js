const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    rating: Number,
    body: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    createdAt: {
		type: Date,
		default: Date.now
	},
})
const Review = new mongoose.model('Review', reviewSchema);
module.exports = Review;