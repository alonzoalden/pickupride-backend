var mongoose = require('mongoose');
var router = require('express').Router();

router.get('/user', function(req, res, next){
    console.log(req, res, next);
    res.json('hello');
}); 

module.exports = router;
