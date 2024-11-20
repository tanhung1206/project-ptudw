# Hướng dẫn chạy ứng dụng ở local

### Bước 1: Tạo Database

1. Mở pgAdmin và kết nối với PostgreSQL server.
2. Tạo một database mới với tên `shop`.

### Bước 2: Chạy lệnh SQL

1. Chạy lệnh trong file `db.sql` để tạo bảng và dữ liệu trong database `shop`.

### Bước 3: Set up .env

1. Cập nhật cấu hình kết nối PostgreSQL:  
    **Example**:
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=shop
   DB_PASSWORD=your password
   DB_PORT=5432
2. Chạy lệnh "node setupEnv.js" để cập nhật SESSION_SECRET

### Bước 4: Cài đặt thư viện:

- npm i

### Bước 5: Run:

- npm start
