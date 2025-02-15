document.addEventListener('DOMContentLoaded', () => {
  // Thêm sinh viên
  document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentData = {
      mssv: document.getElementById('mssv').value,
      name: document.getElementById('name').value,
      dob: document.getElementById('dob').value,
      gender: document.getElementById('gender').value,
      faculty: document.getElementById('faculty').value,
      class: document.getElementById('class').value,
      program: document.getElementById('program').value,
      address: document.getElementById('address').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      status: document.getElementById('status').value
    };

    fetch('http://localhost:3000/api/students/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.log(error));
  });

  // Cập nhật sinh viên
  document.getElementById('fetchStudent').addEventListener('click', function() {
    const mssv = document.getElementById('updateMssv').value;

    fetch(`http://localhost:3000/api/students/searchStudent?query=${mssv}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const student = data[0];
          document.getElementById('updateName').value = student.name;
          document.getElementById('updateDob').value = student.dob;
          document.getElementById('updateGender').value = student.gender;
          document.getElementById('updateFaculty').value = student.faculty;
          document.getElementById('updateClass').value = student.class;
          document.getElementById('updateProgram').value = student.program;
          document.getElementById('updateAddress').value = student.address;
          document.getElementById('updateEmail').value = student.email;
          document.getElementById('updatePhone').value = student.phone;
          document.getElementById('updateStatus').value = student.status;

          document.getElementById('updateStudentForm').style.display = 'block';
        } else {
          alert('Sinh viên không tồn tại');
        }
      })
      .catch(error => console.log(error));
  });

  document.getElementById('updateStudentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const updatedStudent = {
      name: document.getElementById('updateName').value,
      dob: document.getElementById('updateDob').value,
      gender: document.getElementById('updateGender').value,
      faculty: document.getElementById('updateFaculty').value,
      class: document.getElementById('updateClass').value,
      program: document.getElementById('updateProgram').value,
      address: document.getElementById('updateAddress').value,
      email: document.getElementById('updateEmail').value,
      phone: document.getElementById('updatePhone').value,
      status: document.getElementById('updateStatus').value
    };

    const mssv = document.getElementById('updateMssv').value;

    fetch(`http://localhost:3000/api/students/updateStudent/${mssv}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedStudent)
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.log(error));
  });

  // Xóa sinh viên
  document.getElementById('deleteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const mssv = document.getElementById('deleteMssv').value;

    fetch(`http://localhost:3000/api/students/deleteStudent/${mssv}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.log(error));
  });

  // Tìm kiếm sinh viên
  document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const query = document.getElementById('searchMssv').value;

    fetch(`http://localhost:3000/api/students/searchStudent?query=${query}`)
      .then(response => response.json())
      .then(data => {
        const studentList = document.getElementById('studentList');
        studentList.innerHTML = ''; // Clear previous results
        if (data.length > 0) {
          data.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.textContent = `MSSV: ${student.mssv}, Họ tên: ${student.name}`;
            studentList.appendChild(studentItem);
          });
        } else {
          studentList.innerHTML = 'Không tìm thấy sinh viên.';
        }
      })
      .catch(error => console.log(error));
  });
});
