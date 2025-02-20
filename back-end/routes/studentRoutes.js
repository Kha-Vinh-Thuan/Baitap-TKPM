const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Lưu file tạm vào thư mục uploads/

router.post('/addStudent', studentController.addStudent);
router.delete('/deleteStudent/:mssv', studentController.deleteStudent);
router.put('/updateStudent/:mssv', studentController.updateStudent);
router.get('/searchStudent', studentController.searchStudent);
router.get('/advanceSearch', studentController.advanceSearch);

// Export dữ liệu sinh viên
router.get('/export/csv', studentController.exportCSV);
router.get('/export/json', studentController.exportJSON);

// Import dữ liệu sinh viên
router.post('/import/csv', upload.single('file'), studentController.importCSV);
router.post('/import/json', upload.single('file'), studentController.importJSON);

module.exports = router;
