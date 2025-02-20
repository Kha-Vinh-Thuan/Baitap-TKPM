const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
//const logger = require("./config/logger");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static('front-end'));
app.use('/api/students', studentRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
  //logger.info(`The server is running on port: ${PORT}`);
});
