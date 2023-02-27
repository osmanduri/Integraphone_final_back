const router = require('express').Router();
const invoiceController = require('../Controllers/invoiceController');
const verify = require('./utils/verifyToken');

router.get('/', verify.verifyAdmin, invoiceController.getAllInvoices);
router.get('/users/:id', verify.verifyUser, invoiceController.getInvoiceByUser);
router.get('/date/:date', verify.verifyUser, invoiceController.getInvoiceByDate);
router.get('/filter/date/:month_id', verify.verifyUser, invoiceController.getFilterPerMonth);
router.delete('/all/:userId', verify.verifyAdmin, invoiceController.deleteAllInvoiceUser); // delete all invoice & contract of User


module.exports = router