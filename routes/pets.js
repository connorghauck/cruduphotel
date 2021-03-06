var router = require('express').Router();
var pg = require('pg');

var config = {
    database: 'rho'
};

var pool = new pg.Pool(config);

router.get('/:id', function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB 1get', err);
            res.sendStatus(500);
            done();
            return;
        }

        client.query('SELECT * FROM pets WHERE id = $1;', [req.params.id], function(err, result){
                done();
                if(err){
                    console.log('Error querying the DB 1query', err);
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

        client.query('SELECT * FROM owner LEFT JOIN pets ON owner.id = pets.owner_id;', function(err, result){
                done();
                if(err){
                    console.log('Error querying the DB 2query', err);
                    res.sendStatus(500);
                    return;
                }

                console.log('Got rows from the DB: ',result.rows);
                res.send(result.rows);

        });

    });
});


router.post('/', function(req, res){
    pool.connect(function(err, client, done){
        if (err){
            res.sendStatus(500);
            done();
            return;
        }
        client.query('INSERT INTO pets (owner_id, name, breed, color) VALUES ($1, $2, $3, $4) returning *;',
        [req.body.ownerId, req.body.petName, req.body.petBreed, req.body.petColor],
        function(err,result){
            done();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(result.rows);

        });
    });
});


router.put('/:id', function(req, res){
    var id = req.params.id;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var petName = req.body.petName;
    var petBreed = req.body.petBreed;
    var petColor = req.body.petColor;

    pool.connect(function(err, client, done){
        try {
        if (err) {
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            return;
        }


        client.query('UPDATE pets SET first_name=$1, last_name=$2, name=$3, breed=$4, color=$5 WHERE id=$6 RETURNING *;',
            [req.body.firstName, req.body.lastName, req.body.petName, req.body.petBreed, req.body.petColor, id],
            function(err, result){
                if (err){
                    console.log('Error querying database 3query', err);
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

            client.query('DELETE FROM pets WHERE id=$1',
            [id],
            function(err, result){
                if (err){
                    console.log('Error querying the DB 4query', err);
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
