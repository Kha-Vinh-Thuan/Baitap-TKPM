const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const filePath = './students.json';

function readStudents(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error(`ERROR: Không thể đọc file dữ liệu sinh viên: ${err}`);
      callback(err, null);
    } else {
      const students = JSON.parse(data);
      logger.info(`READ_STUDENTS_SUCCESS: Đọc thành công ${students.length} sinh viên.`);
      callback(null, students);
    }
  });
}

function writeStudents(students, callback) {
  fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
    if (err) {
      logger.error(`ERROR: Không thể lưu dữ liệu sinh viên: ${err}`);
      callback(err);
    } else {
      logger.info(`WRITE_STUDENTS_SUCCESS: Đã lưu ${students.length} sinh viên.`);
      callback(null);
    }
  });
}

module.exports = {
  readStudents,
  writeStudents
};