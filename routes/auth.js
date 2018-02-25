const key = require('../env-config.js');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const secret = require('../config').secret;

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://alonzoalden.auth0.com/.well-known/jwks.json"
    }),
    aud: "http://localhost:3000/api/",
    issuer: "https://alonzoalden.auth0.com/",
    algorithms: ['RS256']
});

module.exports = jwtCheck;
