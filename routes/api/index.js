const router = require('express').Router();
const isSQL = process.argv.slice(2)[0].toLowerCase() === 'sql';

if (isSQL) {
	router.use('/', require('./users-sql'));
} else {
	router.use('/', require('./users'));
}

router.use(function(err, req, res, next){
	if(err.name === 'ValidationError'){
		return res.status(422).json({
			errors: Object.keys(err.errors).reduce(function(errors, key){
				errors[key] = err.errors[key].message;

				return errors;
			}, {})
		});
	}

	return next(err);
});

module.exports = router;