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