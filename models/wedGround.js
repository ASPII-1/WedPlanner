const mongoose = require('mongoose');
const Review = require('./review')
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_150');
});

const wedSchema = new mongoose.Schema({
    title: String,
    price: Number,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    createdAt: {type: Date, default: Date.now},
    images: [ImageSchema],
    totalViews: {
        type: Number,
        default: 2
    },
    reviews: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Review'
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, opts);

wedSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/wedgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.location}</p>`
});

wedSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
const WedGround = new mongoose.model('WedGround', wedSchema);
module.exports = WedGround;