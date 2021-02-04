const express = require('express');
var routes = require('./routes');

// create the express application
const app = express();


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);



app.listen(3000);