var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send({city : 1008261});
})

module.exports = router;