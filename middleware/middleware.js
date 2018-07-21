module.exports = {
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    },
    onlyOn : function(path, middleware) {
        return function(req, res, next) {
            if (path !== req.path) {
                return next();
            } else {
                return middleware(req, res, next);
            }
        };
    }
};

// var unless = function(path, middleware) {
//     return function(req, res, next) {
//         if (path === req.path) {
//             return next();
//         } else {
//             return middleware(req, res, next);
//         }
//     };
// };
