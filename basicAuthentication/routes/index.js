const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.status_code = 200;
    res.end("Welcome to your express app!");
});

function authMiddleware(req, res, next) {
    console.log('In authentication middleware');
    /**
     * if credentials have been passed they'll be in a header called Authorization
     * (note NodeJS lowercases the names of headers in its request object)
     */

    // var auth = req.headers['authorization'];
    var auth = req.headers.authorization;
    console.log('auth initialized as - ' + auth);
    /**
     * initial request will likely have no credentials so auth will be undefined
     */
    if (!auth) {   
        console.log('credentials not supplied');
        // No Authorization header was passed in so it's the first time the browser hit us

        // Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
        // Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
        // 401 ensures browser prompts for username/password
        res.statusCode = 401;  
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

        res.end('<html><body>Need some credentials</body></html>');
    } 
    else {
        console.log('we have credentials - ' + auth);

        var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

        // convert from base64
        var buf = new Buffer.from(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
        var plain_auth = buf.toString();             // read it back out as a string

        console.log("Decoded Authorization ", plain_auth);

        // At this point plain_auth = "username:password"

        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];

        if((username == 'squoink') && (password == 'oldpeculier')) {   // Is the username/password correct? Check entries in database here!

            res.statusCode = 200;  // OK
            res.end('<html><body>Congratulations - credentials accepted!</body></html>');
        }
        else {
            res.statusCode = 401; // Force them to retry authentication
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

            // res.statusCode = 403;   // or alternatively just reject them altogether with a 403 Forbidden

            res.end('<html><body>You shall not pass</body></html>');
        }
    }
}

router.get('/secret', authMiddleware);

module.exports = router;