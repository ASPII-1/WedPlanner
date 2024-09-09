if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/wedApp')
    .then(() => {
        console.log("Connected to the Mongo server");
    })
    .catch(err => {
        console.log('error is:-', err)
    })
const express = require('express')
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet');


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const WedGround = require('./models/wedGround');
const Review = require('./models/review');
const User = require('./models/user');
const WedGroundRoutes = require('./routes/wedGround');
const ReviewRoutes = require('./routes/review');
const UserRoute = require('./routes/user');
const FeatureRoute=require('./routes/feature');
const { register } = require('module');


const sessionConfig = {
    name: 'session',
    secret: 'ThisSecretMustNotBeExposed',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true      //will break in localhost only work in http req
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//security 
app.use(mongoSanitize());
app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  

app.use(flash());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', UserRoute);
app.use('/wedgrounds/feature', FeatureRoute);
app.use('/wedgrounds', WedGroundRoutes);
app.use('/wedgrounds/:id/reviews', ReviewRoutes);
app.get('/', (req, res) => {
    res.render('home')
});


app.get('/results', async(req, res) =>{
    const {search_query,toggle=0} = req.query;
    let wedgrounds;
    if(toggle==0)
    {
        wedgrounds= await WedGround.find( {title: {$regex: search_query, $options: "i"} })
    }
    else
    {
         wedgrounds = await WedGround.find( {location: {$regex: search_query, $options: "i"} })
    }
    res.render('wedgrounds/search', {wedgrounds, search_query})
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something is Wrong';
    res.status(statusCode).render('partial/error.ejs', { err });
})

app.listen('3000', function () {
    console.log('hii welcome to localhost:3000');
})