const mongoose = require('mongoose');
const axios = require('axios');
const { cities } = require('./cities');
const maptilerClient = require('@maptiler/client');
const { descriptors, places, authors } = require('./seedHelpers');
const WedGround = require('../models/wedGround');
const User = require('../models/user');

maptilerClient.config.apiKey = "dL9kMw5bURz8HTlsCcjq";


mongoose.connect('mongodb://127.0.0.1:27017/wedApp')
    .then(() => {
        console.log("Connected to the Mongo server Seed");
    })
    .catch(err => {
        console.log('error is:-', err)
    })
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

// async function seedImg() {
//     try {
//         const resp = await axios.get('https://api.unsplash.com/photos/random', {
//             params: {
//                 client_id: 'XlMS7ea-7EJuqMWX21S3Pu6Puf3ZpyLbMmI_7yrslK8',
//                 collections: 1114848,
//             },
//         })
//         return resp.data.urls.small
//     } catch (err) {
//         console.error(err)
//     }
// }
const seedDB = async () => {
    await WedGround.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random = Math.floor(Math.random() * 50);
        const randomPrice = Math.floor(Math.random() * 500000) + 100000;
        const authors = await User.aggregate([{ $sample: { size: 1 } }]);
        let region= `${cities[random].City},${cities[random].State}`;
        const geoData = await maptilerClient.geocoding.forward(region, { limit: 1 })

        const randomUser = authors[0];
        const place = new WedGround({
            images: [{
                url: 'https://res.cloudinary.com/dblf5uu1b/image/upload/v1720044878/YelpCamp/oq6h7mrnunzxfm8aknfa.webp',
                filename: 'YelpCamp/oq6h7mrnunzxfm8aknfa',
            },
            {
                url: 'https://res.cloudinary.com/dblf5uu1b/image/upload/v1720044880/YelpCamp/ollc5pqhp5vu4nivv8yb.avif',
                filename: 'YelpCamp/ollc5pqhp5vu4nivv8yb',

            }

            ],
            price: randomPrice,
            location: `${cities[random].City},${cities[random].State}`,
            geometry:geoData.features[0].geometry,
            title: `${sample(descriptors)} ${sample(places)}`,
            author: randomUser._id,
            description:
                'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!'
        })
        console.log(i);
        await place.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})