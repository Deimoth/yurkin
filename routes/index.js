var main = require('./main'),
    register = require('./register'),
    authentication = require('./authentication'),
    error = require('./error');

module.exports = function (app) {
    app.get('/', main.home);

    app.post('/register', register.requestRegistration);

    app.get('/users', authentication.users);
    app.get('/users/:id', authentication.user);

    app.get('*', error['404']);
};

exports.home = function(req, res, next) {
    res.render('index');
};
