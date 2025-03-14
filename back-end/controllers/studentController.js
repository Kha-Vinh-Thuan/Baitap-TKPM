const fs = require('fs');
const path = require('path');
const studentModel = require('../models/studentModel');
const { Parser } = require('json2csv');
const csvParser = require('csv-parser');
const logger = require('../config/logger');

// Kiểm tra tính hợp lệ của email
function isEmailValid(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@clc\.fitus\.edu\.vn$/;
  return emailRegex.test(email);
}

// Kiểm tra tính hợp lệ của số điện thoại
function isPhoneValid(phone) {
  const phoneRegex = /^(0[3|5|7|8|9][0-9]{8}|(\+84)[3|5|7|8|9][0-9]{8})$/;
  return phoneRegex.test(phone);
}

// Kiểm tra dữ liệu sinh viên hợp lệ
function validateStudentData(student) {
  const emailValid = isEmailValid(student.email);
  const phoneValid = isPhoneValid(student.phone);
  return emailValid && phoneValid;
}

// Xử lý đọc và ghi dữ liệu sinh viên
function handleStudentData(callback) {
  return new Promise((resolve, reject) => {
    studentModel.readStudents((err, students) => {
      if (err) {
        reject('Không thể đọc dữ liệu sinh viên.');
      }
      resolve(students);
    });
  }).then(callback);
}

// Hàm ghi log lỗi
function logError(message) {
  logger.error(message);
  return res.status(400).json({ message });
}

// Tìm sinh viên theo khoa
function findStudentByFaculty(faculty, students) {
  return students.filter(s => s.faculty === faculty);
}

// Tìm sinh viên theo tên
function findStudentByName(name, students) {
  return students.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

// Xác thực dữ liệu nhập
function validateStudentData(student) {
  const emailValid = isEmailValid(student.email);
  const phoneValid = isPhoneValid(student.phone);
  return emailValid && phoneValid;
}

// Thêm sinh viên
async function addStudent(req, res) {
  const student = req.body;
  logger.info(`ADD_STUDENT_ATTEMPT: MSSV: ${student.mssv}`);

  if (!validateStudentData(student)) {
    logger.error('ERROR: Thông tin sinh viên không hợp lệ.');
    return res.status(400).json({ message: 'Thông tin sinh viên không hợp lệ.' });
  }

  try {
    const students = await handleStudentData((students) => students);
    if (students.find(s => s.mssv === student.mssv)) {
      logger.error(`ERROR: MSSV ${student.mssv} đã tồn tại.`);
      return res.status(400).json({ message: `MSSV ${student.mssv} đã tồn tại.` });
    }
    student.createdAt = new Date();
    students.push(student);
    await studentModel.writeStudents(students);
    logger.info(`ADD_STUDENT_SUCCESS: MSSV: ${student.mssv}`);
    res.status(200).json({ message: 'Sinh viên đã được thêm.' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
  }
}

// Xóa sinh viên
async function deleteStudent(req, res) {
  const mssv = req.params.mssv;
  logger.info(`DELETE_STUDENT_ATTEMPT: MSSV: ${mssv}`);

  try {
    const students = await handleStudentData((students) => students);
    const studentIndex = students.findIndex(s => s.mssv === mssv);

    if (studentIndex === -1) {
      logger.warn(`DELETE_STUDENT_FAIL: MSSV: ${mssv} không tồn tại.`);
      return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }

    const student = students[studentIndex];
    const now = new Date();
    const timeDiff = (now - new Date(student.createdAt)) / 1000 / 60;
    if (timeDiff > 30) {
      logger.warn(`DELETE_STUDENT_FAIL: MSSV: ${mssv} đã quá 30 phút, không thể xóa.`);
      return res.status(400).json({ message: 'Không thể xóa sinh viên sau 30 phút.' });
    }

    students.splice(studentIndex, 1); // Xóa sinh viên khỏi mảng
    await studentModel.writeStudents(students);
    logger.info(`DELETE_STUDENT_SUCCESS: MSSV: ${mssv}`);
    res.status(200).json({ message: 'Sinh viên đã được xóa.' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Không thể xóa sinh viên.' });
  }
}

// Cập nhật sinh viên
async function updateStudent(req, res) {
  const mssv = req.params.mssv;
  const updatedStudent = req.body;
  logger.info(`UPDATE_STUDENT_ATTEMPT: MSSV: ${mssv}`);

  if (updatedStudent.email && !isEmailValid(updatedStudent.email)) {
    logger.error(`ERROR: Email không hợp lệ: ${updatedStudent.email}`);
    return res.status(400).json({ message: 'Email phải thuộc tên miền @clc.fitus.edu.vn.' });
  }

  if (updatedStudent.phone && !isPhoneValid(updatedStudent.phone)) {
    logger.error(`ERROR: Số điện thoại không hợp lệ: ${updatedStudent.phone}`);
    return res.status(400).json({ message: 'Số điện thoại phải có định dạng hợp lệ theo quốc gia (Việt Nam).' });
  }

  try {
    const students = await handleStudentData((students) => students);
    const student = students.find(student => student.mssv === mssv);
    if (!student) {
      logger.warn(`UPDATE_STUDENT_FAIL: MSSV: ${mssv} không tồn tại.`);
      return res.status(404).json({ message: 'Sinh viên không tồn tại.' });
    }

    Object.assign(student, updatedStudent);
    await studentModel.writeStudents(students);
    logger.info(`UPDATE_STUDENT_SUCCESS: MSSV: ${mssv}`);
    res.status(200).json({ message: 'Thông tin sinh viên đã được cập nhật.' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Không thể lưu dữ liệu sau khi cập nhật.' });
  }
}

// Tìm kiếm sinh viên theo MSSV
async function searchStudent(req, res) {
  const query = req.query.query;
  logger.info(`SEARCH_STUDENT_ATTEMPT: Query: ${query}`);

  try {
    const students = await handleStudentData((students) => students);
    const result = students.filter(student => student.mssv.includes(query));
    logger.info(`SEARCH_STUDENT_RESULT: Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  } catch (error) {
    logError(error);
  }
}

// Tìm kiếm sinh viên theo khoa
async function searchStudentbyFaculty(req, res) {
  const query = req.query.query;
  logger.info(`SEARCH_STUDENT_BY_FACULTY_ATTEMPT: Query: ${query}`);

  try {
    const students = await handleStudentData((students) => students);
    const result = findStudentByFaculty(query, students);
    logger.info(`SEARCH_STUDENT_BY_FACULTY_RESULT: Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  } catch (error) {
    logger.error('ERROR: Không thể tìm sinh viên theo khoa.');
    res.status(500).json({ message: 'Không thể tìm sinh viên theo khoa.' });
  }
}

// Tìm kiếm nâng cao
async function advanceSearch(req, res) {
  const { faculty, name } = req.query;
  logger.info(`ADVANCE_SEARCH_ATTEMPT: Faculty: ${faculty || 'None'}, Name: ${name || 'None'}`);

  try {
    const students = await handleStudentData((students) => students);
    let result = students;

    if (faculty) result = findStudentByFaculty(faculty, result);
    if (name) result = findStudentByName(name, result);

    logger.info(`ADVANCE_SEARCH_RESULT: Tìm thấy ${result.length} sinh viên.`);
    res.json(result);
  } catch (error) {
    logger.error('ERROR: Không thể thực hiện tìm kiếm nâng cao.');
    res.status(500).json({ message: 'Không thể thực hiện tìm kiếm nâng cao.' });
  }
}

// Hàm xuất CSV
async function exportCSV(req, res) {
  logger.info('EXPORT_CSV_ATTEMPT: Bắt đầu xuất CSV.');

  try {
    const students = await handleStudentData((students) => students);
    const parser = new Parser();
    const csv = parser.parse(students);
    fs.writeFileSync('./students.csv', csv);
    logger.info('EXPORT_CSV_SUCCESS: Xuất CSV thành công.');
    res.download('./students.csv');
  } catch (error) {
    logger.error('ERROR: Lỗi khi xuất file CSV.');
    res.status(500).json({ message: 'Lỗi khi xuất file CSV.' });
  }
}

// Hàm import CSV
async function importCSV(req, res) {
  logger.info('IMPORT_CSV_ATTEMPT: Bắt đầu import CSV.');
  const students = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (row) => students.push(row))
    .on('end', async () => {
      try {
        await studentModel.writeStudents(students);
        logger.info('IMPORT_CSV_SUCCESS: Import CSV thành công.');
        res.status(200).json({ message: 'Import dữ liệu thành công.' });
      } catch (err) {
        logger.error('ERROR: Không thể lưu dữ liệu sau khi import CSV.');
        res.status(500).json({ message: 'Không thể lưu dữ liệu.' });
      }
    });
}

// Hàm xuất JSON
async function exportJSON(req, res) {
  logger.info('EXPORT_JSON_ATTEMPT: Bắt đầu xuất JSON.');

  try {
    const students = await handleStudentData((students) => students);
    fs.writeFileSync('./students_export.json', JSON.stringify(students, null, 2));
    logger.info('EXPORT_JSON_SUCCESS: Xuất JSON thành công.');
    res.download('./students_export.json');
  } catch (error) {
    logger.error('ERROR: Lỗi khi xuất file JSON.');
    res.status(500).json({ message: 'Lỗi khi xuất file JSON.' });
  }
}

// Hàm import JSON
async function importJSON(req, res) {
  logger.info('IMPORT_JSON_ATTEMPT: Bắt đầu import JSON.');

  try {
    const data = fs.readFileSync(req.file.path, 'utf8');
    const students = JSON.parse(data);
    await studentModel.writeStudents(students);
    logger.info('IMPORT_JSON_SUCCESS: Import JSON thành công.');
    res.status(200).json({ message: 'Import JSON thành công.' });
  } catch (error) {
    logger.error('ERROR: Dữ liệu JSON không hợp lệ hoặc không thể đọc file.');
    res.status(500).json({ message: 'Lỗi khi xử lý file JSON.' });
  }
}

// Hàm xóa khoa
async function deleteFaculty(req, res) {
  const facultyName = req.params.faculty;
  logger.info(`DELETE_FACULTY_ATTEMPT: Faculty: ${facultyName}`);

  try {
    const students = await handleStudentData((students) => students);
    const hasStudentsInFaculty = students.some(s => s.faculty === facultyName);

    if (hasStudentsInFaculty) {
      logger.warn(`DELETE_FACULTY_FAIL: Faculty: ${facultyName} có sinh viên liên quan.`);
      return res.status(400).json({ message: 'Không thể xóa khoa vì có sinh viên liên quan.' });
    }

    const updatedStudents = students.filter(s => s.faculty !== facultyName);
    await studentModel.writeStudents(updatedStudents);
    logger.info(`DELETE_FACULTY_SUCCESS: Faculty: ${facultyName}`);
    res.status(200).json({ message: 'Khoa đã được xóa.' });
  } catch (error) {
    logger.error('ERROR: Không thể xóa khoa.');
    res.status(500).json({ message: 'Không thể xóa khoa.' });
  }
}

// Xóa tình trạng
async function deleteStatus(req, res) {
  const statusName = req.params.status;
  logger.info(`DELETE_STATUS_ATTEMPT: Status: ${statusName}`);
  try {
    const students = await handleStudentData((students) => students);
    const hasStudentsWithStatus = students.some(s => s.status === statusName);

    if (hasStudentsWithStatus) {
      logger.warn(`DELETE_STATUS_FAIL: Status: ${statusName} có sinh viên liên quan.`);
      return res.status(400).json({ message: 'Không thể xóa tình trạng vì có sinh viên liên quan.' });
    }

    const updatedStudents = students.filter(s => s.status !== statusName);
    await studentModel.writeStudents(updatedStudents);
    logger.info(`DELETE_STATUS_SUCCESS: Status: ${statusName}`);
    res.status(200).json({ message: 'Tình trạng sinh viên đã được xóa.' });
  } catch (error) {
    logger.error('ERROR: Không thể xóa tình trạng.');
    res.status(500).json({ message: 'Không thể xóa tình trạng.' });
  }
}

// Xóa chương trình
async function deleteProgram(req, res) {
  const programName = req.params.program;
  logger.info(`DELETE_PROGRAM_ATTEMPT: Program: ${programName}`);

  try {
    const students = await handleStudentData((students) => students);
    const hasStudentsInProgram = students.some(s => s.program === programName);

    if (hasStudentsInProgram) {
      logger.warn(`DELETE_PROGRAM_FAIL: Program: ${programName} có sinh viên liên quan.`);
      return res.status(400).json({ message: 'Không thể xóa chương trình đào tạo vì có sinh viên liên quan.' });
    }

    const updatedStudents = students.filter(s => s.program !== programName);
    await studentModel.writeStudents(updatedStudents);
    logger.info(`DELETE_PROGRAM_SUCCESS: Program: ${programName}`);
    res.status(200).json({ message: 'Chương trình đào tạo đã được xóa.' });
  } catch (error) {
    logger.error('ERROR: Không thể xóa chương trình.');
    res.status(500).json({ message: 'Không thể xóa chương trình.' });
  }
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
  importJSON,
  deleteFaculty,
  deleteStatus,
  deleteProgram
};
