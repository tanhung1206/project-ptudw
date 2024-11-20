const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envFilePath = path.join(__dirname, '.env');

// Hàm cập nhật hoặc thêm biến môi trường
const updateEnv = (key, value, envData) => {
    const regex = new RegExp(`^\\s*${key}=.*`, 'm'); // Tìm dòng chứa key
    const newEntry = `\n${key}=${value}\n`;
    if (regex.test(envData)) {
        // Nếu key đã tồn tại, thay thế giá trị
        return envData.replace(regex, newEntry);
    } else {
        // Nếu key chưa tồn tại, thêm mới với dòng trống
        return envData + `${newEntry}`;
    }
};

// Kiểm tra xem file .env đã tồn tại chưa
let envData = '';
if (fs.existsSync(envFilePath)) {
    envData = fs.readFileSync(envFilePath, 'utf8');
    console.log('.env file already exists. Updating SESSION_SECRET...');
} else {
    console.log('Creating new .env file...');
}

// Tạo SESSION_SECRET ngẫu nhiên
const sessionSecret = crypto.randomBytes(64).toString('hex');

// Cập nhật hoặc thêm SESSION_SECRET
envData = updateEnv('SESSION_SECRET', sessionSecret, envData.trim());

// Ghi lại dữ liệu vào file .env
fs.writeFileSync(envFilePath, envData);
console.log('.env file updated successfully');
