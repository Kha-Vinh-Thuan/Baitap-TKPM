const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('front-end'));

app.use('/api/students', studentRoutes);

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
