const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

const filePath = './students.json';

function readStudents(callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback phải là một hàm');
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      logger.error(`ERROR: Không thể đọc file dữ liệu sinh viên: ${err}`);
      return callback(err, null);
    }

    try {
      const students = JSON.parse(data);
      logger.info(`READ_STUDENTS_SUCCESS: Đọc thành công ${students.length} sinh viên.`);
      callback(null, students);
    } catch (parseError) {
      logger.error(`ERROR: Lỗi khi phân tích dữ liệu JSON: ${parseError}`);
      callback(parseError, null);
    }
  });
}

function writeStudents(students, callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback phải là một hàm');
  }

  if (!Array.isArray(students)) {
    const error = new Error('Dữ liệu phải là mảng sinh viên.');
    logger.error(`ERROR: ${error.message}`);
    return callback(error);
  }

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