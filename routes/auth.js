const key = require('../env-config.js');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const secret = require('../config').secret;

// function getTokenFromHeader(req){
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
//       req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     return req.headers.authorization.split(' ')[1];
//   }

//   return null;
// }

// var auth = {
//   required: jwt({
//     secret: secret,
//     userProperty: 'payload',
//     getToken: getTokenFromHeader
//   }),
//   optional: jwt({
//     secret: secret,
//     userProperty: 'payload',
//     credentialsRequired: false,
//     getToken: getTokenFromHeader
//   })
// };

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://alonzoalden.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://localhost:3000/api/',
    issuer: "https://alonzoalden.auth0.com/",
    algorithms: ['RS256']
});

module.exports = jwtCheck;
