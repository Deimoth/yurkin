module.exports = function (app, express) {
    var ejs = require('ejs-locals'),
        path = require('path'),
        config = require('../config'),

        mongoose = require('../utils/mongoose'),
        MongoStore = require('connect-mongo')(express),

        router = require('../routes'),
        errorHandler = require('./errorHandler')(app, express),

        checkAuth = require('./checkAuth');

    /**
     * Page Rendering
     * */
    app.engine('html', ejs);
    app.engine('ejs', ejs);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');


    /**
     * Favicon
     * */
    app.use(express.favicon('public/images/favicon.ico'));


    /**
     * Logger
     * */
    if (app.get('env') == 'development') {
        app.use(express.logger('dev'));
    }


    /**
     * Session
     * */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.get('session:secret'),
        key: config.get('session:key'),
        cookie: config.get('session:cookie'),
        store: new MongoStore({mongoose_connection: mongoose.connection})
    }));

    /**
     * Authorization Access
     * */
    app.use(checkAuth);


    /**
     * Routing
     * */
    app.use(app.router);
    router(app);


    /**
     * Public directory
     * */
    app.use(express.static(path.join(__dirname, '../public')));
    app.use("/public", express.static(path.join(__dirname, '../public')));


    /**
     * Error handing
     * */
    app.use(errorHandler);
};
