const fs = require('fs');
const filePath = './students.json';

function readStudents(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Không thể đọc file dữ liệu sinh viên:', err);
      callback(err, null);
    } else {
      const students = JSON.parse(data);
      callback(null, students);
    }
  });
}

function writeStudents(students, callback) {
  fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
    callback(err);
  });
}

module.exports = {
  readStudents,
  writeStudents
};