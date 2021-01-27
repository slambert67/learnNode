const router = require('express').Router();


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});



module.exports = router;  // 'router' not used in app. routes used?