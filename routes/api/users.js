var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');
var axios = require('axios');
var http = require('../../agent.js');
var keys = require('../../env-config.js');

router.get('/user/:accessToken', auth, function(req, res, next){

//using params.id:
//make call to auth0 to get information (email, name) 
//  if no user exists in our database, return null

  http.setToken(req.params.accessToken);
  http.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`).then((response) => {

    User.findOne({ 'auth_email': response.email }, function (err, person) {
      if (err) return handleError(err);
      return res.json({user: person});
    });
  });
});

router.put('/user', auth, function(req, res, next){
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
router.post('/user/register', function(req, res, next){

  const userInfo = {
    client_id: keys.STRAVA_CLIENT_ID,
    client_secret: keys.STRAVA_CLIENT_SECRET,
    code: req.body.code,
  };

  http.requests.post('https://www.strava.com/oauth/token', userInfo)
      .then((stravaResponse)=> {
          http.setToken(req.body.accessToken);
          http.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`)
              .then((authResponse) => {
                  let user = new User();
                  
                  user.access_token = stravaResponse.access_token;
                  user.strava_email = stravaResponse.athlete.email;
                  user.auth_email = authResponse.email;
                  user.id = stravaResponse.athlete.id;
                  user.firstname = stravaResponse.athlete.firstname;
                  user.lastname = stravaResponse.athlete.lastname;
                  user.profile_medium = stravaResponse.athlete.profile_medium;
                  user.profile = stravaResponse.athlete.profile;
                  user.city = stravaResponse.athlete.city;
                  user.state = stravaResponse.athlete.state;
                  user.country = stravaResponse.athlete.country;
                  user.sex = stravaResponse.athlete.sex;
                  user.created_at = stravaResponse.athlete.created_at;
                  user.updated_at = stravaResponse.athlete.updated_at;

                  res.json({user: user});
              });

                  //save into db and respond to client with info
                  // user.save()
                  //   .then(() => res.json({user: user.toAuthJSON()}))
                  //   .catch(next);

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