const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/addStudent', studentController.addStudent);
router.delete('/deleteStudent/:mssv', studentController.deleteStudent);
router.put('/updateStudent/:mssv', studentController.updateStudent);
router.get('/searchStudent', studentController.searchStudent);

module.exports = router;
