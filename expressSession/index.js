/*
sessions are used to store information between http requests
sessions fulfill an important role between user authentication and authorization.
Traditionally, sessions are identifiers sent from the server and stored on the client-side. On the next request, the client sends the session token to the server. Using the identifier, the server can associate a request with a user.
Session identifiers can be stored in cookies, localStorage, and sessionStorage
Session identifiers can be sent back to the server via cookies, URL params, hidden form fields or a custom header.
Additionally, a server can accept session identifiers by multiple means. This is usually the case when a back-end is used for websites and mobile applications.
A session identifier is a token stored on the client-side. Data associated with a session identifier lies on the server.
- must be random - use random number generator?
- stored in a cookie
Cookies are ideal because they are sent with every request and can be secured easily.
LocalStorage doesn't have an expiry attribute so it persists
SessionStorage doesn't persist across multiple tabs/windows and is cleared when a tab is closed.
Usually, the communication between client and server should be over HTTPS
Sessions should be refreshed if the request is redirected
Typically, a session library should be able to generate a unique session, refresh an existing session and revoke sessions. We will be exploring the express-session library ahead.

*/

/*
express-session
---------------
cookie-based Session Management.
Multiple modules for managing session stores
An API to generate, regenerate, destroy and update sessions
Settings to secure cookies (Secure / HttpOnly / Expire /SameSite / Max Age / Expires /Domain / Path)

creates a session middleware
only session id stored in cookie
session data stored server side
this module now directly read/writes cookies on res/req
- req.session
- res.session?
*/
const express = require('express');
const express_session = require('express-session');  // See https://www.npmjs.com/package/express-session


// create the express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// we can generate a session as shown below
// by default cookies set to { path: '/', httpOnly: true, secure: false, maxAge: null }
// to harden session cookie we can specify options in cookie object
// by default, session are stored in MemoryStore. In production, use alternative e.g.MongoDB
// The session object is associated with all routes and can be accessed on all requests. - check
// To store or access session data, simply use the request property req.session, which is (generally) serialized as JSON
// req.session brought into existence by app.use express-session
app.use(express_session({
    secret: 'veryimportantsecret',      // used to sign the cookie - verify that the CONTENTS of the cookie have not been changed by the user, so the contents can be trusted
    name  : 'my_first_session_cookie', // renames from default connect.sid
    resave: false,
   //secure  : true, - not visible in browser application tab   
    saveUninitialized: true ,
    cookie: {
        httpOnly: true,  // cannot be accessed by client side APIs such as javascript   
        sameSite: true,
        maxAge: 600000
    }
}));


app.get('/', (req, res, next) => {

    if (req.session.visits) {
        req.session.visits++;
    } else {
        req.session.visits = 1;
    }
    res.send(`<h1>Hello world : ${req.session.visits}</h1>`);
});

/*app.get('/', (req, res, next) => {
    // can get information about session here
    console.log('hello world');
    console.log(req.session);  // brought into existence by app.use express-session
    console.log(res.session);  // undefined. not brought into existence by app.use express-session?
    res.send('<h1>Hello world</h1>');
});*/

/*var glob = 0;
app.get('/', (req, res, next) => {
    // can get information about session here
    console.log('hello world');

    if (req.visits) {
        req.visits++;
    } else {
        req.visits = 1;
    }
    glob++;
    res.send(`<h1>Hello world - ${req.visits}, ${glob}</h1>`);
});*/


app.listen(3000);
