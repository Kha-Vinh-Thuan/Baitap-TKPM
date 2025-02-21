const express = require('express');
const router = express.Router();
const optionsController = require('../controllers/optionsController');
const logger = require('../config/logger.js');

// Middleware log request
const logRequest = (req, res, next) => {
  const { method, originalUrl } = req;
  const logMessage = `${method} ${originalUrl}`;
  logger.info(logMessage); 
  next();
};

router.get('/takeOptions', logRequest, optionsController.getOptions);
router.post('/addFaculty', logRequest, optionsController.addFaculty);
router.post('/addProgram', logRequest, optionsController.addProgram);
router.post('/addStatus', logRequest, optionsController.addStatus);

router.put('/renameFaculty', logRequest, optionsController.renameFaculty);
router.put('/renameProgram', logRequest, optionsController.renameProgram);
router.put('/renameStatus', logRequest, optionsController.renameStatus);
module.exports = router;
