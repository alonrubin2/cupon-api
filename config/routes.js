const express = require('express');
const routes = express.Router();
const Cupons = require('../controllers/cupons');


routes.put('/cupon', Cupons.createCupon);

routes.get('/cupon', Cupons.getAllCupons);

routes.get('/cupon/:id', Cupons.getSingleCupon);

routes.delete('/cupon/:id', Cupons.deleteCupon);

routes.post('/cupon/:id', Cupons.editCupon);

routes.post('/cupon/:id/redeem', Cupons.redeemCupon);



module.exports = routes;
