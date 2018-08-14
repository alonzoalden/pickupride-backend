const { Pool } = require('pg');
const path = require('path');
const router = require('express').Router();
// const passport = require('passport');
// const Auth = require('../auth');
// const Http = require('../../agent.js');
const keys = require('../../env-config.js');
const _ = require('underscore');
const db = require('../../db/util');


const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432';

//retrieve user info
// router.get('/user/:authAccessToken', async (req, res, next) => {
// 	try {
// 		const response = await Http
// 			.setToken(req.params.authAccessToken)
// 			.requests.get(`${keys.AUTH0_DOMAIN}/userinfo`);

//         pg.connect(connectionString, (err, client, done) => {
//             const results = [];
//             // Handle connection errors
//             if(err) {
//                 done();
//                 console.log(err);
//                 return res.status(500).json({success: false, data: err});
//             }
//             // SQL Query > Select Data
//             const query = client.query(
//                 'SELECT * FROM users WHERE auth_email=($1)',
//                 [response.email]
//             );
//             // Stream results back one row at a time
//             query.on('row', (row) => {
//                 results.push(row);
//             });
//             // After all data is returned, close connection and return results
//             query.on('end', () => {
//                 done();
//                 return res.json(results);
//             });
//           });

// 	}
// 	catch(e) {
// 		console.log(e);
// 	}
// });

router.get('/users', async (req, res, next) => {
	try {
        var pool = new Pool({
            connectionString: 'postgres://localhost:5432',
          });
          pool.query('SELECT * FROM users WHERE auth_email=($1)',
        //   [req.params.auth_email],
          (err, res) => {
            console.log(err, res)
            pool.end()
          })

        // pool.connect((err, client, done) => {
        //     const results = [];
        //     if(err) {
        //         done();
        //         console.log(err);
        //         return res.status(500).json({success: false, data: err});
        //     }

        //     const query = pool.query(
        //         'SELECT * FROM users WHERE auth_email=($1)',
        //         [req.params.auth_email], 
        //         (err, result) => {
        //             console.log(result);
        //         });
            // query.on('row', (row) => {
            //     results.push(row);
            // });
            // query.on('end', () => {
            //     done();
            //     return res.json(results);
            // });
          //});

	}
	catch(e) {
		console.log(e);
	}
});

router.post('/users', (req, res, next) => {
    const results = [];
    // Grab data from http request
    const data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        auth_email: req.body.auth_email
    };
    var pool = new Pool({
        user: 'test123',
        host: 'localhost',
        database: 'ride',
        password: 'test123',
        port: 5432,
      });

    pool.query('INSERT INTO users(firstname, lastname) values($1, $2)',
    [data.firstname, data.lastname],
    (err, res) => {
        console.log(err, res)
        pool.end()
    }
)
    // // Get a Postgres client from the connection pool
    // pool.connect((err, client, done) => {
    //   // Handle connection errors
    //     if(err) {
    //         done();
    //         console.log(err);
    //         return res.status(500).json({success: false, data: err});
    //     }
    //   // SQL Query > Insert Data
    //     client.query('INSERT INTO users(firstname, lastname) values($1, $2)',
    //     [data.firstname, data.lastname],

    //     (err, result) => {
    //         console.log(result);
    //     }

    // );
      // SQL Query > Select Data
    //   const query = client.query('SELECT * FROM users ORDER BY id ASC');
    //   // Stream results back one row at a time
    //   query.on('row', (row) => {
    //     results.push(row);
    //   });
    //   // After all data is returned, close connection and return results
    //   query.on('end', () => {
    //     done();
    //     return res.json(results);
    //   });
    // });
  });


// router.get('/', (req, res, next) => {
//   res.sendFile(path.join(
//     __dirname, '..', '..', 'client', 'views', 'index.html'));
// });

// router.get('/api/v1/todos', (req, res, next) => {
//   const results = [];
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Select Data
//     const query = client.query('SELECT * FROM items ORDER BY id ASC;');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });

// router.post('/api/v1/todos', (req, res, next) => {
//   const results = [];
//   // Grab data from http request
//   const data = {text: req.body.text, complete: false};
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Insert Data
//     client.query('INSERT INTO items(text, complete) values($1, $2)',
//     [data.text, data.complete]);
//     // SQL Query > Select Data
//     const query = client.query('SELECT * FROM items ORDER BY id ASC');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });

// router.put('/api/v1/todos/:todo_id', (req, res, next) => {
//   const results = [];
//   // Grab data from the URL parameters
//   const id = req.params.todo_id;
//   // Grab data from http request
//   const data = {text: req.body.text, complete: req.body.complete};
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Update Data
//     client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
//     [data.text, data.complete, id]);
//     // SQL Query > Select Data
//     const query = client.query("SELECT * FROM items ORDER BY id ASC");
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', function() {
//       done();
//       return res.json(results);
//     });
//   });
// });

// router.delete('/api/v1/todos/:todo_id', (req, res, next) => {
//   const results = [];
//   // Grab data from the URL parameters
//   const id = req.params.todo_id;
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
//     // Handle connection errors
//     if(err) {
//       done();
//       console.log(err);
//       return res.status(500).json({success: false, data: err});
//     }
//     // SQL Query > Delete Data
//     client.query('DELETE FROM items WHERE id=($1)', [id]);
//     // SQL Query > Select Data
//     var query = client.query('SELECT * FROM items ORDER BY id ASC');
//     // Stream results back one row at a time
//     query.on('row', (row) => {
//       results.push(row);
//     });
//     // After all data is returned, close connection and return results
//     query.on('end', () => {
//       done();
//       return res.json(results);
//     });
//   });
// });

module.exports = router;