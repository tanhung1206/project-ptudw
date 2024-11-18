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


INSERT INTO Products (name, imagePath, price, summary, description, stars, categoryId, manufacturerId)
VALUES 
('Mexico 24 Away Jersey', '/img/products/product9.jpg', 100, 'Created for powerful shows of support. Inspired by Mexico''s coat of arms, this adidas away jersey stands out with rattlesnake skin-style graphics. Built to keep fans comfortable, it includes moisture-managing AEROREADY and mesh panels that offer targeted breathability. A woven team crest and eagle-serpent sign-off leave no doubt where your soccer allegiance lies. The main material of the jersey is 100% recycled polyester excluding trimming and decoration.', '<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Slim fit</li><li class="list-group-item px-0">Ribbed crewneck</li><li class="list-group-item px-0">100% polyester (recycled)</li><li class="list-group-item px-0">AEROREADY</li><li class="list-group-item px-0">Mesh sides, sleeves and lower back</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Mexico woven crest</li><li class="list-group-item px-0">Eagle-serpent sign-off below back collar</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Linen Green</li><li class="list-group-item px-0">Product code: IP6384</li></ul></div></div>
', 5, 2, 2),
('Z.N.E. Full-Zip Hooded Track Jacket','/img/products/product10.jpg',110,'Zip up and find your focus in this adidas track jacket. The cozy three-layer doubleknit fabric helps lock in warmth, while a full-coverage hood makes it easy to block out the world when you need some "me time." When you''re feeling refreshed and ready to take on the day, a matte rubber-print 3 Bar Logo reminds you that you''re always connected to your community through sport.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Full zip with hood</li><li class="list-group-item px-0">57% polyester (recycled), 43% cotton</li><li class="list-group-item px-0">Front zip pockets</li><li class="list-group-item px-0">Three-layer fabric</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Contains a minimum of 70% recycled and renewable content</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Collegiate Green</li><li class="list-group-item px-0">Product code: JF6539</li></ul></div></div>
',4,2,2),
('Mexico 2024 Away Authentic Jersey','/img/products/product11.jpg',150,'Tradition meets mysticism. Embrace the enchanting heritage of Mexican culture through the vibrant colors of the "Alebrijes" shapes. Patterns of animals and nature create a magic backdrop alongside the lively feathered patterns of the Mexican eagle.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Slim fit</li><li class="list-group-item px-0">Crewneck</li><li class="list-group-item px-0">100% polyester (recycled)</li><li class="list-group-item px-0">Sides and lower back: 100% polyester (recycled)</li><li class="list-group-item px-0">HEAT.RDY</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Mesh inserts on sleeves</li><li class="list-group-item px-0">Mexico heat-applied crest</li><li class="list-group-item px-0">Federation artwork on back collar</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Linen Green</li><li class="list-group-item px-0">Product code: IP6385</li></ul></div></div>
',5,2,2),
('Adicolor Classics SST Track Pants','/img/products/product12.jpg',70,'Reinventions are all about taking the best of what''s been and making it relevant for today. Inspired by archive styles, these adidas track pants pay homage to the past with a slim fit, ribbed cuffs and an embroidered Trefoil logo on one leg. The soft material takes comfort into today, and a drawcord on the elastic waist ensures the perfect fit for every wear. Rock them whenever you''re in the mood to relax the day away.A minimum of 70% of this product is a blend of recycled and renewable materials.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Slim fit</li><li class="list-group-item px-0">Drawcord on elastic waist</li><li class="list-group-item px-0">70% polyester (recycled), 30% cotton</li><li class="list-group-item px-0">Zip pockets</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Ribbed cuffs</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Green / White</li><li class="list-group-item px-0">Product code: IK3515</li></ul></div></div>
',3,2,2),
('Enjoy Summer Cargo Pants','/img/products/product13.jpg',75,'"''Enjoy summer'' embraces the joyful nostalgia of summertime through the lens of early 2000''s boarding culture. The collection offers a balance of colorful graphic pieces and staple base layers in relaxed, era-relevant fits." — Menswear Designer, Dean Babbage','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Drawcord on elastic waist</li><li class="list-group-item px-0">100% cotton ripstop</li><li class="list-group-item px-0">Front welt pockets</li><li class="list-group-item px-0">Side cargo pockets</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Back open pocket</li><li class="list-group-item px-0">Made with Better Cotton</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Olive Strata</li><li class="list-group-item px-0">Product code: IT8192</li></ul></div></div>
',4,2,2),
('Designed for Training COLD.RDY Full-Zip Hoodie','/img/products/product14.jpg',110,'Train even when the temperatures drop when you''re wearing this adidas training hoodie. Built for athletic performance in chilly conditions, COLD.RDY traps body heat to keep you warm, while AEROREADY helps you stay comfortable and dry. With zip pockets to stash your essentials, this hoodie is a go-to for any activity.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Full zip</li><li class="list-group-item px-0">92% recycled polyester, 8% elastane dobby</li><li class="list-group-item px-0">Insulating COLD.RDY</li><li class="list-group-item px-0">Kangaroo front zip pockets</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Moisture-wicking fabric</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Shadow Olive</li><li class="list-group-item px-0">Product code: IX9059</li></ul></div></div>
',3,2,2),
('LA Galaxy 23/24 Away Authentic Jersey','/img/products/product15.jpg',150,'A tribute to their home. This LA Galaxy away authentic jersey from adidas proudly displays the green, gold, and red colors that represent the city of Los Angeles. A heat-applied team badge on the chest and a pair of signoffs further rep the soccer club and its city. Moisture-absorbing AEROREADY ensures it keeps players comfortable when they''re performing on rivals'' fields.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Ribbed crewneck</li><li class="list-group-item px-0">100% polyester (recycled)</li><li class="list-group-item px-0">Mesh back panel</li><li class="list-group-item px-0">AEROREADY</li><li class="list-group-item px-0">Ribbed cuffs</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Droptail hem</li><li class="list-group-item px-0">LA Galaxy heat-applied crest</li><li class="list-group-item px-0">Club artwork on back collar</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Mystery Green / Team Colleg Gold 2</li><li class="list-group-item px-0">Product code: HI1875</li></ul></div></div>
',5,2,2),
('Z.N.E. Full-Zip Hooded Track Jacket','/img/products/product16.jpg',110,'Zip up and find your focus in this adidas track jacket. The cozy three-layer doubleknit fabric helps lock in warmth, while a full-coverage hood makes it easy to block out the world when you need some "me time." When you''re feeling refreshed and ready to take on the day, a matte rubber-print 3 Bar Logo reminds you that you''re always connected to your community through sport.','<div class="row"><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Regular fit</li><li class="list-group-item px-0">Full zip with hood</li><li class="list-group-item px-0">57% polyester (recycled), 43% cotton</li><li class="list-group-item px-0">Front zip pockets</li><li class="list-group-item px-0">Three-layer fabric</li></ul></div><div class="col-md-6"><ul class="list-group list-group-flush"><li class="list-group-item px-0">Contains a minimum of 70% recycled and renewable content</li><li class="list-group-item px-0">Imported</li><li class="list-group-item px-0">Product color: Magic Beige</li><li class="list-group-item px-0">Product code: JF2445</li></ul></div></div>
',5,2,2)

