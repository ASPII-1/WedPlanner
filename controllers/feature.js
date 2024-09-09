const WedGround = require('../models/wedGround');


module.exports.renderFeature = async (req, res) => {
    res.render('feature/index');
};

module.exports.renderRated = async (req, res) => {
    try {
        const wedgrounds = await WedGround.find({})
            .sort({ rating: -1 })
            .limit(10);

        console.log(wedgrounds);

        res.render('feature/rated', { wedgrounds }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the top rated wedding grounds');
    }
};


module.exports.renderExpensive = async (req, res) => {
    try {
        const wedgrounds = await WedGround.find({})
            .sort({ price: -1 }) // Sort by price in descending order
            .limit(10); // Limit the result to the top 10 most expensive wedding grounds

        res.render('feature/expensive', { wedgrounds }); // Render the view with the wedgrounds data
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the most expensive wedding grounds');
    }
};

module.exports.renderEconomical = async (req, res) => {
    try {
        const wedgrounds = await WedGround.find({})
        .sort({ price: 1 }) 
        .limit(10); 
    
        res.render('feature/economical', { wedgrounds }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the top economical wedding grounds');
    }
};


module.exports.renderViewed = async (req, res) => {
    try {
        const wedgrounds = await WedGround.find({})
        .sort({ totalViews: -1 }) 
        .limit(10); 
    
        res.render('feature/viewed', { wedgrounds }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the top viewed wedding grounds');
    }
};


module.exports.renderNewest = async (req, res) => {
    try {
        const wedgrounds = await WedGround.find({})
            .sort({ createdAt: -1 })
            .limit(10);


        res.render('feature/newest', { wedgrounds }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the newest wedding grounds');
    }
};


module.exports.renderOldest = async (req, res) => {
    try {
        const wedgrounds = await WedGround.find({})
            .sort({ createdAt: 1 })
            .limit(10);


        res.render('feature/oldest', { wedgrounds }); 
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while fetching the oldest wedding grounds');
    }
};


