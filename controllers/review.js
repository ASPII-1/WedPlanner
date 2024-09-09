const Review = require('../models/review');
const WedGround = require('../models/wedGround');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const newPlace = await WedGround.findById(id).populate({
        path: 'reviews',
    }).populate('reviews');


    const review = new Review(req.body.review);
    review.author = req.user._id;
    newPlace.reviews.push(review);
    newPlace.rating = calculateAverage(newPlace.reviews);
    await newPlace.save();
    await review.save();
    req.flash('success', 'Successfully made a review!');
    res.redirect(`/wedgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await WedGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/wedgrounds/${id}`)
};

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum+=parseInt(element.rating,10);
    });
    return sum / reviews.length;
}
