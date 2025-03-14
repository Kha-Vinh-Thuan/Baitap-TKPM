const express = require('express');
const router = express.Router();
const packageInfo = require('../package.json'); 
const logger = require('../config/logger.js');

// Middleware log request
const logRequest = (req, res, next) => {
  const { method, originalUrl } = req;
  const logMessage = `${method} ${originalUrl}`;
  logger.info(`REQUEST_RECEIVED: ${logMessage}`); 
  next();
};

router.get('/', logRequest, (req, res) => {
  logger.info('GET_APP_INFO_ATTEMPT: Đang lấy thông tin ứng dụng.');
  
  const appInfo = {
    version: packageInfo.version,
    buildDate: packageInfo.buildDate,
  };

  logger.info('GET_APP_INFO_SUCCESS: Thông tin ứng dụng đã được trả về.');
  console.log(appInfo);
  res.json(appInfo);
});

module.exports = router;
