# Hướng dẫn chạy ứng dụng ở local

### Bước 1: Tạo Database
1. Mở pgAdmin và kết nối với PostgreSQL server.
2. Tạo một database mới với tên `shop`.
### Bước 2: Chạy lệnh SQL
1. Chạy lệnh trong file `db.sql` để tạo bảng và dữ liệu trong database `shop`.
### Bước 3: Cấu hình kết nối PostgreSQL
1. Mở file `db/db.js`.
2. Cập nhật cấu hình kết nối PostgreSQL:  
  const pool = new Pool({  
      user:   
      host:   
      database:   
      password:   
      port:   
  });  
### Bước 4: Cài đặt thư viện:
- npm i
### Bước 5: Run:
- npm start
