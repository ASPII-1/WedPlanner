const WedGround = require('../models/wedGround');
const { cloudinary } = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;



module.exports.index = async (req, res) => {
    let wedgrounds = await WedGround.find({})
    res.render('wedgrounds/index', { wedgrounds });
};

module.exports.renderNewForm = async (req, res) => {
    res.render('wedgrounds/new');
};

module.exports.createWedGround = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.wedground.location, { limit: 1 });
    const newPlace = new WedGround(req.body.wedground);
    newPlace.totalViews=0;
    newPlace.geometry = geoData.features[0].geometry;
    newPlace.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newPlace.author = req.user._id;
    await newPlace.save();
    req.flash('success', 'Successfully made a new wedground!');
    res.redirect(`/wedgrounds/${newPlace._id}`);
}

module.exports.showWedGround = async (req, res) => {
    const { id } = req.params;
    const wedground = await WedGround.findById(id).populate({
        path: 'reviews',
        populate: ({
            path: 'author'
        })
    }).populate('author');

    if (!wedground) {
        req.flash('error', 'Cannot find that wedGround')
        return res.redirect('/wedgrounds');
    }
    wedground.totalViews++;
    await wedground.save();
    res.render('wedgrounds/show', { wedground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const wedground = await WedGround.findById(id);
    if (!wedground) {
        req.flash('error', 'Cannot find that wedGround')
        return res.redirect('/wedgrounds');
    }
    res.render('wedgrounds/update', { wedground });
};

module.exports.updateWedGround = async (req, res) => {
    const { id } = req.params;
    const wedgrounds = await WedGround.findByIdAndUpdate(id, req.body.wedground, { runValidators: true, new: true });
    const geoData = await maptilerClient.geocoding.forward(req.body.wedground.location, { limit: 1 });
    wedgrounds.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    wedgrounds.images.push(...imgs);
    await wedgrounds.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await wedgrounds.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated wedground!');
    res.redirect(`/wedgrounds/${id}`);
};


module.exports.deleteWedGround = async (req, res) => {
    const { id } = req.params;
    const wedground = await WedGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a wedground!');

    res.redirect('/wedgrounds');
};

module.exports.renderFeature=async(req,res)=>{
    res.render('/wedgrounds/feature',)
}