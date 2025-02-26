const { expect } = require('chai');
const sinon = require('sinon');
const studentController = require('../controllers/studentController.js'); 
const studentModel = require('../models/studentModel.js');
const logger = require('../config/logger.js');

describe('addStudent Controller', () => {
  let req, res, loggerSpy, studentModelReadSpy, studentModelWriteSpy, validateStudentSpy;

  beforeEach(() => {
    req = {
      body: {
        mssv: "21578152", 
        name: "Lâm Tiến Quy",
        dob: "2004-07-15",
        gender: "Nam",
        faculty: "Khoa Thương mại",
        class: "2021",
        program: "Kỹ sư",
        address: "Phú Yên",
        email: "fitus17458@clc.fitus.edu.vn",  
        phone: "0978452968", 
        status: "Đã thôi học"
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    loggerSpy = sinon.spy(logger, 'info');
    studentModelReadSpy = sinon.stub(studentModel, 'readStudents');
    studentModelWriteSpy = sinon.stub(studentModel, 'writeStudents');
    validateStudentSpy = sinon.stub().returns(true);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 500 if there is an error reading students', () => {
    studentModelReadSpy.yields(new Error('Error'), null);
  
    studentController.addStudent(req, res);
  
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: 'Không thể đọc dữ liệu sinh viên.' })).to.be.true;
  });

  it('should return 400 if email is not valid', () => {
    req.body.email = 'khavinhthuan114@gmail.com';

    studentController.addStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Email phải thuộc tên miền @clc.fitus.edu.vn.' })).to.be.true;
  });

  it('should return 400 if phone number is not valid', () => {
    req.body.phone = '0498675231'; 

    studentController.addStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Số điện thoại phải có định dạng hợp lệ theo quốc gia (Việt Nam).' })).to.be.true;
  });

  it('should return 400 if student MSSV already exists', () => {
    studentModelReadSpy.yields(null, [{ mssv: '21578152' }]); 

    studentController.addStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'MSSV 21578152 đã tồn tại.' })).to.be.true;
  });

  it('should return 500 if there is an error reading students', () => {
    studentModelReadSpy.yields(new Error('Error'), null);

    studentController.addStudent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: 'Không thể đọc dữ liệu sinh viên.' })).to.be.true;
  });

  it('should return 500 if there is an error writing students', () => {
    studentModelReadSpy.yields(null, []);  
    studentModelWriteSpy.yields(new Error('Error')); 

    studentController.addStudent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: 'Không thể lưu dữ liệu.' })).to.be.true;
  });

  it('should successfully add a student', () => {
    studentModelReadSpy.yields(null, []); 
    studentModelWriteSpy.yields(null); 

    studentController.addStudent(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Sinh viên đã được thêm.' })).to.be.true;
    expect(loggerSpy.calledWith('ADD_STUDENT_SUCCESS: MSSV: 21578152')).to.be.true;
  });
});
