var router = require('express').Router();
var pg = require('pg');

var config = {
    database: 'rho'
};

var pool = new pg.Pool(config);

router.get('/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }

        client.query('SELECT * FROM owner WHERE id = $1;', [req.params.id], function(err, result){
                done();
                if(err){
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                }

                console.log('Got rows from the DB: ',result.rows);
                res.send(result.rows);
        });
    });
});


router.get('/', function(req, res){

    pool.connect(function(err, client, done){
            if (err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }

        client.query('SELECT * FROM owner;', function(err, result){
                done();
                if(err){
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                }

                console.log('Got rows from the DB: ',result.rows);
                res.send(result.rows);
        });

    });
});


router.post('/', function(req, res){
    console.log('hello');
    pool.connect(function(err, client, done){
        if (err) {
            res.sendStatus(500);
            done();
            return;
        }
        client.query('INSERT INTO owner (first_name, last_name) VALUES ($1, $2) returning *;',
        [req.body.firstName, req.body.lastName],
        function(err,result){
            done();
            if(err){
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.send(result.rows);

        });
    });
});


router.put('/:id', function(req, res){
    var id = req.params.id;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;

    pool.connect(function(err, client, done){
        try {
        if (err) {
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            return;
        }
        client.query('UPDATE owner SET firstName=$1, lastName=$2, WHERE id=$3 RETURNING *;',
            [firstName, lastName, id],
            function(err, result){
                if (err){
                    console.log('Error querying database', err);
                    res.sendStatus(500);
                } else {
                res.send(result.rows);
            }
        });

        } finally {
            done();
        }
    });
});

router.delete('/:id', function(req, res){
    var id = req.params.id;

    pool.connect(function(err, client, done){
        try{
            if (err){
                console.log('Error connecting to DB', err);
                res.sendStatus(500);
                return;
            }

            client.query('DELETE FROM owner WHERE id=$1',
            [id],
            function(err, result){
                if (err){
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                }

                res.sendStatus(204);
            });
        } finally {
            done();
        }
    });
});
module.exports = router;
