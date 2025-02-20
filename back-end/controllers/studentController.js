const fs = require('fs');
const path = require('path');
const studentModel = require('../models/studentModel');
const { Parser } = require('json2csv');
const csvParser = require('csv-parser');

const logFilePath = path.join(__dirname, '../logs.txt');

/*function logAction(action, details) {
  const logEntry = `[${new Date().toISOString()}] ${action}: ${details}\n`;
  fs.appendFileSync(logFilePath, logEntry);
}*/

function addStudent(req, res) {
  const student = req.body;
  //logAction('ADD_STUDENT_ATTEMPT', `MSSV: ${student.mssv}`);
  
  if (!validateStudent(student)) {
    //logAction('ERROR', 'Thông tin sinh viên không hợp lệ.');
    return res.status(400).json({ message: 'Thông tin sinh viên không hợp lệ.' });
  }

  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    students.push(student);
    studentModel.writeStudents(students, (err) => {
      if (err) {
        //logAction('ERROR', 'Không thể lưu dữ liệu.');
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      //logAction('ADD_STUDENT_SUCCESS', `MSSV: ${student.mssv}`);
      res.status(200).json({ message: 'Sinh viên đã được thêm.' });
    });
  });
}

function deleteStudent(req, res) {
  const mssv = req.params.mssv;
  //logAction('DELETE_STUDENT_ATTEMPT', `MSSV: ${mssv}`);
  console.log('1');
  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const newStudents = students.filter(student => student.mssv !== mssv);
    if (newStudents.length === students.length) {
      //logAction('DELETE_STUDENT_FAIL', `MSSV: ${mssv} không tồn tại.`);
      return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }

    studentModel.writeStudents(newStudents, (err) => {
      if (err) {
        //logAction('ERROR', 'Không thể lưu dữ liệu sau khi xóa.');
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      //logAction('DELETE_STUDENT_SUCCESS', `MSSV: ${mssv}`);
      res.status(200).json({ message: 'Sinh viên đã được xóa.' });
    });
  });
}

function updateStudent(req, res) {
  const mssv = req.params.mssv;
  const updatedStudent = req.body;
  //logAction('UPDATE_STUDENT_ATTEMPT', `MSSV: ${mssv}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    let student = students.find(student => student.mssv === mssv);
    if (!student) {
      //logAction('UPDATE_STUDENT_FAIL', `MSSV: ${mssv} không tồn tại.`);
      return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }

    Object.assign(student, updatedStudent);
    studentModel.writeStudents(students, (err) => {
      if (err) {
        //logAction('ERROR', 'Không thể lưu dữ liệu sau khi cập nhật.');
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      //logAction('UPDATE_STUDENT_SUCCESS', `MSSV: ${mssv}`);
      res.status(200).json({ message: 'Thông tin sinh viên đã được cập nhật.' });
    });
  });
}

function searchStudent(req, res) {
  const query = req.query.query;
  //logAction('SEARCH_STUDENT_ATTEMPT', `Query: ${query}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const result = students.filter(student =>
      student.mssv.includes(query) || student.name.includes(query)
    );
    //logAction('SEARCH_STUDENT_RESULT', `Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  });
}

function advanceSearch(req, res) {
  const { faculty, name } = req.query;
  //logAction('ADVANCE_SEARCH_ATTEMPT', `Faculty: ${faculty || 'None'}, Name: ${name || 'None'}`);

  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    let result = students;
    if (faculty) result = result.filter(student => student.faculty.toLowerCase() === faculty.toLowerCase());
    if (name) result = result.filter(student => student.name.toLowerCase().includes(name.toLowerCase()));

    //logAction('ADVANCE_SEARCH_RESULT', `Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  });
}

function exportCSV(req, res) {
  //logAction('EXPORT_CSV_ATTEMPT', 'Bắt đầu xuất CSV.');

  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    try {
      const parser = new Parser();
      const csv = parser.parse(students);
      fs.writeFileSync('./students.csv', csv);
      //logAction('EXPORT_CSV_SUCCESS', 'Xuất CSV thành công.');
      res.download('./students.csv');
    } catch (error) {
      //logAction('ERROR', 'Lỗi khi xuất file CSV.');
      res.status(500).json({ message: 'Lỗi khi xuất file CSV.' });
    }
  });
}

function importCSV(req, res) {
  //logAction('IMPORT_CSV_ATTEMPT', 'Bắt đầu import CSV.');
  const students = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (row) => students.push(row))
    .on('end', () => {
      studentModel.writeStudents(students, (err) => {
        if (err) {
          //logAction('ERROR', 'Không thể lưu dữ liệu sau khi import CSV.');
          return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
        }
        //logAction('IMPORT_CSV_SUCCESS', 'Import CSV thành công.');
        res.status(200).json({ message: 'Import dữ liệu thành công.' });
      });
    });
}
function exportJSON(req, res) {
  //logAction('EXPORT_JSON_ATTEMPT', 'Bắt đầu xuất JSON.');
  studentModel.readStudents((err, students) => {
    if (err) {
      //logAction('ERROR', 'Không thể đọc dữ liệu sinh viên.');
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }
      fs.writeFileSync('./students_export.json', JSON.stringify(students, null, 2));
      //logAction('EXPORT_JSON_SUCCESS', 'Xuất JSON thành công.');
    res.download('./students_export.json');
  });
}

function importJSON(req, res) {
  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Không thể đọc file JSON.' });
    try {
      const students = JSON.parse(data);
      studentModel.writeStudents(students, (err) => {
        if (err) {
          //logAction('ERROR', 'Không thể lưu dữ liệu sau khi import JSON.');
          return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
        }
        //logAction('IMPORT_JSON_SUCCESS', 'Import JSON thành công.');
        res.status(200).json({ message: 'Import JSON thành công.' });
      });
    } catch (error) {
      //logAction('ERROR', 'Dữ liệu JSON không hợp lệ.');
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
  advanceSearch,
  exportCSV,
  importCSV,
  exportJSON,
  importJSON

};
