exports.getHomePage = (req, res, next) => {
    res.render('home.ejs',
        {
            pageTitle: "Home Page",
            session: req.session,
            routeFor: "home",
            headerTitle: "Library Portal"
        });
};