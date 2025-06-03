const express = require('express');
const router = express.Router();
const controllers = require('../controllers/generalControllers');

router.post('/update-stock', controllers.updateStock);
router.post('/check-stock-item', controllers.checkStockItem);
router.post('/check-stock', controllers.checkStock);
router.get('/update-stock', controllers.updateStock);
router.get('/posters/:posterID', controllers.getPoster);
router.get('/get-all-products/:type?', controllers.getAllProductsWithType);    //byt ut ena stället till getAllProducts
router.get('/get-product/:id/:type?', controllers.getProductWithIdAndType);    //inte baserat på poster, byt till product?
router.get('/get-price-info', controllers.getPriceInfo);
// router.get('/:folderName', (req, res, next) => {
//   if (req.params.folderName.includes('.')) return next(); // let static handler deal with it
//   controllers.serveFolders(req, res, next);
// });


module.exports = router;
