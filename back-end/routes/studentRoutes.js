const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer');
const logger = require('../config/logger.js');
const upload = multer({ dest: 'uploads/' });

// Middleware log request
const logRequest = (req, res, next) => {
  const { method, originalUrl } = req;
  const logMessage = `${method} ${originalUrl}`;
  logger.info(logMessage); 
  next();
};

// Thêm middleware log vào các route
router.post('/addStudent', logRequest, studentController.addStudent);
router.delete('/deleteStudent/:mssv', logRequest, studentController.deleteStudent);
router.put('/updateStudent/:mssv', logRequest, studentController.updateStudent);
router.get('/searchStudent', logRequest, studentController.searchStudent);
router.get('/searchStudentbyFaculty', logRequest, studentController.searchStudentbyFaculty);
router.get('/advanceSearch', logRequest, studentController.advanceSearch);

// Export dữ liệu sinh viên
router.get('/export/csv', logRequest, studentController.exportCSV);
router.get('/export/json', logRequest, studentController.exportJSON);

// Import dữ liệu sinh viên
router.post('/import/csv', upload.single('file'), logRequest, studentController.importCSV);
router.post('/import/json', upload.single('file'), logRequest, studentController.importJSON);

module.exports = router;
