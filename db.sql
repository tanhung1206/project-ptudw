-- 1. Tạo bảng Manufactures
CREATE TABLE Manufactures (
    manufactureId SERIAL PRIMARY KEY,
    name VARCHAR(255),
    imagePath VARCHAR(255)
);

-- 2. Tạo bảng Categories
CREATE TABLE Categories (
    categoryId SERIAL PRIMARY KEY,
    name VARCHAR(255),
    imagePath VARCHAR(255)
);

-- 3. Tạo bảng Users
CREATE TABLE Users (
    userId SERIAL PRIMARY KEY,
    email VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    avatar VARCHAR(255),
    isAdmin BOOLEAN,
    createdAt DATE,
    isBan BOOLEAN
);

-- 4. Tạo bảng Products
CREATE TABLE Products (
    productId SERIAL PRIMARY KEY,
    name VARCHAR(255),
    imagePath VARCHAR(255),
    price INT,
    quantity INT,
    sold_quantity INT,
    summary TEXT,
    description TEXT,
    stars INT,
    createdAt DATE,
    categoryId INT REFERENCES Categories(categoryId),
    manufacturerId INT REFERENCES Manufactures(manufactureId),
    status VARCHAR(50)
);

-- 5. Tạo bảng Reviews
CREATE TABLE Reviews (
    reviewId SERIAL PRIMARY KEY,
    review TEXT,
    stars INT,
    createdAt DATE,
    productId INT REFERENCES Products(productId),
    userId INT REFERENCES Users(userId)
);

-- 6. Tạo bảng Images
CREATE TABLE Images (
    imageId SERIAL PRIMARY KEY,
    imagePath VARCHAR(255),
    productId INT REFERENCES Products(productId)
);

-- 7. Tạo bảng Orders
CREATE TABLE Orders (
    orderId SERIAL PRIMARY KEY,
    quantity INT,
    total INT,
    status INT,
    createdAt DATE,
    userId INT REFERENCES Users(userId)
);

-- 8. Tạo bảng OrderDetails
CREATE TABLE OrderDetails (
    orderDetailID SERIAL PRIMARY KEY,
    orderId INT REFERENCES Orders(orderId),
    productId INT REFERENCES Products(productId),
    quantity INT,
    createdAt DATE
);

-- 9. Tạo bảng CardProduct
CREATE TABLE CardProducts (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES Users(userId),
    productId INT REFERENCES Products(productId),
    quantity INT
);




INSERT INTO Categories (name, imagePath) 
VALUES
    ('Shoes', '/img/categories/Shoes.jpg'),
    ('Clothing', '/img/categories/Clothing.jpg'),
    ('Ball', '/img/categories/Ball.jpg'),
    ('Accessories', '/img/categories/Accessories.jpg')


INSERT INTO Manufactures (name, imagePath) 
VALUES
    ('Nike', '/images/manufactures/Nike.jpg'),
    ('Adidas', '/images/manufactures/Adidas.jpg'),
    ('Puma', '/images/manufactures/Puma.jpg');

INSERT INTO Products (name, imagePath, price, summary, description, stars, categoryId, manufacturerId)
VALUES 
('Product Name', '/img/products/image.jpg', 1000, 'This is a product summary', 'Detailed product description goes here', 5, 1, 1);


