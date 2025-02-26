const { expect } = require('chai');
const sinon = require('sinon');
const studentController = require('../controllers/studentController.js');
const studentModel = require('../models/studentModel.js');
const logger = require('../config/logger.js');

describe('updateStudent Controller', () => {
  let req, res, loggerSpy, studentModelReadSpy, studentModelWriteSpy;

  beforeEach(() => {
    req = {
      params: {
        mssv: '22127408',
      },
      body: {
        name: 'Kha Vĩnh Thuận',
        dob: '2004-12-17',
        gender: 'Nam',
        faculty: 'Khoa Luật',
        class: '2022',
        program: 'Cử nhân',
        address: 'Thành phố Hồ Chí Minh',
        email: 'khavinhthuan114@clc.fitus.edu.vn',
        phone: '0978541469',
        status: 'Đã tốt nghiệp'
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    loggerSpy = sinon.spy(logger, 'info');
    studentModelReadSpy = sinon.stub(studentModel, 'readStudents');
    studentModelWriteSpy = sinon.stub(studentModel, 'writeStudents');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 if student is updated successfully', () => {
    const mockStudent = {
      mssv: '22127408',
      name: 'Kha Vĩnh Thuận',
      dob: '2004-12-17',
      gender: 'Nam',
      faculty: 'Khoa Luật',
      class: '2022',
      program: 'Cử nhân',
      address: 'Thành phố Hồ Chí Minh',
      email: 'khavinhthuan114@clc.fitus.edu.vn',
      phone: '0978541469',
      status: 'Đã tốt nghiệp'
    };

    studentModelReadSpy.yields(null, [mockStudent]); 
    studentModelWriteSpy.yields(null);

    studentController.updateStudent(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Thông tin sinh viên đã được cập nhật.' })).to.be.true;
    expect(loggerSpy.calledWith('UPDATE_STUDENT_SUCCESS: MSSV: 22127408')).to.be.true;
  });

  it('should return 404 if student not found', () => {
    req.body.email = 'validemail@clc.fitus.edu.vn';
    req.body.phone = '0987654321';

    studentModelReadSpy.yields(null, [{ mssv: '22127409' }]);

    studentController.updateStudent(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });

  it('should return 400 if email is invalid', () => {
    req.body.email = 'khavinhthuan114@gmail.com'; 

    studentController.updateStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Email phải thuộc tên miền @clc.fitus.edu.vn.' })).to.be.true;
  });

  it('should return 400 if phone is invalid', () => {

    req.body.phone = '0444754145';

    studentController.updateStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('should return 500 if there is an error reading students', () => {
    req.body.email = 'validemail@clc.fitus.edu.vn';
    req.body.phone = '0987654321';

    studentModelReadSpy.yields(new Error('Database Error'), null);

    studentController.updateStudent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });

  it('should return 500 if there is an error saving students', () => {
    req.body.email = 'validemail@clc.fitus.edu.vn';
    req.body.phone = '0987654321';

    studentModelReadSpy.yields(null, [{ mssv: '22127408', name: 'Kha Vĩnh Thuận' }]);
    studentModelWriteSpy.yields(new Error('Database Write Error')); 

    studentController.updateStudent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });
});
