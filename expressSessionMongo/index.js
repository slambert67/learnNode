const express = require('express');
const express_session = require('express-session');  // See https://www.npmjs.com/package/express-session
const mongoose = require('mongoose');

// package documentation - https://www.npmjs.com/package/connect-mongo
// session data (store) can be stored in multiple locations inc. in memory
// connect-mongo used for session storage
// can reuse an existing mongoose connection
// removes expired sessions
// exports a function which takes my session as a parameter
// constructor class MongoStore extends session.Store
const MongoStore = require('connect-mongo')(express_session);  


// create the express application
const app = express();


// connect to mongodb
const dbString = 'mongodb://localhost:27017/learningdb';
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connection = mongoose.createConnection(dbString, dbOptions);

// global middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// create a new collection to store session information
// express-session has concept of session store
// defines what persistent memory we are going to store our sessions in
// session can accrue a lot of information
// fancy way od saying we need to connect database to express session middleware
// prerequisite for session store is a database connection
const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
});

// use express-session middleware specifying store as sessionStore defined above
// connect.sid of cookie = _id of session in sessionStore
// session initialised here and id generated here
// cookie sent in response
app.use( express_session({
    secret: 'some secret',  // usually stored in an env variable.session authentication?
    resave: false,          // tell middleware how to react to different events in the browser?
    saveUninitialized: true, // ditto
    store: sessionStore,
    cookie: {
        maxAge: 1000*60*60*24  // 1 day. After this, cookie disappears and is no longer attached to request object
    }  
}));

app.get('/', (req, res, next) => {
        // can add information to session here
    if (req.session.viewCount) {
        req.session.viewCount++;       
    } else {
        req.session.viewCount = 1;
    }
    console.log(req.session);
    res.send(`<h1>Hello world (sessions)</h1>`);
});

app.listen(3000);