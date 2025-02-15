const studentModel = require('../models/studentModel');

function addStudent(req, res) {
  const student = req.body;

  if (!validateStudent(student)) {
    return res.status(400).json({ message: 'Thông tin sinh viên không hợp lệ.' });
  }

  studentModel.readStudents((err, students) => {
    if (err) {
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    students.push(student);

    studentModel.writeStudents(students, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      res.status(200).json({ message: 'Sinh viên đã được thêm.' });
    });
  });
}

function deleteStudent(req, res) {
  const mssv = req.params.mssv;

  studentModel.readStudents((err, students) => {
    if (err) {
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    students = students.filter(student => student.mssv !== mssv);

    studentModel.writeStudents(students, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
      res.status(200).json({ message: 'Sinh viên đã được xóa.' });
    });
  });
}

function updateStudent(req, res) {
  const mssv = req.params.mssv;
  const updatedStudent = req.body;

  studentModel.readStudents((err, students) => {
    if (err) {
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    let student = students.find(student => student.mssv === mssv);

    if (student) {
      Object.assign(student, updatedStudent);

      studentModel.writeStudents(students, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
        }
        res.status(200).json({ message: 'Thông tin sinh viên đã được cập nhật.' });
      });
    } else {
      res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }
  });
}

function searchStudent(req, res) {
  const query = req.query.query;

  studentModel.readStudents((err, students) => {
    if (err) {
      return res.status(500).json({ message: 'Không thể đọc dữ liệu sinh viên.' });
    }

    const result = students.filter(student =>
      student.mssv.includes(query) || student.name.includes(query)
    );
    res.json(result);
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
  searchStudent
};
