# Version 1.0
Prerequisites
Before running this application, ensure that you have the following installed:

Node.js (Download from nodejs.org)
Visual Studio Code (VSCode) with the Live Server extension installed

*Download the Project Files*
You need to download both the front-end and back-end folders. The project directory structure should look like this:
- back-end
  - controllers
    - studentController.js
  - models
    - studentModel.js
  - routes
    - studentRoutes.js
  - server.js
  - students.json (optional)
- front-end
  - index.css
  - index.html
  - index.js

*Set Up the Backend*
- Open Visual Studio Code (VSCode).
- Open a terminal in VSCode and navigate to the back-end folder: *cd path/to/back-end*
- Install the required dependencies: *npm i express body-parser cors fs*
- Start the backend server: *node server.js*


*Set Up the Frontend*
- Navigate to the front-end folder.
- Right-click on index.html and select Open with Live Server.

# Version 2.0
Introduction
This is Version 2.0 of the Student Management Application, upgraded from Version 1.0 with improved scalability and additional features.
New Features in Version 2.0
1. Upgraded Data Storage System
  Version 1.0: Student data was stored locally in JSON.
  Version 2.0: Now supports Cloud Storage, providing greater flexibility for deployment.

2. Student Information Update
  Version 2.0: Enables add and update faculty, program, status.

3. Enhanced Search System
  Version 1.0: Supported searching by Student ID only.
  Version 2.0: Added Advanced Search with three options:
    Search by Student ID.
    Search by Department.
    Search by Department + Student Name.

4. Import/Export Data Support
  Version 2.0 allows:
    Importing data from CSV and JSON files.
    Exporting data to CSV and JSON formats.
    Imported files will be stored in the /uploads folder.

5. Added Logging Mechanism
  Version 2.0 integrates winston to log system activities, aiding debugging and monitoring.

6. Display Application Version and Build Date
  Version 2.0 introduces an API to check the application version and build date.

*Download the Project Files*
You need to download both the front-end and back-end folders. The project directory structure should look like 
- back-end
  - config
    - logger.js
  - controllers
    - studentController.js
  - logs (optional)
    - app.log
    - error.log
  - models
    - studentModel.js
  - routes
    - appInfoRoutes.js
    - studentRoutes.js
  - server.js
  - students.json (optional)
- front-end
  - index.css
  - index.html
  - index.js

*Set Up the Backend*
  To support new features, install the following additional dependencies: *npm i csv-parser json2csv multer winston*

*Frontend*
Similar version 1.0

# Version 3.0
Set up similar version 2.0
Version 3 only updates business rules for IDStudent, phone number, email, status.

# Version 3.0.1
- In version 3.0.1, there will be more unit tests. To be able to run unit tests, you need to download the tests folder to the same level as folders such as controller, routes, models and download additional packages such as chai, mocha, sinon.
- Move to the back-end with the command: 
  + *cd back-end*
- Then download the necessary packages for version 3.0.1: 
  + *npm i chai mocha sinon*
- In this version will test the 3 most important functions addStudent, searchStudent and updateStudent
- Check those 3 functions with 3 corresponding commands:
  + *npm mocha tests/searchStudent.test.js*
  + *npm mocha tests/addStudent.test.js*
  + *npm mocha tests/updateStudent.test.js*