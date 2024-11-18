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
('ULTRABOOST 1.0 SHOES', '/img/products/product1.jpg', 180, 'From a walk in the park to a weekend run with friends, these adidas Ultraboost 1.0 shoes are designed to keep you comfortable. An adidas PRIMEKNIT upper gently hugs your feet while BOOST on the midsole cushions from the first step to the last mile. The Stretchweb outsole flexes naturally for an energized ride, and Continental™ Rubber gives you the traction you need to keep that pep in your step.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">adidas PRIMEKNIT textile upper</li><li class="list-group-item px-0">Fitcounter molded heel counter</li><li class="list-group-item px-0">BOOST midsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Stretchweb outsole with Continental™ Rubber</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Core Black / Beam Green</li><li class="list-group-item px-0">Product code: HQ4199</li></ul></div></div>
', 5, 1, 2),
('ULTRABOOST 1.0 SHOES', '/img/products/product2.jpg', 180, 'From a walk in the park to a weekend run with friends, these adidas Ultraboost 1.0 shoes are designed to keep you comfortable. An adidas PRIMEKNIT upper gently hugs your feet while BOOST on the midsole cushions from the first step to the last mile. The Stretchweb outsole flexes naturally for an energized ride, and Continental™ Rubber gives you the traction you need to keep that pep in your step.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">adidas PRIMEKNIT textile upper</li><li class="list-group-item px-0">Fitcounter molded heel counter</li><li class="list-group-item px-0">BOOST midsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Stretchweb outsole with Continental™ Rubber</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Core Black / Beam Green</li><li class="list-group-item px-0">Product code: HQ4199</li></ul></div></div>
', 5, 1, 2),
('VL Court 3.0 Shoes', '/img/products/product3.jpg', 70, 'These adidas sneakers are all clean lines and a smooth coated leather upper atop a skater-style vulcanized outsole. Wear yours with crop pants or a floaty skirt. Either way, you''ll want to show off every angle. Lightweight cushioning and a soft lining keep the foot wrapped in comfort right through the day.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Coated leather upper</li><li class="list-group-item px-0">Textile lining</li><li class="list-group-item px-0">Cushioned midsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Vulcanized rubber outsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Clear Pink / Legend Ink / Gum</li><li class="list-group-item px-0">Product code: JP7629</li></ul></div></div>
', 4, 1, 2),
('Gazelle Indoor Shoes', '/img/products/product4.jpg', 120, 'Originally designed as an indoor training shoe, the adidas Gazelle shoes have become a timeless staple. These iconic shoes are crafted for everyday wear, with a premium soft suede upper and muted colors that pair effortlessly with your wardrobe. Whether you''re running errands or meeting friends, this retro-inspired design pays homage to adidas heritage while adding a luxe look and feel to your outfit.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Suede upper</li><li class="list-group-item px-0">Leather lining</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Gum rubber cupsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Shadow Fig / Cloud White / Gum</li><li class="list-group-item px-0">Product code: IH5483</li></ul></div></div>
', 4, 1, 2),
('Gazelle Indoor Shoes', '/img/products/product5.jpg', 120, 'Originally designed as an indoor training shoe, the adidas Gazelle shoes have become a timeless staple. These iconic shoes are crafted for everyday wear, with a premium soft suede upper and muted colors that pair effortlessly with your wardrobe. Whether you''re running errands or meeting friends, this retro-inspired design pays homage to adidas heritage while adding a luxe look and feel to your outfit.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Suede upper</li><li class="list-group-item px-0">Leather lining</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Gum rubber cupsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Shadow Fig / Cloud White / Gum</li><li class="list-group-item px-0">Product code: IH5483</li></ul></div></div>
', 4, 1, 2),
('Harden Volume 8 Shoes', '/img/products/product6.jpg', 160, 'Changing the game isn''t enough for a superstar like James Harden, he has to revolutionize it. The latest Signature shoes from adidas Basketball and James Harden continues to celebrate one of basketball''s elite scorers and elite personalities. Rocking a combined adidas BOOST and Lightstrike midsole, these performance basketball shoes provide the support you need to dominate each and every time you step on the floor.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Textile upper</li><li class="list-group-item px-0">Textile lining</li><li class="list-group-item px-0">BOOST midsole with Lightstrike cushioning</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Rubber outsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Feather Grey / Ivory / Core Black</li><li class="list-group-item px-0">Product code: IG6649</li></ul></div></div>
', 5, 1, 2),
('Adilette Comfort Slides', '/img/products/product7.jpg', 35, 'Whether you''re heading to the locker room after an intense gym session or at home recovering on the couch, these slides keep your feet wrapped in lightweight comfort. Pair them with socks and shorts for your post-workout look or with your favorite swimwear for the ultimate beach vibe. The adidas 3-Stripes design completes your sport style.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Slip-on construction</li><li class="list-group-item px-0">Synthetic upper</li><li class="list-group-item px-0">Textile lining</li><li class="list-group-item px-0">Lightweight cushioning</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Contoured footbed</li><li class="list-group-item px-0">EVA outsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Core Black / Core Black</li><li class="list-group-item px-0">Product code: GZ5896</li></ul></div></div>
', 5, 1, 2),
('Samba OG Shoes', '/img/products/product8.jpg', 100, 'Born on the pitch, the Samba is a timeless icon of street style. This silhouette stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole, making it a staple in everyone''s closet - on and off the pitch.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Full grain leather upper with gritty suede and gold foil details</li><li class="list-group-item px-0">Synthetic leather lining; Gum rubber cupsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Gum rubber midsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Cloud White / Gum</li><li class="list-group-item px-0">Product code: B75807</li></ul></div></div>
', 3, 1, 2)

