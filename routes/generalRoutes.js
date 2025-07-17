const express = require('express');
const router = express.Router();
const controllers = require('../controllers/generalControllers');

router.post('/update-stock', controllers.updateStock);
router.post('/check-stock-item', controllers.checkStockItem);
router.post('/check-stock', controllers.checkStock);
router.post('/add-mail', controllers.addMailToList);
router.get('/update-stock', controllers.updateStock);
router.get('/posters/:posterID', controllers.getPoster);
router.get('/api/builds', controllers.getBuilds);
// router.get('/api/game-tags', controllers.getGameTags);
//router.get('portfolio/')
router.get('/get-all-products/:type?', controllers.getAllProductsWithType);    //byt ut ena stället till getAllProducts
router.get('/get-product/:id/:type?', controllers.getProductWithIdAndType);    //inte baserat på poster, byt till product?
// router.get('/:folderName', (req, res, next) => {
//   if (req.params.folderName.includes('.')) return next(); // let static handler deal with it
//   controllers.serveFolders(req, res, next);
// });


module.exports = router;
