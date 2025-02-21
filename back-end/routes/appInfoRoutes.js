const express = require('express');
const router = express.Router();
const packageInfo = require('../package.json'); 

router.get('/', (req, res) => {
  const appInfo = {
    version: packageInfo.version,
    buildDate: packageInfo.buildDate,
  };
  res.json(appInfo);
});

module.exports = router;