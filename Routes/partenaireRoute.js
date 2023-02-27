const router = require('express').Router();
const partenaireController = require('../Controllers/devenirPartenaireController');

router.post('/new', partenaireController.new)

module.exports = router