import { saveAs } from "file-saver";

// Xuất HTML
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

// Xuất MD
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

export { exportToHTML, exportToMarkdown };
