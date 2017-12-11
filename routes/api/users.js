var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var axios = require('axios');

router.get('/user', auth.required, function(req, res, next){

  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    return res.json({user: user.toAuthJSON()});
  }).catch(next);
});

router.put('/user', auth.required, function(req, res, next){
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }

    // only update fields that were actually passed...
    if(typeof req.body.user.username !== 'undefined'){
      user.username = req.body.user.username;
    }
    if(typeof req.body.user.email !== 'undefined'){
      user.email = req.body.user.email;
    }
    if(typeof req.body.user.bio !== 'undefined'){
      user.bio = req.body.user.bio;
    }
    if(typeof req.body.user.image !== 'undefined'){
      user.image = req.body.user.image;
    }
    if(typeof req.body.user.password !== 'undefined'){
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function(){
      return res.json({user: user.toAuthJSON()});
    });
  }).catch(next);
});

router.post('/users/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, user, info){
    if(err){ return next(err); }

    if(user){
      user.token = user.generateJWT();
      return res.json({user: user.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

//register new user
router.post('/users/register', function(req, res, next){

  const userInfo = {
    client_id: req.body.user.clientId,
    client_secret: req.body.user.clientSecret,
    code: req.body.user.accessCode
  };

  axios.post('https://www.strava.com/oauth/token', userInfo)
      .then((success)=> {
        let user = new User();

        user.token = success.token;
        user.name = success.name;

        //save into db and respond to client with info
        user.save()
          .then(() => res.json({user: user.toAuthJSON()}))
          .catch(next);

      })
      .catch((error)=> {
        console.log(error);
      });


  //create HTTPrequest to strava with: accessCode, clientiD, secret
  //on success:
  //  return strava access token + info to client
  //  save information into database
});

module.exports = router;