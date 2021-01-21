const express = require('express');
const app = express();

////////////////////////////////////////////////////////////////////////////////
// Global middleware
////////////////////////////////////////////////////////////////////////////////

function gMiddleware1(requestObject, responseObject, nextMiddleware) {
    // nextMiddleware passed in by express framework
    console.log('In gMiddleware1');
    requestObject.customProperty = 100;  // available to subsequent middleware
    nextMiddleware();  // must be called else browser hangs
}

function gMiddleware2(requestObject, responseObject, nextMiddleware) {
    // nextMiddleware passed in by express framework
    console.log('In gMiddleware2');
    //console.log('custom property from previous middleware = ' || requestObject.customProperty);
    console.log(`custom property from previous middleware = ${requestObject.customProperty}`);  // ` denotes template literal
    nextMiddleware();  // must be called else browser hangs
}

function middlewareErrorHandler(errorObject, requestObject, responseObject, nextMiddleware) {
    // nextMiddleware passed in by express framework
    // errorObject passed in by express framework if it exists
    // just another middleware with 1 extra parameter (errorObject)

    console.log('In middlewareErrorHandler');

    if (errorObject) {
        responseObject.send(`<h1>There was an error! Custom property = ${requestObject.customProperty}</h1>`);
    }
}

// define order of execution of global middleware
app.use(gMiddleware1);
app.use(gMiddleware2);


////////////////////////////////////////////////////////////////////////////////
// Route : /
////////////////////////////////////////////////////////////////////////////////

// route specific middleware

function lMiddleware1(requestObject, responseObject, nextMiddleware) {
    // nextMiddleware passed in by express framework
    console.log('In lMiddleware1');
    nextMiddleware();  // must be called else browser hangs
}

function lMiddleware2(requestObject, responseObject, nextMiddleware) {
    // nextMiddleware passed in by express framework
    console.log('In lMiddleware2');

    const errObj = new Error('I am an error');
    nextMiddleware(errObj); 
}

function standardExpressCallback( requestObject, responseObject, nextMiddleware ) {
    console.log('In standardExpressCallback');
    responseObject.send(`<h1>Hello world. Custom property = ${requestObject.customProperty}</h1>`)
}

// route url
app.get('/', lMiddleware1, lMiddleware2, standardExpressCallback);
/*app.get('/', (req, res, next) => {
    console.log('in route');
    res.send('<h1>hello world</h1>');
});*/

// error handling midleware goes at the end!
// On error, express skips rest of middleware and propagates error to here
app.use(middlewareErrorHandler);

app.listen(3000);