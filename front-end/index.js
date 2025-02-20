document.addEventListener('DOMContentLoaded', () => {
  function initializeYearSelect(selectId) {
    const select = document.getElementById(selectId);
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 7;
    const endYear = currentYear;    

    select.innerHTML = '<option value="">Chọn Khóa</option>';
    
    for (let year = startYear; year <= endYear; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      select.appendChild(option);
    }
  }

  initializeYearSelect('class');
  initializeYearSelect('updateClass');

  // Tự động cập nhật năm hàng ngày
  setInterval(() => {
    const currentYear = new Date().getFullYear();
    const selects = [document.getElementById('class'), document.getElementById('updateClass')].filter(el => el);

    
    selects.forEach(select => {
      const lastYear = parseInt(select.lastElementChild?.value || currentYear);
      if (currentYear > lastYear) {
        for (let year = lastYear + 1; year <= currentYear + 5; year++) {
          const option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          select.appendChild(option);
        }
      }
    });
  }, 86400000);
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
            studentList.innerHTML = '';

            if (data.length > 0) {
                data.forEach(student => {
                    const info = `
                         -----------------------------
                        Tên: ${student.name}
                        MSSV: ${student.mssv}
                        Ngày sinh: ${student.dob}
                        Giới tính: ${student.gender}
                        Khoa: ${student.faculty}
                        Khóa: ${student.class}
                        Chương trình: ${student.program}
                        Địa chỉ: ${student.address}
                        Email: ${student.email}
                        Điện thoại: ${student.phone}
                        Tình trạng: ${student.status}
                        -----------------------------
                    `;
                    studentList.innerText += info + '\n';
                });
            } else {
                studentList.innerText = "Không tìm thấy sinh viên phù hợp.";
            }
        })
        .catch(error => console.log(error));
});
document.getElementById('advanceSearchForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const searchParams = {
    faculty: document.getElementById('searchFaculty').value,
    name: document.getElementById('searchName').value.trim()
  };

  const params = new URLSearchParams();
  if (searchParams.faculty) params.append('faculty', searchParams.faculty);
  if (searchParams.name) params.append('name', searchParams.name);

  fetch(`http://localhost:3000/api/students/advanceSearch?${params.toString()}`)
    .then(response => response.json())
    .then(data => {
      const studentList = document.getElementById('studentListAd');
      studentList.innerHTML = '';
      
      if (data.length > 0) {
        data.forEach(student => {
          const studentItem = document.createElement('div');
          studentItem.className = 'student-item';
          studentItem.innerHTML = `
            <p><strong>MSSV:</strong> ${student.mssv}</p>
            <p><strong>Họ tên:</strong> ${student.name}</p>
            <p><strong>Khoa:</strong> ${student.faculty}</p>
            <p><strong>Khóa:</strong> ${student.class}</p>
            <p><strong>Trạng thái:</strong> ${student.status}</p>
            <hr>
          `;
          studentList.appendChild(studentItem);
        });
      } else {
        studentList.innerHTML = '<p class="no-result">Không tìm thấy sinh viên phù hợp</p>';
      }
    })
    .catch(error => console.log(error));
});
});

document.getElementById('exportCsvBtn').addEventListener('click', function() {
  window.location.href = 'http://localhost:3000/api/students/export/csv';
});

document.getElementById('exportJsonBtn').addEventListener('click', function() {
  window.location.href = 'http://localhost:3000/api/students/export/json';
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('importCsvForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    const fileInput = document.getElementById('csvFile');
    
    if (!fileInput || !fileInput.files.length) {
      alert('Vui lòng chọn file CSV!');
      return;
    }
    
    formData.append('file', fileInput.files[0]);

    fetch('http://localhost:3000/api/students/import/csv', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.log(error));
  });
});

document.getElementById('importJsonForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const formData = new FormData();
  const fileInput = document.getElementById('jsonFile');
  
  if (!fileInput.files.length) {
    alert('Vui lòng chọn file JSON!');
    return;
  }

  formData.append('file', fileInput.files[0]);

  fetch('http://localhost:3000/api/students/import/json', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => alert(data.message))
  .catch(error => console.log(error));
});