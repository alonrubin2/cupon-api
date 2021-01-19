const { MongoClient, ObjectId } = require('mongodb');
let db;


class Cupons {

    static createCupon(req, res) {
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
    }

    static getAllCupons(req, res) {
        db.collection('cupons')
            .find()
            .toArray()
            .then(cupons => {
                res.send(cupons);
            });
    }

    static getSingleCupon(req, res) {
        db.collection('cupons')
            .findOne({ _id: ObjectId(req.params.id) })
            .then(cupon => {
                if (!cupon) {
                    res.sendStatus(404);
                    return;
                }
                res.send(cupon);
            })
    }

    static deleteCupon(req, res) {
        db.collection('cupons')
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((report) => {
                if (report.deletedCount === 0) {
                    res.sendStatus(404);
                    return;
                }
                res.sendStatus(204);
            })
    }

    static editCupon(req, res) {
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
    }

    static redeemCupon(req, res) {
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
    }
}

module.exports = Cupons;