const fs = require('fs');
const path = require('path');
const studentModel = require('../models/studentModel');
const { Parser } = require('json2csv');
const csvParser = require('csv-parser');
const logger = require('../config/logger'); 

function addStudent(req, res) {
  const student = req.body;
  logger.info(`ADD_STUDENT_ATTEMPT: MSSV: ${student.mssv}`);

  if (!validateStudent(student)) {
    logger.error('ERROR: Thông tin sinh viên không hợp lệ.');
    return res.status(400).json({ message: 'Thông tin sinh viên không hợp lệ.' });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@clc\.fitus\.edu\.vn$/;
  if (!emailRegex.test(student.email)) {
    logger.error(`ERROR: Email không hợp lệ: ${student.email}`);
    return res.status(400).json({ message: 'Email phải thuộc tên miền @clc.fitus.edu.vn.' });
  }

  const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
  if (!phoneRegex.test(student.phone)) {
    logger.error(`ERROR: Số điện thoại không hợp lệ: ${student.phone}`);
    return res.status(400).json({ message: 'Số điện thoại phải có định dạng hợp lệ theo quốc gia (Việt Nam).' });
  }

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const existingStudent = students.find(s => s.mssv === student.mssv);
    if (existingStudent) {
      logger.error(`ERROR: MSSV ${student.mssv} đã tồn tại.`);
      return res.status(400).json({ message: `MSSV ${student.mssv} đã tồn tại.` });
    }

    students.push(student);
    studentModel.writeStudents(students, (err) => {
      if (err) {
        logger.error('ERROR: Không thể lưu dữ liệu.');
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      logger.info(`ADD_STUDENT_SUCCESS: MSSV: ${student.mssv}`);
      res.status(200).json({ message: 'Sinh viên đã được thêm.' });
    });
  });
}

function deleteStudent(req, res) {
  const mssv = req.params.mssv;
  logger.info(`DELETE_STUDENT_ATTEMPT: MSSV: ${mssv}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const newStudents = students.filter(student => student.mssv !== mssv);
    if (newStudents.length === students.length) {
      logger.warn(`DELETE_STUDENT_FAIL: MSSV: ${mssv} không tồn tại.`);
      return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }

    studentModel.writeStudents(newStudents, (err) => {
      if (err) {
        logger.error('ERROR: Không thể lưu dữ liệu sau khi xóa.');
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      logger.info(`DELETE_STUDENT_SUCCESS: MSSV: ${mssv}`);
      res.status(200).json({ message: 'Sinh viên đã được xóa.' });
    });
  });
}

function updateStudent(req, res) {
  const mssv = req.params.mssv;
  const updatedStudent = req.body;
  logger.info(`UPDATE_STUDENT_ATTEMPT: MSSV: ${mssv}`);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@clc\.fitus\.edu\.vn$/;
  if (updatedStudent.email && !emailRegex.test(updatedStudent.email)) {
    logger.error(`ERROR: Email không hợp lệ: ${updatedStudent.email}`);
    return res.status(400).json({ message: 'Email phải thuộc tên miền @clc.fitus.edu.vn.' });
  }

  const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
  if (updatedStudent.phone && !phoneRegex.test(updatedStudent.phone)) {
    logger.error(`ERROR: Số điện thoại không hợp lệ: ${updatedStudent.phone}`);
    return res.status(400).json({ message: 'Số điện thoại phải có định dạng hợp lệ theo quốc gia (Việt Nam).' });
  }

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    let student = students.find(student => student.mssv === mssv);
    if (!student) {
      logger.warn(`UPDATE_STUDENT_FAIL: MSSV: ${mssv} không tồn tại.`);
      return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }

    Object.assign(student, updatedStudent);
    studentModel.writeStudents(students, (err) => {
      if (err) {
        logger.error('ERROR: Không thể lưu dữ liệu sau khi cập nhật.');
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      logger.info(`UPDATE_STUDENT_SUCCESS: MSSV: ${mssv}`);
      res.status(200).json({ message: 'Thông tin sinh viên đã được cập nhật.' });
    });
  });
}



function searchStudent(req, res) {
  const query = req.query.query;
  logger.info(`SEARCH_STUDENT_ATTEMPT: Query: ${query}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const result = students.filter(student =>
      student.mssv.includes(query)
    );
    logger.info(`SEARCH_STUDENT_RESULT: Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  });
}

function searchStudentbyFaculty(req, res) {
  const query = req.query.query;
  logger.info(`SEARCH_STUDENT_ATTEMPT: Query: ${query}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const result = students.filter(student =>
      student.faculty.includes(query) 
    );

    logger.info(`SEARCH_STUDENT_RESULT: Tìm thấy ${result.length} sinh viên.`);
    res.json(result); 
  });
}

function advanceSearch(req, res) {
  const { faculty, name } = req.query;
  logger.info(`ADVANCE_SEARCH_ATTEMPT: Faculty: ${faculty || 'None'}, Name: ${name || 'None'}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    let result = students;
    if (faculty) result = result.filter(student => student.faculty.toLowerCase() === faculty.toLowerCase());
    if (name) result = result.filter(student => student.name.toLowerCase().includes(name.toLowerCase()));

    logger.info(`ADVANCE_SEARCH_RESULT: Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  });
}

function exportCSV(req, res) {
  logger.info('EXPORT_CSV_ATTEMPT: Bắt đầu xuất CSV.');

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    try {
      const parser = new Parser();
      const csv = parser.parse(students);
      fs.writeFileSync('./students.csv', csv);
      logger.info('EXPORT_CSV_SUCCESS: Xuất CSV thành công.');
      res.download('./students.csv');
    } catch (error) {
      logger.error('ERROR: Lỗi khi xuất file CSV.');
      res.status(500).json({ message: 'Lỗi khi xuất file CSV.' });
    }
  });
}

function importCSV(req, res) {
  logger.info('IMPORT_CSV_ATTEMPT: Bắt đầu import CSV.');
  const students = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (row) => students.push(row))
    .on('end', () => {
      studentModel.writeStudents(students, (err) => {
        if (err) {
          logger.error('ERROR: Không thể lưu dữ liệu sau khi import CSV.');
          return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
        }
        logger.info('IMPORT_CSV_SUCCESS: Import CSV thành công.');
        res.status(200).json({ message: 'Import dữ liệu thành công.' });
      });
    });
}

function exportJSON(req, res) {
  logger.info('EXPORT_JSON_ATTEMPT: Bắt đầu xuất JSON.');

  studentModel.readStudents((err, students) => {
    if (err) {
      logger.error('ERROR: Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    fs.writeFileSync('./students_export.json', JSON.stringify(students, null, 2));
    logger.info('EXPORT_JSON_SUCCESS: Xuất JSON thành công.');
    res.download('./students_export.json');
  });
}

function importJSON(req, res) {
  logger.info('IMPORT_JSON_ATTEMPT: Bắt đầu import JSON.');

  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Không thể đọc file JSON.');
      return res.status(500).json({ message: 'Không thể đọc file JSON.' });
    }
    try {
      const students = JSON.parse(data);
      studentModel.writeStudents(students, (err) => {
        if (err) {
          logger.error('ERROR: Không thể lưu dữ liệu sau khi import JSON.');
          return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
        }
        logger.info('IMPORT_JSON_SUCCESS: Import JSON thành công.');
        res.status(200).json({ message: 'Import JSON thành công.' });
      });
    } catch (error) {
      logger.error('ERROR: Dữ liệu JSON không hợp lệ.');
      res.status(400).json({ message: 'Dữ liệu JSON không hợp lệ.' });
    }
  });
}


function validateStudent(student) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const phonePattern = /^[0-9]{10,11}$/;
  return emailPattern.test(student.email) && phonePattern.test(student.phone);
}

module.exports = {
  addStudent,
  deleteStudent,
  updateStudent,
  searchStudent,
  searchStudentbyFaculty,
  advanceSearch,
  exportCSV,
  importCSV,
  exportJSON,
  importJSON

};
