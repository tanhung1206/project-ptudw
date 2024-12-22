# Hướng dẫn chạy ứng dụng

## I. Cấu hình .env

1. Cập nhật cấu hình kết nối PostgreSQL, ví dụ:
   ```bash
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=shop
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```
2. Để cập nhật `SESSION_SECRET`, chạy lệnh:

   ```
   node setupEnv.js
   ```

## II. Tạo database

1. Tải và cài đặt Docker từ [trang chủ Docker](https://www.docker.com/get-started).

2. Khởi động Docker và đảm bảo Docker đang chạy.

3. Chạy các lệnh sau để khởi động các dịch vụ và seed dữ liệu:

   ```bash
   docker-compose up -d # Khởi động các dịch vụ trong chế độ nền
   node seed.js # Seed dữ liệu vào database
   ```

   Lưu ý: Sử dụng lệnh `docker-compose down` khi muốn dừng và xóa container của Docker.

## III. Chạy ứng dụng

1. Chạy lệnh sau để cài đặt các thư viện cần thiết:

   ```
   npm install
   ```

2. Chạy lệnh sau để khởi động ứng dụng:

   ```
   npm start
   ```
