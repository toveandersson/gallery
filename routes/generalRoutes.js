const express = require('express');
const router = express.Router();
const controllers = require('../controllers/generalControllers');

router.post('/update-stock', controllers.updateStock);
router.post('/check-stock-item', controllers.checkStockItem);
router.post('/check-stock', controllers.checkStock);
router.get('/posters/:posterID', controllers.getPoster);
router.get('/getAllPosters', controllers.getAllPosters);
router.get('/getPosterWithId/:id', controllers.getPosterWithId);
router.get('/:folderName', (req, res, next) => {
  if (req.params.folderName.includes('.')) return next(); // let static handler deal with it
  controllers.serveFolders(req, res, next);
});


module.exports = router;
