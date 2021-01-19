const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const { MongoClient, ObjectId } = require('mongodb');
const { report } = require('process');
let db;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.put('/cupon', (req, res) => {
    const { code, date, isRedeem } = req.body;
    db.collection('cupons')
        .insertOne({ code, date, isRedeem })
        .then((report) => {
            res.status(201).send(report.ops[0]);
        })
        .catch((error) => {
            console.log(error);
            res.sendStatus(200);
        });
});

app.get('/cupon', (req, res) => {
    db.collection('cupons')
        .find()
        .toArray()
        .then(cupons => {
            res.send(cupons);
        });
});

app.get('/cupon/:id', (req, res) => {
    db.collection('cupons')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(cupon => {
            if (!cupon) {
                res.sendStatus(404);
                return;
            }
            res.send(cupon);
        })
});

app.delete('/cupon/:id', (req, res) => {
    db.collection('cupons')
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then((report) => {
            if (report.deletedCount === 0) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(204);
        })
});

app.post('/cupon/:id', (req, res) => {
    db.collection('cupons')
        .updateOne(
            { _id: ObjectId(req.params.id) },
            { $set: req.body }
        )
        .then((report) => {
            if (report.macthedCount === 0) {
                res.sendStatus(404);
                return;
            }
            res.sendStatus(200);
        })
});

app.post('/cupon/:id/redeem', (req, res) => {
    db.collection('cupons')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(cupon => {
            if (!cupon) {
                res.sendStatus(404);
                return;
            }
            if (cupon.isRedeem) {
                res.status(400).send('this cupons is has already been used!');
                return;
            }
            db.collection('cupons')
            .updateOne(
                { _id: ObjectId(req.params.id) },
                {
                    $set: {
                        isRedeem: true
                    }
                }
            )
                .then(() => {
                    res.status(200).send('get your gifts!')
                })
        })
})


const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
client.connect()
    .then(() => {
        db = client.db('cupon_api');
        console.log('connected to DB');
        app.listen(port, () => console.log(`server listening at port ${port}`));
    })
    .catch((error) => console.log('could not connect to mongodb', error));