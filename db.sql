DROP TABLE IF EXISTS CartProducts CASCADE;
DROP TABLE IF EXISTS OrderDetails CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;
DROP TABLE IF EXISTS Images CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Addresses CASCADE;
DROP TABLE IF EXISTS Products CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Manufacturers CASCADE;

-- Tạo bảng Manufacturers
CREATE TABLE Manufacturers (
    manufacturerId SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    imagePath VARCHAR(255) NOT NULL
);

-- Tạo bảng Categories
CREATE TABLE Categories (
    categoryId SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    imagePath VARCHAR(255) NOT NULL
);

-- Tạo bảng Users
CREATE TABLE Users (
    userId SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    avatar VARCHAR(255) DEFAULT '/img/default-avatar.png',
    isAdmin BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isBan BOOLEAN DEFAULT FALSE,
    isActivated BOOLEAN DEFAULT FALSE,
    authProvider VARCHAR(50) DEFAULT 'local',
    resetToken VARCHAR(255),
    resetTokenExpiration TIMESTAMP,
    CONSTRAINT check_auth_provider_password CHECK (
        (authProvider = 'local' AND password IS NOT NULL)
        OR (authProvider = 'google' AND password IS NULL)
    )
);

-- Tạo bảng Products
CREATE TABLE Products (
    productId SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    imagePath VARCHAR(255) NOT NULL,
    price INT NOT NULL CHECK (price >= 0),
    quantity INT DEFAULT 0 CHECK (quantity >= 0),
    sold_quantity INT DEFAULT 0 CHECK (sold_quantity >= 0),
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    stars INT CHECK (stars BETWEEN 1 AND 5),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    categoryId INT REFERENCES Categories(categoryId) ON DELETE SET NULL,
    manufacturerId INT REFERENCES Manufacturers(manufacturerId) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'available'
);

-- Tạo bảng Reviews
CREATE TABLE Reviews (
    reviewId SERIAL PRIMARY KEY,
    review TEXT NOT NULL,
    stars INT CHECK (stars BETWEEN 1 AND 5),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    productId INT REFERENCES Products(productId) ON DELETE CASCADE,
    userId INT REFERENCES Users(userId) ON DELETE CASCADE
);

-- Tạo bảng Images
CREATE TABLE Images (
    imageId SERIAL PRIMARY KEY,
    imagePath VARCHAR(255) NOT NULL,
    productId INT REFERENCES Products(productId) ON DELETE CASCADE
);

-- Tạo bảng ShipAddresses
CREATE TABLE Addresses (
    addressId SERIAL PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Orders
CREATE TABLE Orders (
    orderId SERIAL PRIMARY KEY,
    userId INT REFERENCES Users(userId) ON DELETE SET NULL,
    addressid INT REFERENCES Addresses(addressId) ON DELETE SET NULL,
    total INT NOT NULL CHECK (total >= 0),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status INT DEFAULT 0 CHECK (status BETWEEN 0 AND 3)
);

-- Tạo bảng OrderDetails
CREATE TABLE OrderDetails (
    orderDetailID SERIAL PRIMARY KEY,
    orderId INT REFERENCES Orders(orderId) ON DELETE CASCADE,
    productId INT REFERENCES Products(productId) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng CartProducts
CREATE TABLE CartProducts (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES Users(userId) ON DELETE CASCADE,
    productId INT REFERENCES Products(productId) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0)
);

INSERT INTO Categories (name, imagePath) 
VALUES
    ('Shoes', '/img/categories/Shoes.jpg'),
    ('Clothing', '/img/categories/Clothing.jpg'),
    ('Bags', '/img/categories/Bags.jpg'),
    ('Accessories', '/img/categories/Accessories.jpg');


INSERT INTO Manufacturers (name, imagePath) 
VALUES
    ('Nike', '/images/manufacturers/Nike.jpg'),
    ('Adidas', '/images/manufacturers/Adidas.jpg'),
    ('Puma', '/images/manufacturers/Puma.jpg');

INSERT INTO Products (name, imagePath, price, summary, description, stars, categoryId, manufacturerId, sold_quantity, createdAt)
VALUES 
    ('ULTRABOOST 1.0 SHOES', '/img/products/product1.jpg', 180, 'From a walk in the park to a weekend run with friends, these adidas Ultraboost 1.0 shoes are designed to keep you comfortable. An adidas PRIMEKNIT upper gently hugs your feet while BOOST on the midsole cushions from the first step to the last mile. The Stretchweb outsole flexes naturally for an energized ride, and Continental™ Rubber gives you the traction you need to keep that pep in your step.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">adidas PRIMEKNIT textile upper</li><li class="list-group-item px-0">Fitcounter molded heel counter</li><li class="list-group-item px-0">BOOST midsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Stretchweb outsole with Continental™ Rubber</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Core Black / Beam Green</li><li class="list-group-item px-0">Product code: HQ4199</li></ul></div></div>', 5, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('ULTRABOOST 2.0 SHOES', '/img/products/product2.jpg', 180, 'From a walk in the park to a weekend run with friends, these adidas Ultraboost 1.0 shoes are designed to keep you comfortable. An adidas PRIMEKNIT upper gently hugs your feet while BOOST on the midsole cushions from the first step to the last mile. The Stretchweb outsole flexes naturally for an energized ride, and Continental™ Rubber gives you the traction you need to keep that pep in your step.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">adidas PRIMEKNIT textile upper</li><li class="list-group-item px-0">Fitcounter molded heel counter</li><li class="list-group-item px-0">BOOST midsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Stretchweb outsole with Continental™ Rubber</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Core Black / Beam Green</li><li class="list-group-item px-0">Product code: HQ4199</li></ul></div></div>', 5, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('VL Court 3.0 Shoes', '/img/products/product3.jpg', 70, 'These adidas sneakers are all clean lines and a smooth coated leather upper atop a skater-style vulcanized outsole. Wear yours with crop pants or a floaty skirt. Either way, you''ll want to show off every angle. Lightweight cushioning and a soft lining keep the foot wrapped in comfort right through the day.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Coated leather upper</li><li class="list-group-item px-0">Textile lining</li><li class="list-group-item px-0">Cushioned midsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Vulcanized rubber outsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Clear Pink / Legend Ink / Gum</li><li class="list-group-item px-0">Product code: JP7629</li></ul></div></div>', 4, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Gazelle Indoor Shoes 1.0', '/img/products/product4.jpg', 120, 'Originally designed as an indoor training shoe, the adidas Gazelle shoes have become a timeless staple. These iconic shoes are crafted for everyday wear, with a premium soft suede upper and muted colors that pair effortlessly with your wardrobe. Whether you''re running errands or meeting friends, this retro-inspired design pays homage to adidas heritage while adding a luxe look and feel to your outfit.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Suede upper</li><li class="list-group-item px-0">Leather lining</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Gum rubber cupsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Shadow Fig / Cloud White / Gum</li><li class="list-group-item px-0">Product code: IH5483</li></ul></div></div>', 4, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Gazelle Indoor Shoes 2.0', '/img/products/product5.jpg', 120, 'Originally designed as an indoor training shoe, the adidas Gazelle shoes have become a timeless staple. These iconic shoes are crafted for everyday wear, with a premium soft suede upper and muted colors that pair effortlessly with your wardrobe. Whether you''re running errands or meeting friends, this retro-inspired design pays homage to adidas heritage while adding a luxe look and feel to your outfit.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Suede upper</li><li class="list-group-item px-0">Leather lining</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Gum rubber cupsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Shadow Fig / Cloud White / Gum</li><li class="list-group-item px-0">Product code: IH5483</li></ul></div></div>', 4, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Harden Volume 8 Shoes', '/img/products/product6.jpg', 160, 'Changing the game isn''t enough for a superstar like James Harden, he has to revolutionize it. The latest Signature shoes from adidas Basketball and James Harden continues to celebrate one of basketball''s elite scorers and elite personalities. Rocking a combined adidas BOOST and Lightstrike midsole, these performance basketball shoes provide the support you need to dominate each and every time you step on the floor.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Textile upper</li><li class="list-group-item px-0">Textile lining</li><li class="list-group-item px-0">BOOST midsole with Lightstrike cushioning</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Rubber outsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Feather Grey / Ivory / Core Black</li><li class="list-group-item px-0">Product code: IG6649</li></ul></div></div>', 5, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Adilette Comfort Slides', '/img/products/product7.jpg', 35, 'Whether you''re heading to the locker room after an intense gym session or at home recovering on the couch, these slides keep your feet wrapped in lightweight comfort. Pair them with socks and shorts for your post-workout look or with your favorite swimwear for the ultimate beach vibe. The adidas 3-Stripes design completes your sport style.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Slip-on construction</li><li class="list-group-item px-0">Synthetic upper</li><li class="list-group-item px-0">Textile lining</li><li class="list-group-item px-0">Lightweight cushioning</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Contoured footbed</li><li class="list-group-item px-0">EVA outsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Core Black / Core Black</li><li class="list-group-item px-0">Product code: GZ5896</li></ul></div></div>', 5, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Samba OG Shoes', '/img/products/product8.jpg', 100, 'Born on the pitch, the Samba is a timeless icon of street style. This silhouette stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole, making it a staple in everyone''s closet - on and off the pitch.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Lace closure</li><li class="list-group-item px-0">Full grain leather upper with gritty suede and gold foil details</li><li class="list-group-item px-0">Synthetic leather lining; Gum rubber cupsole</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Gum rubber midsole</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Core Black / Cloud White / Gum</li><li class="list-group-item px-0">Product code: B75807</li></ul></div></div>', 3, 1, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)));


INSERT INTO Products (name, imagePath, price, summary, description, stars, categoryId, manufacturerId, sold_quantity, createdAt)
VALUES 
    ('Mexico 24 Away Jersey', '/img/products/product9.jpg', 100, 'Created for powerful shows of support. Inspired by Mexico''s coat of arms, this adidas away jersey stands out with rattlesnake skin-style graphics. Built to keep fans comfortable, it includes moisture-managing AEROREADY and mesh panels that offer targeted breathability. A woven team crest and eagle-serpent sign-off leave no doubt where your soccer allegiance lies. The main material of the jersey is 100% recycled polyester excluding trimming and decoration.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Slim fit</li><li class="list-group-item px-0">Ribbed crewneck</li><li class="list-group-item px-0">100% polyester (recycled)</li><li class="list-group-item px-0">AEROREADY</li><li class="list-group-item px-0">Mesh sides, sleeves and lower back</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Mexico woven crest</li><li class="list-group-item px-0">Eagle-serpent sign-off below back collar</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Linen Green</li><li class="list-group-item px-0">Product code: IP6384</li></ul></div></div>', 5, 2, 2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Z.N.E. Full-Zip Hooded Track Jacket','/img/products/product10.jpg',110,'Zip up and find your focus in this adidas track jacket. The cozy three-layer doubleknit fabric helps lock in warmth, while a full-coverage hood makes it easy to block out the world when you need some "me time." When you''re feeling refreshed and ready to take on the day, a matte rubber-print 3 Bar Logo reminds you that you''re always connected to your community through sport.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Full zip with hood</li><li class="list-group-item px-0">57% polyester (recycled), 43% cotton</li><li class="list-group-item px-0">Front zip pockets</li><li class="list-group-item px-0">Three-layer fabric</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Contains a minimum of 70% recycled and renewable content</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Collegiate Green</li><li class="list-group-item px-0">Product code: JF6539</li></ul></div></div>',4,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Mexico 2024 Away Authentic Jersey','/img/products/product11.jpg',150,'Tradition meets mysticism. Embrace the enchanting heritage of Mexican culture through the vibrant colors of the "Alebrijes" shapes. Patterns of animals and nature create a magic backdrop alongside the lively feathered patterns of the Mexican eagle.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Slim fit</li><li class="list-group-item px-0">Crewneck</li><li class="list-group-item px-0">100% polyester (recycled)</li><li class="list-group-item px-0">Sides and lower back: 100% polyester (recycled)</li><li class="list-group-item px-0">HEAT.RDY</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Mesh inserts on sleeves</li><li class="list-group-item px-0">Mexico heat-applied crest</li><li class="list-group-item px-0">Federation artwork on back collar</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Linen Green</li><li class="list-group-item px-0">Product code: IP6385</li></ul></div></div>',5,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Adicolor Classics SST Track Pants','/img/products/product12.jpg',70,'Reinventions are all about taking the best of what''s been and making it relevant for today. Inspired by archive styles, these adidas track pants pay homage to the past with a slim fit, ribbed cuffs and an embroidered Trefoil logo on one leg. The soft material takes comfort into today, and a drawcord on the elastic waist ensures the perfect fit for every wear. Rock them whenever you''re in the mood to relax the day away.A minimum of 70% of this product is a blend of recycled and renewable materials.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Slim fit</li><li class="list-group-item px-0">Drawcord on elastic waist</li><li class="list-group-item px-0">70% polyester (recycled), 30% cotton</li><li class="list-group-item px-0">Zip pockets</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Ribbed cuffs</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Green / White</li><li class="list-group-item px-0">Product code: IK3515</li></ul></div></div>',3,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Enjoy Summer Cargo Pants','/img/products/product13.jpg',75,'"''Enjoy summer'' embraces the joyful nostalgia of summertime through the lens of early 2000''s boarding culture. The collection offers a balance of colorful graphic pieces and staple base layers in relaxed, era-relevant fits." — Menswear Designer, Dean Babbage','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Drawcord on elastic waist</li><li class="list-group-item px-0">100% cotton ripstop</li><li class="list-group-item px-0">Front welt pockets</li><li class="list-group-item px-0">Side cargo pockets</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Back open pocket</li><li class="list-group-item px-0">Made with Better Cotton</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Olive Strata</li><li class="list-group-item px-0">Product code: IT8192</li></ul></div></div>',4,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Designed for Training COLD.RDY Full-Zip Hoodie','/img/products/product14.jpg',110,'Train even when the temperatures drop when you''re wearing this adidas training hoodie. Built for athletic performance in chilly conditions, COLD.RDY traps body heat to keep you warm, while AEROREADY helps you stay comfortable and dry. With zip pockets to stash your essentials, this hoodie is a go-to for any activity.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Full zip</li><li class="list-group-item px-0">92% recycled polyester, 8% elastane dobby</li><li class="list-group-item px-0">Insulating COLD.RDY</li><li class="list-group-item px-0">Kangaroo front zip pockets</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Moisture-wicking fabric</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Shadow Olive</li><li class="list-group-item px-0">Product code: IX9059</li></ul></div></div>',3,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('LA Galaxy 23/24 Away Authentic Jersey','/img/products/product15.jpg',150,'A tribute to their home. This LA Galaxy away authentic jersey from adidas proudly displays the green, gold, and red colors that represent the city of Los Angeles. A heat-applied team badge on the chest and a pair of signoffs further rep the soccer club and its city. Moisture-absorbing AEROREADY ensures it keeps players comfortable when they''re performing on rivals'' fields.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Ribbed crewneck</li><li class="list-group-item px-0">100% polyester (recycled)</li><li class="list-group-item px-0">Mesh back panel</li><li class="list-group-item px-0">AEROREADY</li><li class="list-group-item px-0">Ribbed cuffs</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Droptail hem</li><li class="list-group-item px-0">LA Galaxy heat-applied crest</li><li class="list-group-item px-0">Club artwork on back collar</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Mystery Green / Team Colleg Gold 2</li><li class="list-group-item px-0">Product code: HI1875</li></ul></div></div>',5,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30))),
    ('Z.N.E. Full-Zip Hooded Track Jacket','/img/products/product16.jpg',110,'Zip up and find your focus in this adidas track jacket. The cozy three-layer doubleknit fabric helps lock in warmth, while a full-coverage hood makes it easy to block out the world when you need some "me time." When you''re feeling refreshed and ready to take on the day, a matte rubber-print 3 Bar Logo reminds you that you''re always connected to your community through sport.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Full zip with hood</li><li class="list-group-item px-0">57% polyester (recycled), 43% cotton</li><li class="list-group-item px-0">Front zip pockets</li><li class="list-group-item px-0">Three-layer fabric</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Contains a minimum of 70% recycled and renewable content</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Magic Beige</li><li class="list-group-item px-0">Product code: JF2445</li></ul></div></div>',5,2,2, FLOOR(RANDOM() * 100), DATE '2024-11-01' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)));

-- 10. Thêm dữ liệu vào bảng Users
INSERT INTO Users (email, username, password, firstName, lastName, avatar, isAdmin, createdAt, isBan, isActivated, authProvider, resetToken, resetTokenExpiration)
VALUES
    ('john.doe@example.com', 'johndoe', '$2a$10$7a8b9c8d7e6f5g4h3i2j1k', 'John', 'Doe', '/img/avatars/johndoe.jpg', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('jane.smith@example.com', 'janesmith', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Jane', 'Smith', '/img/avatars/janesmith.jpg', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('alice.wonderland@example.com', 'alicewonderland', '$2a$10$5a6b7c8d7e6f5g4h3i4j5k', 'Alice', 'Wonderland', '/img/avatars/alice.jpg', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('bob.builder@example.com', 'bobbuilder', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Bob', 'Builder', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('charlie.brown@example.com', 'charliebrown', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Charlie', 'Brown', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('david.jones@example.com', 'davidjones', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'David', 'Jones', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('emily.clark@example.com', 'emilyclark', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Emily', 'Clark', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('frank.wright@example.com', 'frankwright', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Frank', 'Wright', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('george.king@example.com', 'georgeking', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'George', 'King', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('hannah.martin@example.com', 'hannahmartin', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Hannah', 'Martin', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('ian.scott@example.com', 'ianscott', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Ian', 'Scott', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('julia.roberts@example.com', 'juliaroberts', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Julia', 'Roberts', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('kevin.baker@example.com', 'kevinbaker', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Kevin', 'Baker', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('lisa.moore@example.com', 'lisamoore', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Lisa', 'Moore', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('michael.davis@example.com', 'michaeldavis', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Michael', 'Davis', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('nina.wilson@example.com', 'ninawilson', '$2a$10$1a2b3c4d5e6f7g8h9i0j1k', 'Nina', 'Wilson', '/img/default-avatar.png', FALSE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL),
    ('superadmin@gmail.com', 'superadmin', '$2a$08$iLtWCUW2GKglI5q8l9hhl.eoemVCSjid5VxIzyLr7S0F48KzzgAP.', 'Super', 'Admin', '/img/avatars/superadmin.jpg', TRUE, CURRENT_DATE, FALSE, TRUE, 'local', NULL, NULL);    

-- 11. Thêm dữ liệu vào bảng Reviews
INSERT INTO Reviews (review, stars, createdAt, productId, userId)
VALUES
    ('Great product, highly recommend!', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 1, 4),
    ('Not bad, but could be better', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 1, 5),
    ('Decent quality for the price', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 1, 6),
    ('Very comfortable and stylish', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 1, 7),
    ('Good value for money', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 1, 8),
    ('Excellent product, will buy again', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 2, 4),
    ('Not worth the price', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 2, 5),
    ('Average quality', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 2, 6),
    ('Very satisfied with this purchase', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 2, 7),
    ('Would not recommend', 1, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 2, 8),
    ('Amazing product, exceeded expectations', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 3, 4),
    ('Good quality, but a bit expensive', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 3, 5),
    ('Satisfied with the purchase', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 3, 6),
    ('Not as described', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 3, 7),
    ('Excellent quality, highly recommend', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 3, 8),
    ('Very happy with this product', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 4, 4),
    ('Could be better', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 4, 5),
    ('Good product, but overpriced', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 4, 6),
    ('Excellent value for money', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 4, 7),
    ('Not satisfied with the quality', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 4, 8),
    ('Great product, will buy again', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 5, 4),
    ('Decent quality, but not the best', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 5, 5),
    ('Very comfortable', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 5, 6),
    ('Good product, but could be cheaper', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 5, 7),
    ('Excellent quality, very satisfied', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 5, 8),
    ('Very happy with this purchase', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 6, 4),
    ('Not worth the money', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 6, 5),
    ('Good quality, but too expensive', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 6, 6),
    ('Satisfied with the product', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 6, 7),
    ('Excellent product, highly recommend', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 6, 8),
    ('Great value for money', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 7, 4),
    ('Not as good as expected', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 7, 5),
    ('Decent quality, but overpriced', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 7, 6),
    ('Very satisfied with this purchase', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 7, 7),
    ('Good product, but could be better', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 7, 8),
    ('Excellent quality, will buy again', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 8, 4),
    ('Not worth the price', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 8, 5),
    ('Average quality', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 8, 6),
    ('Very satisfied with this product', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 8, 7),
    ('Would not recommend', 1, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 8, 8),
    ('Amazing product, exceeded expectations', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 9, 4),
    ('Good quality, but a bit expensive', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 9, 5),
    ('Satisfied with the purchase', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 9, 6),
    ('Not as described', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 9, 7),
    ('Excellent quality, highly recommend', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 9, 8),
    ('Very happy with this product', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 10, 4),
    ('Could be better', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 10, 5),
    ('Good product, but overpriced', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 10, 6),
    ('Excellent value for money', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 10, 7),
    ('Not satisfied with the quality', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 10, 8),
    ('Great product, will buy again', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 11, 4),
    ('Decent quality, but not the best', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 11, 5),
    ('Very comfortable', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 11, 6),
    ('Good product, but could be cheaper', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 11, 7),
    ('Excellent quality, very satisfied', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 11, 8),
    ('Very happy with this purchase', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 12, 4),
    ('Not worth the money', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 12, 5),
    ('Good quality, but too expensive', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 12, 6),
    ('Satisfied with the product', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 12, 7),
    ('Excellent product, highly recommend', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 12, 8),
    ('Great value for money', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 13, 4),
    ('Not as good as expected', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 13, 5),
    ('Decent quality, but overpriced', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 13, 6),
    ('Very satisfied with this purchase', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 13, 7),
    ('Good product, but could be better', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 13, 8),
    ('Excellent quality, will buy again', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 14, 4),
    ('Not worth the price', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 14, 5),
    ('Average quality', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 14, 6),
    ('Very satisfied with this product', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 14, 7),
    ('Would not recommend', 1, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 14, 8),
    ('Amazing product, exceeded expectations', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 15, 4),
    ('Good quality, but a bit expensive', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 15, 5),
    ('Satisfied with the purchase', 4, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 15, 6),
    ('Not as described', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 15, 7),
    ('Excellent quality, highly recommend', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 15, 8),
    ('Very happy with this product', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 16, 4),
    ('Could be better', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 16, 5),
    ('Good product, but overpriced', 3, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 16, 6),
    ('Excellent value for money', 5, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 16, 7),
    ('Not satisfied with the quality', 2, DATE '2024-12-12' + (INTERVAL '1 day' * FLOOR(RANDOM() * 30)), 16, 8);

-- Thêm dữ liệu vào bảng Addresses
INSERT INTO Addresses (fullName, email, phone, address, zipcode, createdAt)
VALUES
    ('John Doe', 'john.doe@example.com', '1234567890', '123 Main St, Springfield', '10001', '2024-11-15'),
    ('Jane Smith', 'jane.smith@example.com', '0987654321', '456 Oak St, Riverside', '10002', '2024-11-20'),
    ('Alice Johnson', 'alice.johnson@example.com', '1122334455', '789 Pine St, Brookfield', '10003', '2024-12-01'),
    ('Bob Brown', 'bob.brown@example.com', '6677889900', '321 Elm St, Hill Valley', '10004', '2024-12-10'),
    ('Charlie Davis', 'charlie.davis@example.com', '9988776655', '654 Maple St, Meadowview', '10005', '2024-12-25'),
    ('Emily Clark', 'emily.clark@example.com', '5566778899', '987 Birch St, Lakewood', '10006', '2025-01-05'),
    ('Frank Harris', 'frank.harris@example.com', '4455667788', '213 Cedar St, Sunnydale', '10007', '2025-01-12'),
    ('Grace Lee', 'grace.lee@example.com', '3344556677', '678 Walnut St, Riverdale', '10008', '2025-01-13');

-- 13. Thêm dữ liệu vào bảng Orders
INSERT INTO Orders (userId, addressid, total, createdAt, status)
VALUES
    (1, 2, 400, '2024-11-10', 1),
    (3, 2, 600, '2024-11-12', 2),
    (4, 1, 550, '2024-11-18', 1),
    (5, 3, 750, '2024-11-22', 0),
    (2, 4, 200, '2024-12-01', 3),
    (3, 3, 500, '2024-12-10', 1),
    (4, 2, 300, '2024-12-15', 2),
    (1, 1, 450, '2024-12-18', 1),
    (5, 3, 800, '2025-01-02', 3),
    (2, 4, 650, '2025-01-05', 0),
    (3, 1, 400, '2025-01-08', 1),
    (4, 2, 350, '2025-01-12', 2),
    (5, 3, 500, '2025-01-13', 1);

-- 14. Thêm dữ liệu vào bảng OrderDetails
INSERT INTO OrderDetails (orderId, productId, quantity, createdAt)
VALUES
    (6, 1, 1, '2024-11-10'),
    (6, 3, 2, '2024-11-10'),
    (7, 4, 3, '2024-11-12'),
    (7, 5, 1, '2024-11-12'),
    (8, 6, 2, '2024-11-18'),
    (8, 7, 1, '2024-11-18'),
    (9, 8, 4, '2024-11-22'),
    (10, 6, 2, '2024-12-01'),
    (10, 1, 1, '2024-12-01'),
    (11, 2, 2, '2024-12-10'),
    (11, 3, 3, '2024-12-10'),
    (12, 4, 1, '2024-12-15'),
    (12, 5, 2, '2024-12-15');