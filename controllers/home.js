exports.getHomePage = (req, res, next) => {
    res.render('home.ejs', { number: 1 });
};