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
  await prisma.analyticsEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.productStatusHistory.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
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
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'superadmin@company.com',
        password: passwordHash,
        name: 'Super Admin',
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@company.com',
        password: passwordHash,
        name: 'Alex Admin',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.manager@company.com',
        password: passwordHash,
        name: 'Sarah Manager',
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.editor@company.com',
        password: passwordHash,
        name: 'James Editor',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma.viewer@company.com',
        password: passwordHash,
        name: 'Emma Viewer',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.support@company.com',
        password: passwordHash,
        name: 'Mike Support',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa@company.com',
        password: passwordHash,
        name: 'Lisa Chen',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david@company.com',
        password: passwordHash,
        name: 'David Park',
      },
    }),
    prisma.user.create({
      data: {
        email: 'olivia@company.com',
        password: passwordHash,
        name: 'Olivia Brown',
      },
    }),
  ]);
  const [superadminUser, adminUser, managerUser, editorUser, viewerUser, supportUser] = users;

  console.log('Seeding user_roles...');
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

  console.log('Seeding sessions...');
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  await prisma.session.createMany({
    data: [
      { userId: superadminUser.id, token: 'session-superadmin-1', expiresAt: nextWeek },
      { userId: adminUser.id, token: 'session-admin-1', expiresAt: nextWeek },
      { userId: managerUser.id, token: 'session-mgr-1', expiresAt: nextWeek },
      { userId: editorUser.id, token: 'session-edit-1', expiresAt: nextWeek },
      { userId: viewerUser.id, token: 'session-expired', expiresAt: lastWeek },
      { userId: supportUser.id, token: 'session-support-1', expiresAt: nextWeek },
    ],
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
    categories.push(
      await prisma.category.create({
        data: { ...c, slug: slugify(c.name) },
      })
    );
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

  console.log('Seeding product_images...');
  const imageBase = 'https://picsum.photos/seed';
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const count = 2 + (i % 3);
    for (let j = 0; j < count; j++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `${imageBase}/${product.id}-${j}/400/400`,
          alt: `${product.name} - view ${j + 1}`,
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

  console.log('Seeding product_status_history...');
  const statusHistory = [
    { from: null, to: 'draft' },
    { from: 'draft', to: 'active' },
    { from: 'active', to: 'archived' },
  ];
  for (let i = 0; i < Math.min(20, products.length); i++) {
    const product = products[i];
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
  const actions = ['create', 'update', 'delete', 'view', 'status_change', 'stock_update'];
  const entities = ['product', 'category', 'user', 'inventory'];
  for (let i = 0; i < 60; i++) {
    const user = users[i % users.length];
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: actions[i % actions.length],
        entity: entities[i % entities.length],
        entityId: products[i % products.length]?.id ?? null,
        metadata: { ip: '127.0.0.1', userAgent: 'Seed' },
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
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
  for (let i = 0; i < 35; i++) {
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
  for (let i = 0; i < 80; i++) {
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
