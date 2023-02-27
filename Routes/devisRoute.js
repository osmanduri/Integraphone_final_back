const router = require('express').Router()
const devisController = require('../Controllers/devisController')

router.post('/new', devisController.new)

module.exports = router