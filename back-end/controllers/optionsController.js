const fs = require('fs');
const path = './data.json'; 
const logger = require('../config/logger'); 

const getOptions = (req, res) => {
  logger.info('GET_OPTIONS_ATTEMPT: Đang đọc dữ liệu từ file.');
  fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    logger.error('ERROR: Không thể đọc dữ liệu.');
    console.log(err);
    return res.status(500).json({ message: 'Không thể đọc dữ liệu' });
  }
  logger.info('GET_OPTIONS_SUCCESS: Đọc dữ liệu thành công.');
  const options = JSON.parse(data);
  res.json(options);
  });
};

const addFaculty = (req, res) => {
  logger.info('ADD_FACULTY_ATTEMPT: Đang thêm khoa mới.');
  const { faculty } = req.body;
  if (!faculty) {
    logger.error('ERROR: Khoa không hợp lệ.');
    return res.status(400).json({ message: 'Khoa không hợp lệ' });
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Lỗi khi đọc dữ liệu.');
      return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu' });
    }
    const options = JSON.parse(data);
    options.faculties.push(faculty);

    fs.writeFile(path, JSON.stringify(options, null, 2), (err) => {
      if (err) {
        logger.error('ERROR: Lỗi khi lưu dữ liệu.');
        return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
      }
      logger.info('ADD_FACULTY_SUCCESS: Khoa đã được thêm thành công.');
      res.status(201).json({ message: 'Khoa đã được thêm thành công!' });
    });
  });
};
const addProgram = (req, res) => {
  logger.info('ADD_PROGRAM_ATTEMPT: Đang thêm chương trình mới.');
  const { program } = req.body;
  if (!program) {
    logger.error('ERROR: Chương trình không hợp lệ.');
    return res.status(400).json({ message: 'Chương trình không hợp lệ' });
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Lỗi khi đọc dữ liệu.');
      return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu' });
    }
    const options = JSON.parse(data);
    options.programs.push(program);

    fs.writeFile(path, JSON.stringify(options, null, 2), (err) => {
      if (err) {
        logger.error('ERROR: Lỗi khi lưu dữ liệu.');
        return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
      }
      logger.info('ADD_PROGRAM_SUCCESS: Chương trình đã được thêm thành công.');
      res.status(201).json({ message: 'Chương trình đã được thêm thành công!' });
    });
  });
};

const addStatus = (req, res) => {
  logger.info('ADD_STATUS_ATTEMPT: Đang thêm tình trạng mới.');
  const { status } = req.body;
  if (!status) {
    logger.error('ERROR: Tình trạng không hợp lệ.');
    return res.status(400).json({ message: 'Tình trạng không hợp lệ' });
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Lỗi khi đọc dữ liệu.');
      return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu' });
    }
    const options = JSON.parse(data);
    options.statuses.push(status);

    fs.writeFile(path, JSON.stringify(options, null, 2), (err) => {
      if (err) {
        logger.error('ERROR: Lỗi khi lưu dữ liệu.');
        return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
      }
      logger.info('ADD_STATUS_SUCCESS: Tình trạng đã được thêm thành công.');
      res.status(201).json({ message: 'Tình trạng đã được thêm thành công!' });
    });
  });
};

const renameFaculty = (req, res) => {
  const { oldFacultyName, newFacultyName } = req.body;
  console.log(oldFacultyName);
  console.log(newFacultyName);
  if (!oldFacultyName || !newFacultyName) {
    logger.error('ERROR: Tên khoa không hợp lệ.');
    return res.status(400).json({ message: 'Tên khoa không hợp lệ' });
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Lỗi khi đọc dữ liệu.');
      return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu' });
    }
    const options = JSON.parse(data);
    const facultyIndex = options.faculties.findIndex(faculty => faculty === oldFacultyName);
    console.log(facultyIndex);
    if (facultyIndex === -1) {
      logger.error('ERROR: Khoa không tìm thấy.');
      return res.status(404).json({ message: 'Khoa không tìm thấy' });
    }
    options.faculties[facultyIndex] = newFacultyName;

    fs.writeFile(path, JSON.stringify(options, null, 2), (err) => {
      if (err) {
        logger.error('ERROR: Lỗi khi lưu dữ liệu.');
        return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
      }
      logger.info(`RENAME_FACULTY_SUCCESS: Khoa ${oldFacultyName} đã được đổi tên thành ${newFacultyName}.`);
      res.status(200).json({ message: `Khoa ${oldFacultyName} đã được đổi tên thành ${newFacultyName}.` });
    });
  });
};

const renameProgram = (req, res) => {
  const { oldProgramName, newProgramName } = req.body;
  if (!oldProgramName || !newProgramName) {
    logger.error('ERROR: Tên chương trình không hợp lệ.');
    return res.status(400).json({ message: 'Tên chương trình không hợp lệ' });
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Lỗi khi đọc dữ liệu.');
      return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu' });
    }
    const options = JSON.parse(data);
    const programIndex = options.programs.findIndex(program => program === oldProgramName);
    if (programIndex === -1) {
      logger.error('ERROR: Chương trình không tìm thấy.');
      return res.status(404).json({ message: 'Chương trình không tìm thấy' });
    }
    options.programs[programIndex] = newProgramName;

    fs.writeFile(path, JSON.stringify(options, null, 2), (err) => {
      if (err) {
        logger.error('ERROR: Lỗi khi lưu dữ liệu.');
        return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
      }
      logger.info(`RENAME_PROGRAM_SUCCESS: Chương trình ${oldProgramName} đã được đổi tên thành ${newProgramName}.`);
      res.status(200).json({ message: `Chương trình ${oldProgramName} đã được đổi tên thành ${newProgramName}.` });
    });
  });
};

const renameStatus = (req, res) => {
  const { oldStatusName, newStatusName } = req.body;
  if (!oldStatusName || !newStatusName) {
    logger.error('ERROR: Tình trạng không hợp lệ.');
    return res.status(400).json({ message: 'Tình trạng không hợp lệ' });
  }

  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      logger.error('ERROR: Lỗi khi đọc dữ liệu.');
      return res.status(500).json({ message: 'Lỗi khi đọc dữ liệu' });
    }
    const options = JSON.parse(data);
    const statusIndex = options.statuses.findIndex(status => status === oldStatusName);
    if (statusIndex === -1) {
      logger.error('ERROR: Tình trạng không tìm thấy.');
      return res.status(404).json({ message: 'Tình trạng không tìm thấy' });
    }
    options.statuses[statusIndex] = newStatusName;

    fs.writeFile(path, JSON.stringify(options, null, 2), (err) => {
      if (err) {
        logger.error('ERROR: Lỗi khi lưu dữ liệu.');
        return res.status(500).json({ message: 'Lỗi khi lưu dữ liệu' });
      }
      logger.info(`RENAME_STATUS_SUCCESS: Tình trạng ${oldStatusName} đã được đổi tên thành ${newStatusName}.`);
      res.status(200).json({ message: `Tình trạng ${oldStatusName} đã được đổi tên thành ${newStatusName}.` });
    });
  });
};

module.exports = {
  getOptions,
  addFaculty,
  addProgram,
  addStatus,
  renameFaculty,
  renameProgram,
  renameStatus
};