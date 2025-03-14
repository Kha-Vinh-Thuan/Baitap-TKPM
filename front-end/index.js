document.addEventListener('DOMContentLoaded', () => {
  fetchVersionInfo();

function fetchOptions() {
  fetch('http://localhost:3000/api/options/takeOptions')
    .then(response => response.json())
    .then(data => {
      populateSelect('faculty', data.faculties);
      populateSelect('program', data.programs);
      populateSelect('status', data.statuses);
      populateSelect('updateFaculty', data.faculties);
      populateSelect('updateProgram', data.programs);
      populateSelect('updateStatus', data.statuses);
      populateSelect('oldFacultyName', data.faculties);
      populateSelect('oldProgramName', data.programs);
      populateSelect('oldStatusName', data.statuses);
      populateSelect('deleteFacultySelect', data.faculties);
      populateSelect('deleteProgramSelect', data.programs);
      populateSelect('deleteStatusSelect', data.statuses);
    })
    .catch(error => console.log('Error fetching options:', error));
}

function populateSelect(selectId, options) {
  const selectElement = document.getElementById(selectId);
  selectElement.innerHTML = '';  

  const defaultOption = document.createElement('option');
  defaultOption.value = '';

  defaultOption.textContent = `Chọn ${getSelectLabel(selectId)}`;
  selectElement.appendChild(defaultOption);

  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option; 
    selectElement.appendChild(optionElement);
  });
}

function getSelectLabel(selectId) {
  switch (selectId) {
    case 'faculty':
      return 'Khoa';
    case 'program':
      return 'Chương trình đào tạo';
    case 'status':
      return 'Tình trạng';
    case 'updateFaculty':
      return 'Khoa';
    case 'updateProgram':
      return 'Chương trình đào tạo';
    case 'updateStatus':
      return 'Tình trạng';
    case 'oldFacultyName':
      return 'Khoa';
    case 'oldProgramName':
      return 'Chương trình đào tạo';
    case 'oldStatusName':
      return 'Tình trạng';    
    case 'deleteFacultySelect':
      return 'Khoa';
    case 'deleteStatusSelect':
      return 'Tình trạng';
    case 'deleteProgramSelect':
      return 'Chương trình';  
    default:
      return 'Lựa chọn';
  }
}

fetchOptions();

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

  document.getElementById('addFacultyBtn').addEventListener('click', function() {
    const facultyName = document.getElementById('newFaculty').value; 

    if (facultyName) {
      fetch('http://localhost:3000/api/options/addFaculty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ faculty: facultyName })  
      })
      .then(response => response.json())  
      .then(data => {
        alert(data.message); 
        document.getElementById('newFaculty').value = ''; 
      })
      .catch(error => {
        console.error('Error adding faculty:', error);
        alert('Không thể thêm Khoa!');
      });
    } else {
      alert('Vui lòng nhập tên khoa');
    }
  });

  document.getElementById('addProgramBtn').addEventListener('click', function() {
    const programName = document.getElementById('newProgram').value; 

    if (programName) {
      fetch('http://localhost:3000/api/options/addProgram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ program: programName })  
      })
      .then(response => response.json())  
      .then(data => {
        alert(data.message); 
        document.getElementById('newProgram').value = ''; 
      })
      .catch(error => {
        console.error('Error adding program:', error);
        alert('Không thể thêm chương trình!');
      });
    } else {
      alert('Vui lòng nhập tên chương trình');
    }
  });

  document.getElementById('addStatusBtn').addEventListener('click', function() {
    const statusName = document.getElementById('newStatus').value; 

    if (statusName) {
      fetch('http://localhost:3000/api/options/addStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ status: statusName })  
      })
      .then(response => response.json())  
      .then(data => {
        alert(data.message); 
        document.getElementById('newStatus').value = ''; 
      })
      .catch(error => {
        console.error('Error adding status:', error);
        alert('Không thể thêm Chương trình!');
      });
    } else {
      alert('Vui lòng nhập tên Chương trình');
    }
  });

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

  document.getElementById('renameFacultyBtn').addEventListener('click', function() {
    const oldFacultyName = document.getElementById('oldFacultyName').value; 
    const newFacultyName = document.getElementById('newFacultyName').value;
  
    if (oldFacultyName && newFacultyName) {
      fetch('http://localhost:3000/api/options/renameFaculty', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ oldFacultyName, newFacultyName })  
      })
      .then(response => response.json())  
      .then(data => {
        alert(data.message); 
        document.getElementById('oldFacultyName').value = ''; 
        document.getElementById('newFacultyName').value = ''; 
      })
      .catch(error => {
        console.error('Error renaming faculty:', error);
        alert('Không thể đổi tên khoa!');
      });
    } else {
      alert('Vui lòng nhập tên khoa cũ và tên khoa mới');
    }
  });

  document.getElementById('renameProgramBtn').addEventListener('click', function() {
    const oldProgramName = document.getElementById('oldProgramName').value; 
    const newProgramName = document.getElementById('newProgramName').value;
  
    if (oldProgramName && newProgramName) {
      fetch('http://localhost:3000/api/options/renameProgram', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ oldProgramName, newProgramName })  
      })
      .then(response => response.json())  
      .then(data => {
        alert(data.message); 
        document.getElementById('oldProgramName').value = ''; 
        document.getElementById('newProgramName').value = ''; 
      })
      .catch(error => {
        console.error('Error renaming program:', error);
        alert('Không thể đổi tên chương trình!');
      });
    } else {
      alert('Vui lòng nhập tên chương trình cũ và tên chương trình mới');
    }
  });
  
  // Lắng nghe sự kiện đổi tên tình trạng
  document.getElementById('renameStatusBtn').addEventListener('click', function() {
    const oldStatusName = document.getElementById('oldStatusName').value; 
    const newStatusName = document.getElementById('newStatusName').value;
  
    if (oldStatusName && newStatusName) {
      fetch('http://localhost:3000/api/options/renameStatus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ oldStatusName, newStatusName })  
      })
      .then(response => response.json())  
      .then(data => {
        alert(data.message); 
        document.getElementById('oldStatusName').value = ''; 
        document.getElementById('newStatusName').value = ''; 
      })
      .catch(error => {
        console.error('Error renaming status:', error);
        alert('Không thể đổi tên tình trạng!');
      });
    } else {
      alert('Vui lòng nhập tên tình trạng cũ và tên tình trạng mới');
    }
  });
  
  //Cập nhật sinh viên
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

          // Xử lý dropdown trạng thái
          const statusDropdown = document.getElementById('updateStatus');
          statusDropdown.innerHTML = '';

          const validStatuses = ["Đang học", "Đã thôi học", "Đã tốt nghiệp", "Tạm dừng học"];
          let currentStatus = student.status;

          statusDropdown.value = currentStatus;

          // Tạo danh sách option phù hợp
          const allowedStatuses = {
              "Đang học": ["Đang học", "Đã thôi học", "Đã tốt nghiệp", "Tạm dừng học"],
              "Tạm dừng học": ["Tạm dừng học", "Đang học"],
              "Đã thôi học": ["Đã thôi học"],
              "Đã tốt nghiệp": ["Đã tốt nghiệp"]
          };

          allowedStatuses[currentStatus].forEach(status => {
              const option = document.createElement("option");
              option.value = status;
              option.textContent = status;
              statusDropdown.appendChild(option);
          });

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

document.getElementById('searchFormFaculty').addEventListener('submit', function(event) {
  event.preventDefault();

  const query = document.getElementById('searchFaculty').value;

  fetch(`http://localhost:3000/api/students/searchStudentbyFaculty?query=${query}`)
      .then(response => response.json())
      .then(data => {
          const studentList = document.getElementById('studentListFaculty');
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

async function fetchVersionInfo() {
  try {
    const response = await fetch('http://localhost:3000/api/app-info'); // Thay URL bằng endpoint thực tế của bạn
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin phiên bản');
    }

    const data = await response.json();
    document.getElementById('version').textContent = `Version: ${data.version}`;
    document.getElementById('buildDate').textContent = `Build Date: ${data.buildDate}`;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin phiên bản:', error);
    document.getElementById('version').textContent = 'Version: Không xác định';
    document.getElementById('buildDate').textContent = 'Build Date: Không xác định';
  }
}

async function fetchStudentData() {
  try {
    const mssv = document.getElementById('mssv1').value.trim();
    if (!mssv) {
      alert('Vui lòng nhập MSSV');
      return null;
    }

    const response = await fetch(`http://localhost:3000/api/students/searchStudent?query=${mssv}`);
    if (!response.ok) {
      throw new Error('Không thể lấy dữ liệu sinh viên');
    }
    const data = await response.json();

    if (data && data.length > 0) {
      return data[0]; 
    } else {
      alert('Không tìm thấy sinh viên');
      return null;
    }
  } catch (error) {
    alert('Lỗi khi lấy thông tin sinh viên');
    return null;
  }
}

const exportToHTML = (student, filename = "student.html") => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="vi">
  <head>
    <meta charset="UTF-8">
    <title>Giấy Xác Nhận</title>
  </head>
  <body>
    <h2 style="text-align: center;">TRƯỜNG ĐẠI HỌC Khoa học Tự nhiên</h2>
    <h3 style="text-align: center;">PHÒNG ĐÀO TẠO</h3>
    <p><strong>Địa chỉ:</strong> 227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP Hồ Chí Minh</p>
    <p><strong>Điện thoại:</strong> (028) 62884499 | <strong>Email:</strong> info@hcmus.edu.vn</p>
    <h2 style="text-align: center;">GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN</h2>
    <p><strong>1. Thông tin sinh viên:</strong></p>
    <p>- Họ và tên: ${student.name}</p>
    <p>- Mã số sinh viên: ${student.mssv}</p>
    <p>- Ngày sinh: ${student.dob}</p>
    <p>- Giới tính: ${student.gender === "male" ? "Nam" : "Nữ"}</p>
    <p>- Khoa: ${student.faculty}</p>
    <p>- Chương trình đào tạo: ${student.program}</p>
    <p>- Khóa: K-${student.class}</p>
    <p><strong>2. Tình trạng sinh viên hiện tại:</strong></p>
    <p>- ${student.status}</p>
    <p><strong>📍 Xác nhận của Trường Đại học</strong></p>
    <p>📅 Ngày cấp: ${new Date().toLocaleDateString("vi-VN")}</p>
    <p style="text-align: right;">🖋 Trưởng Phòng Đào Tạo</p>
    <p style="text-align: right;">(Ký, ghi rõ họ tên, đóng dấu)</p>
  </body>
  </html>
  `;
  const blob = new Blob([htmlContent], { type: "text/html" });
  saveAs(blob, filename);
};

const exportToMarkdown = (student, filename = "student.md") => {
  const mdContent = `
# TRƯỜNG ĐẠI HỌC Khoa học Tự nhiên
## PHÒNG ĐÀO TẠO
📍 Địa chỉ: 227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP Hồ Chí Minh
📞 Điện thoại: (028) 62884499 | 📧 Email: info@hcmus.edu.vn

## GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN

**1. Thông tin sinh viên:**
- Họ và tên: ${student.name}
- Mã số sinh viên: ${student.mssv}
- Ngày sinh: ${student.dob}
- Giới tính: ${student.gender === "male" ? "Nam" : "Nữ"}
- Khoa: ${student.faculty}
- Chương trình đào tạo: ${student.program}
- Khóa: K-${student.class}

**2. Tình trạng sinh viên hiện tại:**
- ${student.status}

📍 **Xác nhận của Trường Đại học**
📅 Ngày cấp: ${new Date().toLocaleDateString("vi-VN")}

🖋 **Trưởng Phòng Đào Tạo**  
(Ký, ghi rõ họ tên, đóng dấu)
  `;
  const blob = new Blob([mdContent], { type: "text/markdown" });
  saveAs(blob, filename);
};

async function generateExport(exportType) {
  const student = await fetchStudentData(); 
  if (!student) return; 

  if (exportType === 'HTML') {
    exportToHTML(student);
  } else if (exportType === 'Markdown') {
    exportToMarkdown(student);
  }
}

function generateHTML() {
  generateExport('HTML');
}

function generateMarkdown() {
  generateExport('Markdown');
}