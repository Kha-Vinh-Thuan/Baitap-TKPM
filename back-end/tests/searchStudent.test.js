// /tests/searchStudent.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const studentController = require('../controllers/studentController.js');
const studentModel = require('../models/studentModel.js');
const logger = require('../config/logger.js');

describe('searchStudent Controller', () => {
  let req, res, loggerSpy, studentModelReadSpy;

  beforeEach(() => {
    req = {
      query: {
        query: '22127408',
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    loggerSpy = sinon.spy(logger, 'info');
    studentModelReadSpy = sinon.stub(studentModel, 'readStudents');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 500 if there is an error reading students', () => {
    studentModelReadSpy.yields(new Error('Error'), null);

    studentController.searchStudent(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: 'Không thể đọc dữ liệu sinh viên.' })).to.be.true;
  });

  it('should return 200 with search results', () => {
    const mockStudents = [
      { 
        mssv: '22127408'
      },
    ];
    
    studentModelReadSpy.yields(null, mockStudents);
  
    studentController.searchStudent(req, res);

    expect(res.json.calledWith([{
      mssv: '22127408'
    }])).to.be.true;  
    expect(loggerSpy.calledWith('SEARCH_STUDENT_RESULT: Tìm thấy 1 sinh viên.')).to.be.true;
  });
  

  it('should return 200 with no results found', () => {
  
    studentController.searchStudent(req, res);

    expect(res.json.calledWith([{
      mssv: '22127411'
    }])).to.be.false;  
    expect(loggerSpy.calledWith('SEARCH_STUDENT_RESULT: Tìm thấy 1 sinh viên.')).to.be.false;
  });
});

