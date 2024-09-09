const User = require('../models/user');
const { cloudinary } = require("../cloudinary");

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, avatar,password } = req.body;
        const user = new User({ email,username });
        user.avatar= {url: req.file.path, filename: req.file.filename };
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Wed Planner!  ${username}`);
            res.redirect('/wedgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    const username = req.body.username;
    req.flash('success', `Welcome back ${username}!`);
    const redirectURL = res.locals.returnTo || '/wedgrounds';
    res.redirect(redirectURL);
};


module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);
    })
    req.flash('success', `Goodbye :(`);
    res.redirect('/wedgrounds');
};