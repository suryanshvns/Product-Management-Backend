require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const main = async () => {
  console.log('Cleaning existing data...');
  await prisma.invoice.deleteMany();
  await prisma.orderComment.deleteMany();
  await prisma.orderApproval.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.customerAddress.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.invoiceCounter.deleteMany();
  await prisma.customerGroup.deleteMany();
  await prisma.reportSchedule.deleteMany();
  await prisma.priceListItem.deleteMany();
  await prisma.priceList.deleteMany();
  await prisma.scheduledPrice.deleteMany();
  await prisma.bulkPriceTier.deleteMany();
  await prisma.productComment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productTag.deleteMany();
  await prisma.inventoryBatch.deleteMany();
  await prisma.productRelation.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.productStatusHistory.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('test', 10);

  console.log('Seeding roles...');
  const roles = await Promise.all([
    prisma.role.create({ data: { name: 'superadmin', description: 'Full platform control and user/role management' } }),
    prisma.role.create({ data: { name: 'admin', description: 'Full system access' } }),
    prisma.role.create({ data: { name: 'manager', description: 'Manage products and inventory' } }),
    prisma.role.create({ data: { name: 'editor', description: 'Edit products and categories' } }),
    prisma.role.create({ data: { name: 'viewer', description: 'Read-only access' } }),
    prisma.role.create({ data: { name: 'support', description: 'View logs and notifications' } }),
  ]);
  const roleMap = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  console.log('Seeding users...');
  const initialUsers = await Promise.all([
    prisma.user.create({ data: { email: 'superadmin@company.com', password: passwordHash, name: 'Super Admin' } }),
    prisma.user.create({ data: { email: 'admin@company.com', password: passwordHash, name: 'Alex Admin' } }),
    prisma.user.create({ data: { email: 'sarah.manager@company.com', password: passwordHash, name: 'Sarah Manager' } }),
    prisma.user.create({ data: { email: 'james.editor@company.com', password: passwordHash, name: 'James Editor' } }),
    prisma.user.create({ data: { email: 'emma.viewer@company.com', password: passwordHash, name: 'Emma Viewer' } }),
    prisma.user.create({ data: { email: 'mike.support@company.com', password: passwordHash, name: 'Mike Support' } }),
    prisma.user.create({ data: { email: 'lisa@company.com', password: passwordHash, name: 'Lisa Chen' } }),
    prisma.user.create({ data: { email: 'david@company.com', password: passwordHash, name: 'David Park' } }),
    prisma.user.create({ data: { email: 'olivia@company.com', password: passwordHash, name: 'Olivia Brown' } }),
  ]);
  const [superadminUser, adminUser, managerUser, editorUser, viewerUser, supportUser] = initialUsers;
  const users = [...initialUsers];
  const realUserNames = [
    'Rachel Green', 'Tom Anderson', 'Priya Sharma', 'Marcus Johnson', 'Yuki Tanaka', 'Elena Rodriguez', 'Omar Hassan', 'Sophie Laurent',
    'James Wilson', 'Aisha Patel', 'Lucas Müller', 'Zara Khan', 'Noah Kim', 'Mia O\'Brien', 'Ethan Chen', 'Isabella Rossi',
    'Liam Foster', 'Ava Singh', 'Mason Wright', 'Charlotte Lee', 'Oliver Brown', 'Amelia Davis', 'Elijah Martinez', 'Harper Garcia',
    'William Clark', 'Evelyn Lewis', 'Benjamin Walker', 'Abigail Hall', 'Henry Young', 'Emily King', 'Alexander Scott', 'Elizabeth Green',
    'Sebastian Adams', 'Sofia Baker', 'Jack Nelson', 'Avery Carter', 'Daniel Mitchell', 'Ella Perez', 'Matthew Roberts', 'Scarlett Turner',
    'Joseph Phillips', 'Grace Campbell', 'Samuel Parker', 'Chloe Evans', 'David Edwards', 'Victoria Collins', 'Ryan Stewart', 'Penelope Sanchez',
    'Nathan Morris', 'Layla Rogers', 'Caleb Reed', 'Hannah Cook', 'Andrew Morgan', 'Addison Bell', 'Joshua Murphy', 'Lillian Bailey',
    'John Rivera', 'Natalie Cooper', 'Dylan Richardson', 'Lily Cox', 'Luke Howard', 'Zoey Ward', 'Anthony Torres', 'Hazel Peterson',
    'Isaac Gray', 'Audrey Ramirez', 'Gabriel James', 'Savannah Watson', 'Julian Brooks', 'Brooklyn Kelly', 'Levi Sanders', 'Bella Price',
    'Christopher Bennett', 'Claire Wood', 'Isaiah Barnes', 'Skylar Ross', 'Aaron Henderson', 'Lucy Coleman', 'Hunter Jenkins', 'Paisley Perry',
    'Adrian Powell', 'Anna Long', 'Connor Patterson', 'Nevaeh Hughes', 'Thomas Flores', 'Aria Washington', 'Jeremiah Butler', 'Stella Simmons',
    'Robert Foster', 'Samantha Bryant', 'Nicholas Alexander',
  ];
  for (let i = 10; i <= 100; i++) {
    const name = realUserNames[(i - 10) % realUserNames.length];
    const base = name.toLowerCase().replace(/\s+/g, '.').replace(/['']/g, '');
    const email = `${base}.${i}@company.com`;
    users.push(
      await prisma.user.create({
        data: { email, password: passwordHash, name },
      })
    );
  }

  console.log('Seeding user_roles...');
  const roleNames = ['superadmin', 'admin', 'manager', 'editor', 'viewer', 'support'];
  await prisma.userRole.createMany({
    data: [
      { userId: superadminUser.id, roleId: roleMap.superadmin },
      { userId: adminUser.id, roleId: roleMap.admin },
      { userId: managerUser.id, roleId: roleMap.manager },
      { userId: editorUser.id, roleId: roleMap.editor },
      { userId: viewerUser.id, roleId: roleMap.viewer },
      { userId: supportUser.id, roleId: roleMap.support },
      { userId: users[6].id, roleId: roleMap.editor },
      { userId: users[7].id, roleId: roleMap.viewer },
      { userId: users[8].id, roleId: roleMap.manager },
    ],
  });
  for (let i = 9; i < users.length; i++) {
    await prisma.userRole.create({
      data: { userId: users[i].id, roleId: roleMap[roleNames[i % roleNames.length]] },
    });
  }

  console.log('Seeding sessions...');
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const sessionData = [];
  for (let i = 0; i < 100; i++) {
    sessionData.push({
      userId: users[i % users.length].id,
      token: `session-seed-${i}-${Date.now()}`,
      expiresAt: nextWeek,
    });
  }
  await prisma.session.createMany({ data: sessionData });

  console.log('Seeding organization...');
  const defaultOrg = await prisma.organization.create({
    data: { name: 'Default Organization', slug: 'default-org' },
  });

  console.log('Seeding categories...');
  const categoryData = [
    { name: 'Electronics', description: 'Phones, laptops, gadgets' },
    { name: 'Clothing & Apparel', description: 'Men, women, kids fashion' },
    { name: 'Home & Kitchen', description: 'Furniture, appliances, decor' },
    { name: 'Sports & Outdoors', description: 'Fitness, camping, outdoor gear' },
    { name: 'Books & Media', description: 'Books, e-books, music, movies' },
    { name: 'Health & Beauty', description: 'Skincare, supplements, wellness' },
    { name: 'Toys & Games', description: 'Toys, board games, video games' },
    { name: 'Automotive', description: 'Parts, accessories, tools' },
  ];
  const categories = [];
  for (const c of categoryData) {
    categories.push(await prisma.category.create({ data: { ...c, slug: slugify(c.name) } }));
  }
  const moreCategoryData = [
    { name: 'Laptops', description: 'Laptops and notebooks' },
    { name: 'Monitors', description: 'Displays and monitors' },
    { name: 'Accessories', description: 'Accessories and peripherals' },
    { name: 'Wearables', description: 'Watches and fitness trackers' },
    { name: 'TV', description: 'Televisions and streaming' },
    { name: 'Fashion', description: 'Clothing and fashion' },
    { name: 'Appliances', description: 'Home appliances' },
    { name: 'Garden & Outdoor', description: 'Plants, tools, outdoor living' },
    { name: 'Office Supplies', description: 'Stationery, desk accessories' },
    { name: 'Pet Supplies', description: 'Food, toys, care for pets' },
    { name: 'Baby & Kids', description: 'Nursery, clothing, toys for kids' },
    { name: 'Jewelry & Watches', description: 'Rings, necklaces, timepieces' },
    { name: 'Art & Craft', description: 'Supplies for DIY and crafting' },
    { name: 'Musical Instruments', description: 'Guitars, keyboards, drums' },
    { name: 'Camera & Photo', description: 'Cameras, lenses, accessories' },
    { name: 'Grocery & Gourmet', description: 'Food, snacks, beverages' },
    { name: 'Furniture', description: 'Living room, bedroom, office furniture' },
    { name: 'Lighting', description: 'Lamps, bulbs, outdoor lights' },
    { name: 'Rugs & Carpets', description: 'Floor coverings and mats' },
    { name: 'Bedding & Bath', description: 'Sheets, towels, bath accessories' },
    { name: 'Storage & Organization', description: 'Containers, shelves, organizers' },
    { name: 'Tools & Hardware', description: 'Hand tools, power tools, hardware' },
    { name: 'Security & Surveillance', description: 'Cameras, locks, alarms' },
    { name: 'Networking', description: 'Routers, cables, adapters' },
    { name: 'Computer Components', description: 'RAM, GPUs, motherboards' },
    { name: 'Gaming', description: 'Consoles, games, gaming gear' },
    { name: 'Smart Home', description: 'Hubs, speakers, smart devices' },
    { name: 'Phone Accessories', description: 'Cases, chargers, mounts' },
    { name: 'Audio & Video', description: 'Speakers, headphones, displays' },
    { name: 'Bags & Luggage', description: 'Backpacks, suitcases, totes' },
    { name: 'Watches & Accessories', description: 'Straps, winders, boxes' },
    { name: 'Sunglasses & Eyewear', description: 'Sunglasses, reading glasses' },
    { name: 'Hair Care', description: 'Shampoos, styling tools, treatments' },
    { name: 'Oral Care', description: 'Toothbrushes, floss, mouthwash' },
    { name: 'Fragrance', description: 'Perfumes, colognes, body spray' },
    { name: 'Men\'s Grooming', description: 'Shaving, trimmers, skincare' },
    { name: 'First Aid & Medical', description: 'Bandages, thermometers, medicine' },
    { name: 'Vitamins & Supplements', description: 'Multivitamins, protein, herbs' },
    { name: 'Fitness Equipment', description: 'Weights, bands, machines' },
    { name: 'Cycling', description: 'Bikes, helmets, accessories' },
    { name: 'Water Sports', description: 'Swimming, kayaking, diving' },
    { name: 'Winter Sports', description: 'Skiing, snowboarding gear' },
    { name: 'Team Sports', description: 'Soccer, basketball, baseball' },
    { name: 'Running', description: 'Shoes, apparel, track gear' },
    { name: 'Yoga & Meditation', description: 'Mats, blocks, apparel' },
    { name: 'Camping & Hiking', description: 'Tents, backpacks, gear' },
    { name: 'Fishing', description: 'Rods, reels, tackle' },
    { name: 'Hunting', description: 'Optics, clothing, equipment' },
    { name: 'Magazines & Newspapers', description: 'Print and digital subscriptions' },
    { name: 'Audiobooks', description: 'Audio books and narration' },
    { name: 'Educational', description: 'Courses, textbooks, learning kits' },
    { name: 'Comics & Graphic Novels', description: 'Comic books and graphic novels' },
    { name: 'Collectibles', description: 'Trading cards, figurines' },
    { name: 'Puzzles', description: 'Jigsaw, brain teasers, games' },
    { name: 'Action Figures', description: 'Toys and collectible figures' },
    { name: 'Outdoor Play', description: 'Play sets, sandbox, ride-ons' },
    { name: 'Arts & Crafts for Kids', description: 'Kid-friendly craft supplies' },
    { name: 'School Supplies', description: 'Backpacks, binders, supplies' },
    { name: 'Car Electronics', description: 'Stereos, dash cams, radar' },
    { name: 'Motorcycle Gear', description: 'Helmets, jackets, parts' },
    { name: 'RV & Marine', description: 'RV and boat accessories' },
    { name: 'Tires & Wheels', description: 'Tires, rims, accessories' },
    { name: 'Oils & Fluids', description: 'Engine oil, coolant, fluids' },
    { name: 'Interior Accessories', description: 'Seat covers, mats, organizers' },
    { name: 'Exterior Accessories', description: 'Covers, racks, guards' },
    { name: 'Cleaning & Detailing', description: 'Car wash, wax, interior care' },
    { name: 'Baking', description: 'Bakeware, ingredients, tools' },
    { name: 'Cookware & Bakeware', description: 'Pots, pans, baking sheets' },
    { name: 'Small Appliances', description: 'Blenders, toasters, mixers' },
    { name: 'Kitchen Tools', description: 'Knives, utensils, gadgets' },
    { name: 'Tableware', description: 'Plates, glasses, flatware' },
    { name: 'Food Storage', description: 'Containers, wraps, bags' },
    { name: 'Coffee & Tea', description: 'Makers, beans, accessories' },
    { name: 'Wine & Bar', description: 'Glasses, openers, accessories' },
    { name: 'Patio & Lawn', description: 'Furniture, grills, decor' },
    { name: 'Pool & Spa', description: 'Chemicals, equipment, accessories' },
    { name: 'Bird & Wildlife', description: 'Feeders, houses, seed' },
    { name: 'Fresh Flowers', description: 'Bouquets, plants, arrangements' },
    { name: 'Indoor Plants', description: 'Potted plants, planters' },
    { name: 'Party Supplies', description: 'Balloons, tableware, decorations' },
    { name: 'Seasonal Decor', description: 'Holiday and seasonal items' },
    { name: 'Wall Art', description: 'Posters, prints, frames' },
    { name: 'Clocks', description: 'Wall, desk, alarm clocks' },
    { name: 'Mirrors', description: 'Wall mirrors, decorative mirrors' },
    { name: 'Curtains & Blinds', description: 'Window treatments' },
    { name: 'Hardware & Fixtures', description: 'Handles, hinges, fixtures' },
    { name: 'Paint & Supplies', description: 'Paint, brushes, supplies' },
    { name: 'Electrical', description: 'Outlets, switches, wiring' },
    { name: 'Plumbing', description: 'Pipes, fittings, fixtures' },
    { name: 'Industrial & Scientific', description: 'Lab equipment, industrial supplies' },
    { name: 'Renewable Energy', description: 'Solar, batteries, inverters' },
    { name: 'Shoes & Footwear', description: 'Sneakers, boots, sandals' },
    { name: 'Handbags & Wallets', description: 'Purses, clutches, wallets' },
    { name: 'Belts & Suspenders', description: 'Belts, suspenders, accessories' },
    { name: 'Hats & Caps', description: 'Baseball caps, beanies, sun hats' },
    { name: 'Gloves & Scarves', description: 'Winter and fashion accessories' },
    { name: 'Socks & Hosiery', description: 'Socks, tights, stockings' },
    { name: 'Swimwear', description: 'Swimsuits, cover-ups, rash guards' },
    { name: 'Formal Wear', description: 'Suits, dresses, formal attire' },
    { name: 'Workwear', description: 'Uniforms, safety wear, work clothes' },
    { name: 'Luggage', description: 'Suitcases, carry-ons, travel bags' },
    { name: 'Travel Accessories', description: 'Neck pillows, adapters, organizers' },
    { name: 'Binoculars & Optics', description: 'Binoculars, scopes, magnifiers' },
    { name: 'Printers & Ink', description: 'Printers, toner, ink cartridges' },
    { name: 'Paper & Notebooks', description: 'Notebooks, paper, journals' },
    { name: 'Writing Instruments', description: 'Pens, pencils, markers' },
    { name: 'Adhesives & Tape', description: 'Glue, tape, sticky notes' },
    { name: 'Labels & Stickers', description: 'Labels, name tags, stickers' },
    { name: 'Shipping Supplies', description: 'Boxes, tape, mailers' },
  ];
  for (const c of moreCategoryData) {
    categories.push(await prisma.category.create({ data: { ...c, slug: slugify(c.name) } }));
  }
  const [catElectronics, catClothing, catHome, catSports, catBooks, catHealth, catToys, catAuto] =
    categories;

  console.log('Seeding products...');
  const productData = [
    { name: 'Wireless Bluetooth Headphones', categoryId: catElectronics.id },
    { name: 'USB-C Laptop Charger 65W', categoryId: catElectronics.id },
    { name: 'Smart Watch Pro', categoryId: catElectronics.id },
    { name: 'Mechanical Keyboard RGB', categoryId: catElectronics.id },
    { name: 'Portable SSD 1TB', categoryId: catElectronics.id },
    { name: 'Cotton T-Shirt Classic', categoryId: catClothing.id },
    { name: 'Denim Jacket Blue', categoryId: catClothing.id },
    { name: 'Running Sneakers', categoryId: catClothing.id },
    { name: 'Winter Wool Coat', categoryId: catClothing.id },
    { name: 'Yoga Leggings', categoryId: catClothing.id },
    { name: 'Stainless Steel Cookware Set', categoryId: catHome.id },
    { name: 'Air Fryer 5L', categoryId: catHome.id },
    { name: 'LED Desk Lamp', categoryId: catHome.id },
    { name: 'Coffee Maker Drip', categoryId: catHome.id },
    { name: 'Throw Pillow Set of 4', categoryId: catHome.id },
    { name: 'Dumbbells Set 20kg', categoryId: catSports.id },
    { name: 'Camping Tent 4-Person', categoryId: catSports.id },
    { name: 'Yoga Mat Non-Slip', categoryId: catSports.id },
    { name: 'Water Bottle Insulated 1L', categoryId: catSports.id },
    { name: 'The Great Gatsby Paperback', categoryId: catBooks.id },
    { name: 'JavaScript: The Good Parts', categoryId: catBooks.id },
    { name: 'Noise Cancelling Earbuds', categoryId: catElectronics.id },
    { name: 'Face Moisturizer SPF 30', categoryId: catHealth.id },
    { name: 'Multivitamin Daily', categoryId: catHealth.id },
    { name: 'Board Game Strategy', categoryId: catToys.id },
    { name: 'Building Blocks Set', categoryId: catToys.id },
    { name: 'Car Phone Mount', categoryId: catAuto.id },
    { name: 'Dash Cam Full HD', categoryId: catAuto.id },
  ];

  const statuses = ['draft', 'active', 'active', 'active', 'archived'];
  const products = [];
  for (let i = 0; i < productData.length; i++) {
    const p = productData[i];
    const status = statuses[i % statuses.length];
    products.push(
      await prisma.product.create({
        data: {
          name: p.name,
          slug: `${slugify(p.name)}-${i + 1}`,
          description: `Quality ${p.name.toLowerCase()} for everyday use.`,
          categoryId: p.categoryId,
          status,
        },
      })
    );
  }
  const moreProductNames = [
    'Wireless Mouse Ergonomic', 'Laptop Stand Aluminum', 'Bluetooth Speaker Portable', 'Tablet Case Leather', 'Screen Protector Glass',
    'USB Hub 7-Port', 'Webcam HD 1080p', 'Monitor Arm Adjustable', 'Cable Management Kit', 'Desk Mat Extended', 'Ergonomic Office Chair',
    'Standing Desk Converter', 'Power Bank 20000mAh', 'Phone Holder Car', 'Gaming Mouse RGB', 'Keyboard Wrist Rest', 'HDMI Cable 4K',
    'Ethernet Cable Cat6', 'Printer Paper Ream', 'Sticky Notes Pack', 'Ballpoint Pen Set', 'Spiral Notebook Pack', 'File Folders Box',
    'Desktop Stapler', 'Paper Scissors', 'Tape Dispenser', 'Whiteboard Small', 'Dry Erase Markers Set', 'Desk Organizer Tray',
    'Bookshelf 5-Tier', 'Floor Lamp LED', 'Wall Clock Modern', 'Picture Frame Set', 'Area Rug 5x7', 'Curtains Blackout', 'Bed Sheet Set Queen',
    'Duvet Cover Set', 'Memory Foam Pillow', 'Mattress Topper', 'Laundry Hamper', 'Steam Iron', 'Steam Mop', 'Vacuum Bags Pack',
    'Trash Can Stainless', 'Storage Bins Set', 'Shoe Rack 5-Tier', 'Coat Rack Standing', 'Umbrella Stand', 'Door Mat Welcome',
    'Ceramic Plant Pot', 'Garden Hose 50ft', 'Pruning Shears', 'Vegetable Seeds Pack', 'Plant Fertilizer', 'Solar Garden Lights',
    'Grill Cover', 'Picnic Blanket', 'Cooler 24-Can', 'Beach Towel Large', 'Sunscreen SPF 50', 'Polarized Sunglasses', 'Water Sandals',
    'Flip Flops Comfort', 'Swim Trunks', 'Pool Noodle Set', 'Dog Food Dry 15lb', 'Cat Litter Clumping', 'Pet Food Bowl Set',
    'Fish Tank 10 Gallon', 'Bird Feeder Hanging', 'Hamster Cage', 'Dog Leash Nylon', 'Cat Toy Feather', 'Baby Stroller Lightweight',
    'Baby Bottle Set', 'Diaper Pack Size 1', 'Baby Wipes Sensitive', 'Baby Blanket Soft', 'Kids Puzzle 100pc', 'Crayon Set 24',
    'Children\'s Story Book', 'Action Figure Set', 'Teddy Bear Plush', 'Silver Chain Necklace', 'Gold Stud Earrings', 'Leather Bifold Wallet',
    'Sunglasses Case', 'Eau de Toilette', 'Hair Dryer Ionic', 'Electric Toothbrush', 'Nail Polish Set', 'Lip Balm SPF', 'Hand Cream Moisturizing',
    'Shampoo Volumizing', 'Conditioner Repair', 'Body Wash Gel', 'Soap Bar Pack', 'Face Mask Sheet', 'Sewing Kit Basic', 'Fabric Scissors',
    'Yarn Pack Assorted', 'Paint Brush Set', 'Acrylic Paints Set', 'Sketch Pad', 'Glue Gun Mini', 'Craft Paper Pack', 'Button Assortment',
  ];
  for (let i = productData.length; i < 120; i++) {
    const name = moreProductNames[i - productData.length];
    const status = statuses[i % statuses.length];
    products.push(
      await prisma.product.create({
        data: {
          name,
          slug: `${slugify(name)}-${i + 1}`,
          description: `Quality ${name.toLowerCase()} for everyday use.`,
          categoryId: categories[i % categories.length].id,
          status,
        },
      })
    );
  }

  console.log('Seeding product_images...');
  // Real product-relevant images from the internet (Lorem Flickr: keyword-based photos from Flickr)
  const imageKeywords = [
    'wireless,headphones',
    'laptop,charger,cable',
    'smartwatch,watch',
    'keyboard,mechanical',
    'ssd,hardware,storage',
    'tshirt,cotton',
    'denim,jacket',
    'sneakers,running,shoes',
    'coat,wool,winter',
    'yoga,leggings',
    'cookware,pot,kitchen',
    'airfryer,kitchen',
    'lamp,desk,led',
    'coffee,maker',
    'pillow,cushion,home',
    'dumbbells,gym,fitness',
    'tent,camping,outdoor',
    'yoga,mat',
    'bottle,water,outdoor',
    'book,paperback',
    'book,programming,code',
    'earbuds,headphones',
    'moisturizer,skincare,cream',
    'vitamins,supplements',
    'boardgame,game',
    'building,blocks,toys',
    'car,mount,phone',
    'dashcam,car',
  ];
  const loremFlickrBase = 'https://loremflickr.com';
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const keywords = imageKeywords[i % imageKeywords.length];
    const urls = [
      `${loremFlickrBase}/400/400/${keywords}`,
      `${loremFlickrBase}/600/400/${keywords}`,
    ].slice(0, 1 + (i % 2)); // 1 or 2 images per product
    for (let j = 0; j < urls.length; j++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: urls[j],
          alt: `${product.name} - photo ${j + 1}`,
          sortOrder: j,
        },
      });
    }
  }

  console.log('Seeding inventory...');
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const quantity = [3, 5, 8, 15, 25, 50, 100, 200][i % 8];
    const lowStockThreshold = [5, 10, 10, 15, 20][i % 5];
    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity,
        lowStockThreshold,
      },
    });
  }

  console.log('Seeding tags...');
  const tagNames = ['sale', 'new', 'bestseller', 'featured', 'clearance', 'limited', 'organic', 'premium', 'eco-friendly', 'handmade', 'trending', 'gift', 'seasonal', 'exclusive', 'staff-pick'];
  const tags = [];
  for (const name of tagNames) {
    tags.push(await prisma.tag.create({ data: { name, slug: slugify(name) } }));
  }

  console.log('Seeding product_variants...');
  const variants = [];
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const inv = await prisma.inventory.findUnique({ where: { productId: product.id } });
    const qty = inv ? inv.quantity : 10;
    const sku = `SKU-${String(i + 1).padStart(5, '0')}`;
    const barcode = `8${String(i + 1).padStart(11, '0')}`;
    variants.push(
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku,
          barcode,
          name: 'Standard',
          attributes: {},
          quantity: qty,
          reorderPoint: 5,
          reorderQty: 20,
        },
      })
    );
  }

  console.log('Seeding product_tags...');
  for (let i = 0; i < products.length; i++) {
    const tagIds = [tags[i % 3].id, tags[(i + 1) % 5].id];
    for (const tagId of tagIds) {
      await prisma.productTag.upsert({
        where: { productId_tagId: { productId: products[i].id, tagId } },
        create: { productId: products[i].id, tagId },
        update: {},
      }).catch(() => {});
    }
  }

  console.log('Seeding inventory_batches...');
  for (let i = 0; i < Math.min(50, variants.length); i++) {
    const v = variants[i];
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 6);
    await prisma.inventoryBatch.create({
      data: {
        productVariantId: v.id,
        batchNumber: `BATCH-${String(i + 1).padStart(4, '0')}`,
        expiryDate: expiry,
        quantity: Math.min(20, v.quantity),
      },
    });
  }

  console.log('Seeding product_relations...');
  for (let i = 0; i < 60; i++) {
    const a = i % products.length;
    let b = (i * 7 + 11) % products.length;
    if (a === b) b = (b + 1) % products.length;
    try {
      await prisma.productRelation.create({
        data: { productId: products[a].id, relatedProductId: products[b].id, relationType: i % 3 === 0 ? 'upsell' : 'related' },
      });
    } catch (_) {}
  }

  console.log('Seeding customer_groups...');
  const groupNames = ['Retail', 'Wholesale', 'VIP', 'Enterprise', 'Reseller'];
  const customerGroups = [];
  for (const name of groupNames) {
    customerGroups.push(await prisma.customerGroup.create({ data: { name, slug: slugify(name) } }));
  }

  console.log('Seeding customers...');
  const customers = [];
  const companyNames = ['Acme Corp', 'Global Supplies', 'Tech Retail Inc', 'Home & Living Co', 'Fashion Outlet', 'Office Plus', 'Health First', 'Sports Direct'];
  for (let i = 0; i < 50; i++) {
    const group = customerGroups[i % customerGroups.length];
    customers.push(
      await prisma.customer.create({
        data: {
          customerGroupId: group.id,
          companyName: companyNames[i % companyNames.length] + (i > 7 ? ` ${i}` : ''),
          contactName: `Contact ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          phone: `+1-555-${String(i).padStart(3, '0')}`,
          userId: i < 10 ? users[i].id : null,
        },
      })
    );
  }

  console.log('Seeding customer_addresses...');
  for (let i = 0; i < customers.length; i++) {
    await prisma.customerAddress.create({
      data: {
        customerId: customers[i].id,
        label: 'Primary',
        line1: `${100 + i} Main St`,
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        isDefault: true,
      },
    });
    if (i % 2 === 0) {
      await prisma.customerAddress.create({
        data: {
          customerId: customers[i].id,
          label: 'Billing',
          line1: `${200 + i} Oak Ave`,
          city: 'Brooklyn',
          state: 'NY',
          postalCode: '11201',
          country: 'USA',
          isDefault: false,
        },
      });
    }
  }

  console.log('Seeding coupons...');
  const couponCodes = ['WELCOME10', 'SAVE20', 'FLAT50', 'SUMMER25', 'FREESHIP', 'BULK15', 'NEWUSER', 'VIP30', 'HOLIDAY40', 'CLEARANCE', 'EXTRA5', 'MEGA20', 'SHIPFREE', 'DEAL10', 'OFF25'];
  const coupons = [];
  for (let i = 0; i < couponCodes.length; i++) {
    const isPercent = i % 2 === 0;
    coupons.push(
      await prisma.coupon.create({
        data: {
          code: couponCodes[i],
          discountType: isPercent ? 'PERCENT' : 'FIXED',
          value: isPercent ? 10 + (i % 20) : 5 + i * 2,
          minOrderAmount: i % 3 === 0 ? 50 : null,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          maxUses: i % 4 === 0 ? 100 : null,
          isActive: true,
        },
      })
    );
  }

  console.log('Seeding orders...');
  const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  const unitPrices = [9.99, 14.99, 29.99, 49.99, 79.99, 99.99, 19.99, 34.99];
  const orderUserPool = [adminUser, managerUser, editorUser, users[6], users[7]];
  for (let o = 0; o < 100; o++) {
    const numItems = 1 + (o % 4);
    const status = orderStatuses[o % orderStatuses.length];
    const orderUser = orderUserPool[o % orderUserPool.length];
    const createdAt = new Date(Date.now() - (o + 1) * 24 * 60 * 60 * 1000);
    const customerId = o % 3 === 0 && customers[customers.length - 1] ? customers[o % customers.length].id : null;
    const shippingAddress = customerId ? { line1: '123 Ship St', city: 'Boston', state: 'MA', postalCode: '02101', country: 'USA' } : null;
    const order = await prisma.order.create({
      data: {
        userId: orderUser.id,
        customerId,
        status,
        totalAmount: null,
        shippingAddress,
        customerNote: o % 5 === 0 ? 'Please deliver after 5pm' : null,
        createdAt,
      },
    });
    let totalAmount = 0;
    const usedIndex = new Set();
    for (let k = 0; k < numItems; k++) {
      let idx = (o * 2 + k * 7) % products.length;
      while (usedIndex.has(idx)) idx = (idx + 1) % products.length;
      usedIndex.add(idx);
      const product = products[idx];
      const qty = 1 + (k % 3);
      const unitPrice = unitPrices[(o + k) % unitPrices.length];
      const totalPrice = Math.round(unitPrice * qty * 100) / 100;
      totalAmount += totalPrice;
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: qty,
          unitPrice: unitPrice,
          totalPrice,
        },
      });
    }
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount },
    });
    await prisma.orderStatusHistory.create({
      data: { orderId: order.id, fromStatus: null, toStatus: 'pending', changedAt: createdAt },
    });
    if (status !== 'pending') {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: 'pending',
          toStatus: status,
          changedAt: new Date(createdAt.getTime() + 60 * 60 * 1000),
        },
      });
    }
  }

  console.log('Seeding product_status_history...');
  const statusHistory = [
    { from: null, to: 'draft' },
    { from: 'draft', to: 'active' },
    { from: 'active', to: 'archived' },
  ];
  for (let i = 0; i < 100; i++) {
    const product = products[i % products.length];
    const h = statusHistory[i % 3];
    await prisma.productStatusHistory.create({
      data: {
        productId: product.id,
        fromStatus: h.from,
        toStatus: h.to,
        changedAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log('Seeding activity_logs...');
  const logUsers = [adminUser, managerUser, editorUser, superadminUser];
  const activityLogs = [
    {
      user: adminUser,
      action: 'update',
      entity: 'product',
      entityId: products[0]?.id,
      changeSummary: 'Product name and description updated',
      oldValues: { name: 'Wireless Headphones', description: 'Basic wireless headphones', status: 'draft' },
      newValues: { name: 'Wireless Bluetooth Headphones', description: 'Quality wireless bluetooth headphones for everyday use.', status: 'active' },
    },
    {
      user: managerUser,
      action: 'status_change',
      entity: 'product',
      entityId: products[1]?.id,
      changeSummary: 'Product status changed from draft to active',
      oldValues: { status: 'draft' },
      newValues: { status: 'active' },
    },
    {
      user: editorUser,
      action: 'create',
      entity: 'product',
      entityId: products[5]?.id,
      changeSummary: 'New product created',
      oldValues: null,
      newValues: { name: 'Cotton T-Shirt Classic', categoryId: catClothing.id, status: 'active' },
    },
    {
      user: adminUser,
      action: 'stock_update',
      entity: 'inventory',
      entityId: products[0]?.id,
      changeSummary: 'Inventory quantity updated',
      oldValues: { quantity: 10 },
      newValues: { quantity: 25, lowStockThreshold: 5 },
    },
    {
      user: superadminUser,
      action: 'update',
      entity: 'category',
      entityId: catElectronics.id,
      changeSummary: 'Category description updated',
      oldValues: { description: 'Electronics and gadgets' },
      newValues: { description: 'Phones, laptops, gadgets' },
    },
    {
      user: managerUser,
      action: 'delete',
      entity: 'product',
      entityId: null,
      changeSummary: 'Product archived and removed from listing',
      oldValues: { name: 'Old Discontinued Item', status: 'active' },
      newValues: { status: 'archived' },
    },
    {
      user: editorUser,
      action: 'update',
      entity: 'product',
      entityId: products[2]?.id,
      changeSummary: 'Product description and status updated',
      oldValues: { description: 'Smart watch', status: 'draft' },
      newValues: { description: 'Quality smart watch pro for everyday use.', status: 'active' },
    },
    {
      user: adminUser,
      action: 'status_change',
      entity: 'product',
      entityId: products[10]?.id,
      changeSummary: 'Product status changed from active to archived',
      oldValues: { status: 'active' },
      newValues: { status: 'archived' },
    },
  ];
  for (let i = 0; i < 100; i++) {
    const template = activityLogs[i % activityLogs.length];
    const user = logUsers[i % logUsers.length];
    const product = products[i % products.length];
    const createdAt = new Date(Date.now() - (i + 1) * 60 * 60 * 1000);
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: template.action,
        entity: template.entity,
        entityId: template.entityId ?? product?.id ?? null,
        changeSummary: template.changeSummary,
        oldValues: template.oldValues,
        newValues: template.newValues,
        metadata: { ip: '127.0.0.1', userAgent: 'Seed' },
        createdAt,
      },
    });
  }

  console.log('Seeding notifications...');
  const notifTitles = [
    'Low stock alert',
    'Product approved',
    'New order received',
    'Price change',
    'Category updated',
    'Inventory sync complete',
    'Weekly report ready',
  ];
  for (let i = 0; i < 100; i++) {
    const user = users[i % users.length];
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: notifTitles[i % notifTitles.length],
        body: `Notification details for ${user.name} (#${i + 1}).`,
        read: i % 3 === 0,
        createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
      },
    });
  }

  console.log('Seeding analytics_events...');
  const eventTypes = [
    'page_view',
    'product_view',
    'category_view',
    'search',
    'add_to_cart',
    'checkout_start',
  ];
  for (let i = 0; i < 100; i++) {
    const type = eventTypes[i % eventTypes.length];
    await prisma.analyticsEvent.create({
      data: {
        eventType: type,
        entity: type === 'product_view' ? 'product' : type === 'category_view' ? 'category' : null,
        entityId: type === 'product_view' ? products[i % products.length]?.id : type === 'category_view' ? categories[i % categories.length]?.id : null,
        payload: { source: 'web', sessionId: `sess-${i}` },
        createdAt: new Date(Date.now() - i * 30 * 60 * 1000),
      },
    });
  }

  console.log('Seeding reviews...');
  for (let i = 0; i < 80; i++) {
    const product = products[i % products.length];
    const user = users[i % users.length];
    try {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: 1 + (i % 5),
          comment: i % 3 === 0 ? `Great product! Seed review ${i + 1}.` : null,
          createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
        },
      });
    } catch (_) {}
  }

  console.log('Seeding wishlist_items...');
  for (let i = 0; i < 75; i++) {
    const user = users[i % users.length];
    const product = products[(i * 3) % products.length];
    try {
      await prisma.wishlistItem.create({
        data: { userId: user.id, productId: product.id },
      });
    } catch (_) {}
  }

  console.log('Seeding price_lists...');
  const priceLists = [];
  const plNames = ['Retail Default', 'Wholesale', 'VIP Pricing', 'Promo Q1', 'B2B'];
  for (let i = 0; i < plNames.length; i++) {
    priceLists.push(
      await prisma.priceList.create({
        data: {
          name: plNames[i],
          customerGroupId: i > 0 ? customerGroups[i - 1].id : null,
          isDefault: i === 0,
        },
      })
    );
  }
  for (let i = 0; i < 40; i++) {
    const pl = priceLists[i % priceLists.length];
    const v = variants[i % variants.length];
    const basePrice = 10 + (i % 90);
    const price = pl.name.includes('Wholesale') ? basePrice * 0.85 : pl.name.includes('VIP') ? basePrice * 0.9 : basePrice;
    try {
      await prisma.priceListItem.upsert({
        where: { priceListId_productVariantId: { priceListId: pl.id, productVariantId: v.id } },
        create: { priceListId: pl.id, productVariantId: v.id, price },
        update: { price },
      });
    } catch (_) {}
  }

  console.log('Seeding invoice_counter...');
  await prisma.invoiceCounter.upsert({
    where: { organizationId: defaultOrg.id },
    create: { organizationId: defaultOrg.id, nextNumber: 1 },
    update: {},
  }).catch(() => {});

  console.log('Seed completed successfully.');
};

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
