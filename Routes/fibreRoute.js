const router = require('express').Router();
const fibreController = require('../Controllers/fibreController');

router.post('/new', fibreController.devisNew_user)
router.post('/new_admin', fibreController.devisNew_admin)
router.get('/price/ftth', fibreController.getPriceFtth)
router.get('/price/ftto', fibreController.getPriceFtto)
router.get('/price/ftte', fibreController.getPriceFtte)

module.exports = router;