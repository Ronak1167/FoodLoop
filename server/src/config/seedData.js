import bcrypt from 'bcryptjs';
import { Users, Restaurants, MenuItems, Orders, GroupOrders, Categories, Reviews } from '../db/storage.js';

export async function seedDatabase(force = false) {
  const existingRestaurants = await Restaurants.countDocuments();
  if (existingRestaurants >= 15 && !force) {
    console.log(`Database already has ${existingRestaurants} restaurants. Skipping seed.`);
    return;
  }

  console.log('Seeding rich 18-restaurant dataset with complete menus & DSA road network for FoodLoop...');

  await Users.deleteMany({});
  await Restaurants.deleteMany({});
  await MenuItems.deleteMany({});
  await Orders.deleteMany({});
  await GroupOrders.deleteMany({});
  await Categories.deleteMany({});
  await Reviews.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users (Customer, Owners, Multiple Delivery Partners across different Nodes, Admin)
  const customer1 = await Users.create({
    name: 'Aarav Sharma',
    email: 'customer@foodloop.com',
    password: passwordHash,
    role: 'customer',
    phone: '+91 98765 43210',
    address: {
      street: '42 Lotus Boulevard, Tower 5',
      city: 'Gurugram',
      state: 'Haryana',
      zipCode: '122002',
      coordinates: [77.076, 28.460] // Node N7 (Sushant Lok)
    },
    dietaryPreference: 'veg',
    favoriteCuisines: ['Healthy Bowls', 'North Indian', 'Artisan Bakery'],
    rewardPoints: 340,
    totalMealsRescued: 9,
    totalWasteSavedKg: 4.1
  });

  // JIIT CSE B.Tech 2nd Year Team Member Accounts (All passwords: password123)
  const teamMembers = [
    { name: 'Ronak Jain (2501030128)', email: 'ronak@jiit.ac.in', role: 'admin', rewardPoints: 1280 },
    { name: 'Pragya Ahlawat (2501030121)', email: 'pragya@jiit.ac.in', role: 'customer', rewardPoints: 1210 },
    { name: 'Rishabh Tyagi (2501030130)', email: 'rishabh@jiit.ac.in', role: 'restaurant_owner', rewardPoints: 1300 },
    { name: 'Shobhit Khatana (2501030144)', email: 'shobhit@jiit.ac.in', role: 'delivery_partner', rewardPoints: 1440 }
  ];
  for (const tm of teamMembers) {
    await Users.create({
      ...tm,
      password: passwordHash,
      phone: '+91 98765 00000',
      dietaryPreference: 'veg',
      address: { street: 'JIIT Campus, Sector 62', city: 'Noida', state: 'Uttar Pradesh', zipCode: '201309' }
    });
  }

  const owner1 = await Users.create({
    name: 'Chef Maya Patel',
    email: 'greenbowl@foodloop.com',
    password: passwordHash,
    role: 'restaurant_owner',
    phone: '+91 98111 22334',
    address: { street: 'Shop 12, Galleria Market, DLF 4', city: 'Gurugram', state: 'Haryana', zipCode: '122002' }
  });

  // Multiple Delivery Partners distributed across Road Network Nodes for Dijkstra Allocation:
  const deliveryPartnersData = [
    {
      name: 'Rohan Das',
      email: 'delivery@foodloop.com',
      phone: '+91 98444 55667',
      vehicle: 'Ather 450X (100% Zero-Emission EV)',
      activeStatus: 'available',
      assignedNode: 'N2', // Galleria Market (0.2 km from N2)
      currentLocation: { lat: 28.4715, lng: 77.0862 },
      activeDeliveriesCount: 0,
      completedDeliveries: 42,
      rating: 4.9,
      totalEarnings: 3820
    },
    {
      name: 'Amit Kumar',
      email: 'amit.delivery@foodloop.com',
      phone: '+91 98444 11223',
      vehicle: 'Ola S1 Pro (100% Electric EV)',
      activeStatus: 'available',
      assignedNode: 'N5', // MG Road Junction (2.1 km away)
      currentLocation: { lat: 28.4820, lng: 77.0805 },
      activeDeliveriesCount: 1,
      completedDeliveries: 35,
      rating: 4.8,
      totalEarnings: 2940
    },
    {
      name: 'Priya Sundaram',
      email: 'priya.delivery@foodloop.com',
      phone: '+91 98444 33445',
      vehicle: 'TVS iQube Electric Scooter',
      activeStatus: 'available',
      assignedNode: 'N1', // DLF Cyber City (3.5 km away)
      currentLocation: { lat: 28.4950, lng: 77.0880 },
      activeDeliveriesCount: 0,
      completedDeliveries: 51,
      rating: 4.95,
      totalEarnings: 4420
    },
    {
      name: 'Vikas Mehra',
      email: 'vikas.delivery@foodloop.com',
      phone: '+91 98444 77889',
      vehicle: 'Hero Electric Optima EV',
      activeStatus: 'available',
      assignedNode: 'N7', // Sushant Lok 1 (1.6 km away)
      currentLocation: { lat: 28.4600, lng: 77.0760 },
      activeDeliveriesCount: 2,
      completedDeliveries: 28,
      rating: 4.7,
      totalEarnings: 2150
    },
    {
      name: 'Sunil Yadav',
      email: 'sunil.delivery@foodloop.com',
      phone: '+91 98444 99001',
      vehicle: 'Standard 110cc Petrol Scooter',
      activeStatus: 'available',
      assignedNode: 'N4', // Sector 29 (2.3 km away)
      currentLocation: { lat: 28.4680, lng: 77.0620 },
      activeDeliveriesCount: 0,
      completedDeliveries: 19,
      rating: 4.6,
      totalEarnings: 1650
    }
  ];

  const createdDeliveryPartners = [];
  for (const dp of deliveryPartnersData) {
    const userDoc = await Users.create({
      ...dp,
      password: passwordHash,
      role: 'delivery_partner'
    });
    createdDeliveryPartners.push(userDoc);
  }

  const admin = await Users.create({
    name: 'Anthea Loop',
    email: 'admin@foodloop.com',
    password: passwordHash,
    role: 'admin',
    phone: '+91 99999 88888',
    title: 'Platform Director & SDG Compliance Lead'
  });

  // 2. Categories
  const categoriesData = [
    { name: 'Surplus Deals', slug: 'surplus', icon: 'Flame', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'Healthy Bowls', slug: 'healthy-bowls', icon: 'Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'Artisan Bakery', slug: 'bakery', icon: 'Croissant', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'North Indian', slug: 'north-indian', icon: 'Utensils', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'Italian & Pizza', slug: 'italian', icon: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'South Indian', slug: 'south-indian', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'Pan-Asian & Sushi', slug: 'pan-asian', icon: 'Soup', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'Mediterranean', slug: 'mediterranean', icon: 'Sun', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80', active: true },
    { name: 'Cold-Pressed Juices', slug: 'juices', icon: 'CupSoda', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=400&q=80', active: true },
  ];
  for (const c of categoriesData) await Categories.create(c);

  // 3. 18 Realistic Restaurants Across All 16 Road Graph Nodes
  const restaurantsData = [
    {
      idKey: 'rest1',
      name: 'GreenBowl Organic & Bowls',
      description: 'Farm-fresh superfood bowls, crisp organic salads, and nutrient-dense wraps with zero-waste kitchen practices.',
      nodeId: 'N2', // Galleria Market
      address: { street: 'Shop 12, Galleria Market, DLF Phase 4', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.086, 28.471] },
      cuisines: ['Healthy Bowls', 'Salads', 'Vegan', 'Eco-Certified'],
      rating: 4.8, totalRatings: 284, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 420, wastePreventedKg: 189.5, deliveryTime: '25 mins', deliveryFee: 30
    },
    {
      idKey: 'rest2',
      name: 'The Earth Hearth Bakery',
      description: 'Artisanal sourdough, French viennoiserie, and wholesome whole-grain baguettes baked fresh daily.',
      nodeId: 'N6', // DLF Phase 1 Green Park
      address: { street: '15 Silver Oaks Plaza, DLF Phase 1', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.102, 28.483] },
      cuisines: ['Artisan Bakery', 'Desserts', 'Breakfast', 'Zero-Plastic'],
      rating: 4.9, totalRatings: 395, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 20, mealsRescuedCount: 680, wastePreventedKg: 298.0, deliveryTime: '20 mins', deliveryFee: 35
    },
    {
      idKey: 'rest3',
      name: 'Spice Loop Conscious Curry',
      description: 'Heritage clay pot curries, organic whole-wheat rotis, and sustainable slow-simmered biryanis.',
      nodeId: 'N4', // Sector 29 Food Hub
      address: { street: '78 Sector 29 Food Hub', city: 'Gurugram', state: 'Haryana', zipCode: '122001', coordinates: [77.062, 28.468] },
      cuisines: ['North Indian', 'Curry', 'Biryani', 'Traditional'],
      rating: 4.7, totalRatings: 310, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 25, mealsRescuedCount: 540, wastePreventedKg: 243.2, deliveryTime: '30 mins', deliveryFee: 30
    },
    {
      idKey: 'rest4',
      name: 'Trattoria Bella Terra',
      description: 'Authentic sourdough Neapolitan pizzas, hand-rolled pasta, and organic basil pestos cooked in eco-friendly ovens.',
      nodeId: 'N3', // Golf Course Road North
      address: { street: 'One Horizon Center, Golf Course Road', city: 'Gurugram', state: 'Haryana', zipCode: '122003', coordinates: [77.098, 28.468] },
      cuisines: ['Italian & Pizza', 'Pasta', 'Mediterranean'],
      rating: 4.8, totalRatings: 240, priceRange: '$$$',
      bannerImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 20, mealsRescuedCount: 310, wastePreventedKg: 139.5, deliveryTime: '30 mins', deliveryFee: 40
    },
    {
      idKey: 'rest5',
      name: 'Dakshin Earth Tiffin House',
      description: 'Fermented ragi dosas, organic ghee podi idlis, and coconut-based traditional coastal delicacies.',
      nodeId: 'N7', // Sushant Lok 1 Center
      address: { street: 'Plaza 54, Sushant Lok Phase 1', city: 'Gurugram', state: 'Haryana', zipCode: '122009', coordinates: [77.076, 28.460] },
      cuisines: ['South Indian', 'Breakfast', 'Healthy Bowls'],
      rating: 4.6, totalRatings: 420, priceRange: '$',
      bannerImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 10, mealsRescuedCount: 610, wastePreventedKg: 274.5, deliveryTime: '20 mins', deliveryFee: 25
    },
    {
      idKey: 'rest6',
      name: 'Zenith Asian Wok & Sushi',
      description: 'Sustainably sourced salmon nigiri, steam-basket dim sum, and wok-tossed soba noodles in compostable containers.',
      nodeId: 'N1', // DLF Cyber City Hub
      address: { street: 'Building 10B, Cyber Hub, DLF Phase 2', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.088, 28.495] },
      cuisines: ['Pan-Asian & Sushi', 'Sushi', 'Japanese', 'Healthy Bowls'],
      rating: 4.85, totalRatings: 520, priceRange: '$$$',
      bannerImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 25, mealsRescuedCount: 480, wastePreventedKg: 216.0, deliveryTime: '28 mins', deliveryFee: 40
    },
    {
      idKey: 'rest7',
      name: 'Olive & Fig Mediterranean Kitchen',
      description: 'Spiced falafel platters, silky tahini hummus, and charred vegetable shish kebabs with warm pita bread.',
      nodeId: 'N5', // MG Road Metro Junction
      address: { street: 'MGF Metropolitan Mall, MG Road', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.080, 28.482] },
      cuisines: ['Mediterranean', 'Wraps', 'Salads', 'Healthy Bowls'],
      rating: 4.7, totalRatings: 195, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 290, wastePreventedKg: 130.5, deliveryTime: '22 mins', deliveryFee: 30
    },
    {
      idKey: 'rest8',
      name: 'Taqueria Verde Organic Tacos',
      description: 'Fresh corn tortillas, guacamole, chipotle grilled jackfruit bowls, and slow-roasted salsa verde.',
      nodeId: 'N10', // Sector 54 Rapid Metro
      address: { street: 'South Point Mall, Golf Course Road', city: 'Gurugram', state: 'Haryana', zipCode: '122011', coordinates: [77.112, 28.448] },
      cuisines: ['Mexican', 'Healthy Bowls', 'Tacos'],
      rating: 4.65, totalRatings: 180, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 320, wastePreventedKg: 144.0, deliveryTime: '25 mins', deliveryFee: 35
    },
    {
      idKey: 'rest9',
      name: 'Pure Root Macrobiotic Cafe',
      description: 'Holistic plant-based nutrition, miso broths, steamed greens, and sprouted ancient grains.',
      nodeId: 'N8', // Sector 43 Millennium Hub
      address: { street: 'Sector 43 Main Market', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.068, 28.455] },
      cuisines: ['Vegan', 'Healthy Bowls', 'Macrobiotic'],
      rating: 4.9, totalRatings: 165, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 410, wastePreventedKg: 184.5, deliveryTime: '24 mins', deliveryFee: 30
    },
    {
      idKey: 'rest10',
      name: 'The Himalayan Clay Pot',
      description: 'Steamed Tibetan dumplings, aromatic nettle thukpa, and buckwheat noodles inspired by Ladakh cuisine.',
      nodeId: 'N9', // Golf Course Ext Road
      address: { street: 'Emaar Palm Springs Plaza, Golf Course Ext', city: 'Gurugram', state: 'Haryana', zipCode: '122101', coordinates: [77.095, 28.435] },
      cuisines: ['Pan-Asian & Sushi', 'Soups', 'Healthy Bowls'],
      rating: 4.75, totalRatings: 210, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 20, mealsRescuedCount: 275, wastePreventedKg: 123.8, deliveryTime: '30 mins', deliveryFee: 35
    },
    {
      idKey: 'rest11',
      name: 'Brew & Bloom Clean Roastery',
      description: 'Specialty shade-grown single-origin coffee, almond croissants, and avocado brioche tartines.',
      nodeId: 'N12', // Ardee City & Sector 52
      address: { street: 'Ardee Mall Ground Floor, Sector 52', city: 'Gurugram', state: 'Haryana', zipCode: '122003', coordinates: [77.082, 28.442] },
      cuisines: ['Artisan Bakery', 'Cold-Pressed Juices', 'Breakfast'],
      rating: 4.8, totalRatings: 330, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 450, wastePreventedKg: 202.5, deliveryTime: '18 mins', deliveryFee: 25
    },
    {
      idKey: 'rest12',
      name: 'Nourish Cold-Pressed Juice Bar',
      description: 'Unpasteurized raw juices, wellness shots, organic coconut kefir, and antioxidant acai bowls.',
      nodeId: 'N15', // Udyog Vihar Green Phase
      address: { street: 'Sector 18 Commercial Complex, Udyog Vihar', city: 'Gurugram', state: 'Haryana', zipCode: '122015', coordinates: [77.078, 28.508] },
      cuisines: ['Cold-Pressed Juices', 'Healthy Bowls', 'Vegan'],
      rating: 4.85, totalRatings: 175, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 10, mealsRescuedCount: 380, wastePreventedKg: 133.0, deliveryTime: '22 mins', deliveryFee: 30
    },
    {
      idKey: 'rest13',
      name: 'Punjab Heritage Conscious Kitchen',
      description: 'Slow-cooked Dal Makhani, Amritsari organic kulchas, and tandoori paneer tikka prepared with farm-sourced milk.',
      nodeId: 'N14', // Sector 14 Heritage Market
      address: { street: 'Main Circular Road, Sector 14 Market', city: 'Gurugram', state: 'Haryana', zipCode: '122001', coordinates: [77.045, 28.478] },
      cuisines: ['North Indian', 'Curry', 'Traditional'],
      rating: 4.6, totalRatings: 490, priceRange: '$',
      bannerImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 520, wastePreventedKg: 234.0, deliveryTime: '25 mins', deliveryFee: 30
    },
    {
      idKey: 'rest14',
      name: 'Bao Craft Eco Street Kitchen',
      description: 'Fluffy steamed lotus buns filled with teriyaki mushrooms, crispy tofu, and pickled cucumber salad.',
      nodeId: 'N16', // Ambience Island North
      address: { street: 'Ambience Island Food Court, NH-48', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.096, 28.505] },
      cuisines: ['Pan-Asian & Sushi', 'Street Food'],
      rating: 4.7, totalRatings: 280, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 340, wastePreventedKg: 153.0, deliveryTime: '28 mins', deliveryFee: 35
    },
    {
      idKey: 'rest15',
      name: 'Sohna Farmstead Grill',
      description: 'Charcoal-grilled cottage cheese skewers, wood-smoked vegetables, and fresh rosemary flatbreads.',
      nodeId: 'N13', // Sohna Road Tech Park
      address: { street: 'Vipul Tech Square, Sohna Road', city: 'Gurugram', state: 'Haryana', zipCode: '122018', coordinates: [77.042, 28.425] },
      cuisines: ['North Indian', 'Grill', 'Healthy Bowls'],
      rating: 4.65, totalRatings: 190, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 20, mealsRescuedCount: 290, wastePreventedKg: 130.5, deliveryTime: '32 mins', deliveryFee: 40
    },
    {
      idKey: 'rest16',
      name: 'Soul Sourdough & Patisserie',
      description: 'Stoneground artisanal baguettes, pistachio babka, and vegan dark chocolate entremets.',
      nodeId: 'N11', // Sector 56 Terminal South
      address: { street: 'Huda Market, Sector 56', city: 'Gurugram', state: 'Haryana', zipCode: '122011', coordinates: [77.110, 28.428] },
      cuisines: ['Artisan Bakery', 'Desserts'],
      rating: 4.9, totalRatings: 310, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 460, wastePreventedKg: 207.0, deliveryTime: '22 mins', deliveryFee: 30
    },
    {
      idKey: 'rest17',
      name: 'Indus Vegan Thali Co.',
      description: 'Wholesome millet thalis, sprouted moong curry, seasonal gourd sabzi, and digestive herbal buttermilk.',
      nodeId: 'N4', // Sector 29
      address: { street: 'Sector 29 Eco Commercial Complex', city: 'Gurugram', state: 'Haryana', zipCode: '122001', coordinates: [77.062, 28.468] },
      cuisines: ['Vegan', 'North Indian', 'Healthy Bowls'],
      rating: 4.75, totalRatings: 220, priceRange: '$',
      bannerImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 10, mealsRescuedCount: 390, wastePreventedKg: 175.5, deliveryTime: '20 mins', deliveryFee: 25
    },
    {
      idKey: 'rest18',
      name: 'The Mediterranean Breeze',
      description: 'Greek salads with Kalamata olives, grilled halloumi wraps, and stuffed vine leaves in compostable boxes.',
      nodeId: 'N2', // Galleria Market
      address: { street: 'Galleria 2nd Floor, DLF 4', city: 'Gurugram', state: 'Haryana', zipCode: '122002', coordinates: [77.086, 28.471] },
      cuisines: ['Mediterranean', 'Healthy Bowls', 'Salads'],
      rating: 4.8, totalRatings: 265, priceRange: '$$',
      bannerImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
      ecoPackagingAvailable: true, ecoPackagingFee: 15, mealsRescuedCount: 350, wastePreventedKg: 157.5, deliveryTime: '24 mins', deliveryFee: 30
    }
  ];

  const createdRestaurantsMap = {};
  for (const rData of restaurantsData) {
    const { idKey, ...data } = rData;
    const rDoc = await Restaurants.create({
      ...data,
      ownerId: owner1._id,
      status: 'approved',
      minOrder: 150
    });
    createdRestaurantsMap[idKey] = rDoc;
  }

  // Helper deadlines for Food Rescue Deals
  const deadlineShort = new Date(Date.now() + 2.2 * 3600 * 1000).toISOString();
  const deadlineMed = new Date(Date.now() + 3.8 * 3600 * 1000).toISOString();
  const deadlineLong = new Date(Date.now() + 5.2 * 3600 * 1000).toISOString();

  // 4. Menu Items (8-10 Items Per Restaurant with Food Rescue Surplus Deals!)
  const menuTemplates = [
    // --- Rest 1: GreenBowl ---
    { restKey: 'rest1', name: 'Avocado Quinoa Power Bowl', price: 320, isVeg: true, category: 'Healthy Bowls', calories: 420, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', description: 'Tri-color quinoa, Hass avocado, organic edamame, cherry tomatoes, and lemon tahini dressing.' },
    { restKey: 'rest1', name: 'Roasted Mediterranean Tofu Wrap', price: 260, isVeg: true, category: 'Healthy Bowls', calories: 380, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', description: 'Spiced grilled organic tofu, hummus, baby spinach, roasted bell peppers in spinach tortilla.' },
    { restKey: 'rest1', name: 'Zesty Kale & Wild Rice Caesar', price: 280, isVeg: true, category: 'Salads', calories: 340, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', description: 'Tender massaged curly kale, crispy chickpea croutons, cashew parmesan, and wild rice.' },
    { restKey: 'rest1', name: 'Smoked Paprika Sweet Potato Wedges', price: 180, isVeg: true, category: 'Healthy Bowls', calories: 250, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', description: 'Oven-baked sweet potato wedges dusted with smoked Spanish paprika and vegan chipotle dip.' },
    { restKey: 'rest1', name: 'Green Goddess Detox Smoothie (400ml)', price: 190, isVeg: true, category: 'Cold-Pressed Juices', calories: 160, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80', description: 'Celery, green apple, cucumber, spinach, spirulina, and crushed ice.' },
    { restKey: 'rest1', name: 'Berry Bliss Chia Seed Pudding', price: 210, isVeg: true, category: 'Healthy Bowls', calories: 220, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', description: 'Coconut milk soaked chia seeds topped with fresh wild blueberry compote and toasted coconut.' },
    { restKey: 'rest1', name: 'Grilled Herb Chicken Protein Bowl', price: 360, isVeg: false, category: 'Healthy Bowls', calories: 480, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', description: 'Farm-raised chicken breast marinated in fresh rosemary, served with brown rice and steamed broccoli.' },
    { restKey: 'rest1', name: 'Chef Surplus: Sunset Harvest Quinoa Bowl', price: 150, originalPrice: 320, discountPercentage: 53, isVeg: true, isSurplus: true, surplusQuantity: 6, surplusDeadline: deadlineShort, category: 'Surplus Deals', calories: 410, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', description: 'Batch prepared at 12:15 PM today. Kept in climate-controlled eco container.', preparationInfo: 'Cooked fresh today in lunch shift. Sealed in biodegradable sugarcane containers.', safetyGuarantee: 'FSSAI Certified Safe Surplus - 100% edible and fresh.' },

    // --- Rest 2: The Earth Hearth Bakery ---
    { restKey: 'rest2', name: 'Wild Ferment Sourdough Loaf (700g)', price: 240, isVeg: true, category: 'Artisan Bakery', calories: 180, image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80', description: '36-hour slow fermented sourdough with golden blistered crust and light airy crumb.' },
    { restKey: 'rest2', name: 'French Butter Croissant (Pack of 2)', price: 190, isVeg: true, category: 'Artisan Bakery', calories: 320, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', description: 'Laminated dough with 27 golden flaky butter layers and airy center.' },
    { restKey: 'rest2', name: 'Dark Chocolate Hazelnut Babka Slice', price: 160, isVeg: true, category: 'Artisan Bakery', calories: 340, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', description: 'Brioche dough swirled with Belgian 70% dark chocolate ganache and roasted hazelnuts.' },
    { restKey: 'rest2', name: 'Whole Wheat Olive & Herb Focaccia', price: 210, isVeg: true, category: 'Artisan Bakery', calories: 260, image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80', description: 'Extra virgin olive oil drenched focaccia topped with Kalamata olives and sea salt.' },
    { restKey: 'rest2', name: 'Almond Frangipane Tart Slice', price: 195, isVeg: true, category: 'Artisan Bakery', calories: 310, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', description: 'Crisp shortcrust filled with creamy almond paste and topped with toasted almond flakes.' },
    { restKey: 'rest2', name: 'Smoked Ham & Aged Gruyere Baguette', price: 290, isVeg: false, category: 'Artisan Bakery', calories: 430, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', description: 'Crusty sourdough baguette with smoked honey ham, aged French gruyere, and Dijon mustard.' },
    { restKey: 'rest2', name: 'Surplus Artisan Pastry Rescue Box', price: 160, originalPrice: 420, discountPercentage: 62, isVeg: true, isSurplus: true, surplusQuantity: 4, surplusDeadline: deadlineShort, category: 'Surplus Deals', calories: 580, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', description: 'Contains 2 Almond Croissants and 1 Pain au Chocolat from morning bake batch.', preparationInfo: 'Baked at 7:30 AM today. Packed in kraft paper bakery bag.', safetyGuarantee: 'Bakery surplus inspection verified - crisp, safe and buttery.' },

    // --- Rest 3: Spice Loop Conscious Curry ---
    { restKey: 'rest3', name: 'Dal Makhani Slow-Simmered (450ml)', price: 280, isVeg: true, category: 'North Indian', calories: 390, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', description: 'Black lentils slow-cooked overnight for 18 hours with vine-ripened tomatoes and white butter.' },
    { restKey: 'rest3', name: 'Paneer Lababdar & Laccha Paratha Combo', price: 340, isVeg: true, category: 'North Indian', calories: 520, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', description: 'Cottage cheese simmered in cashew-tomato gravy, served with 2 whole wheat layered parathas.' },
    { restKey: 'rest3', name: 'Old Delhi Butter Chicken (450ml)', price: 380, isVeg: false, category: 'North Indian', calories: 560, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', description: 'Tandoor-charred chicken simmered in silk makhani gravy with fenugreek and butter.' },
    { restKey: 'rest3', name: 'Smoked Baingan Bharta with Tandoori Roti', price: 240, isVeg: true, category: 'North Indian', calories: 320, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', description: 'Wood-fired roasted eggplant mashed with garlic, onions, tomatoes, and cold-pressed mustard oil.' },
    { restKey: 'rest3', name: 'Organic Jeera Pulao Bowl', price: 160, isVeg: true, category: 'North Indian', calories: 280, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', description: 'Aged basmati rice tempered with roasted cumin seeds and fresh coriander.' },
    { restKey: 'rest3', name: 'Surplus Dum Handi Biryani Feast (2 Portions)', price: 180, originalPrice: 420, discountPercentage: 57, isVeg: true, isSurplus: true, surplusQuantity: 5, surplusDeadline: deadlineMed, category: 'Surplus Deals', calories: 560, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', description: 'Fragrant aged Basmati rice layered with paneer, saffron, and mint in sealed clay handi.', preparationInfo: 'Steam-sealed at 1:00 PM today. Kept in thermal warming chamber at 68°C.', safetyGuarantee: 'Thermal food safety compliant (Above 65°C standard).' },

    // --- Rest 4: Trattoria Bella Terra ---
    { restKey: 'rest4', name: 'Margherita Burrata Pizza (11-inch)', price: 420, isVeg: true, category: 'Italian & Pizza', calories: 650, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', description: 'San Marzano tomato sauce, fresh creamy burrata ball, cold-pressed olive oil, and organic basil.' },
    { restKey: 'rest4', name: 'Truffle Mushroom Tagliatelle', price: 390, isVeg: true, category: 'Italian & Pizza', calories: 520, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', description: 'Handmade semolina tagliatelle tossed with wild porcini mushrooms, parmesan cream, and black truffle oil.' },
    { restKey: 'rest4', name: 'Pepperoni & Smoked Provolone Pizza', price: 480, isVeg: false, category: 'Italian & Pizza', calories: 720, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', description: 'Spicy artisanal pork pepperoni, smoked provolone, and crushed red chilies.' },
    { restKey: 'rest4', name: 'Classic Tiramisu al Mascarpone', price: 240, isVeg: true, category: 'Italian & Pizza', calories: 380, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80', description: 'Espresso-dipped savoiardi biscuits layered with light mascarpone cream and cocoa.' },
    { restKey: 'rest4', name: 'Surplus Wood-Fired Margherita Pizza', price: 190, originalPrice: 420, discountPercentage: 55, isVeg: true, isSurplus: true, surplusQuantity: 3, surplusDeadline: deadlineShort, category: 'Surplus Deals', calories: 610, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', description: 'Freshly baked at 1:15 PM in wood-fired oven.', preparationInfo: 'Inspected and boxed in unbleached cardboard pizza box.', safetyGuarantee: 'FSSAI Safe Surplus Standard verified.' },

    // --- Rest 5: Dakshin Earth Tiffin ---
    { restKey: 'rest5', name: 'Mysore Masala Dosa with Chutneys', price: 160, isVeg: true, category: 'South Indian', calories: 320, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', description: 'Crisp golden crepe smeared with spicy red chili-garlic paste, potato mash, and 3 fresh chutneys.' },
    { restKey: 'rest5', name: 'Ghee Podi Mini Idli (12 Pcs)', price: 140, isVeg: true, category: 'South Indian', calories: 290, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', description: 'Bite-sized steamed rice idlis tossed in pure A2 cow ghee and gunpowder podi masala.' },
    { restKey: 'rest5', name: 'Chettinad Pepper Chicken with Parotta', price: 280, isVeg: false, category: 'South Indian', calories: 480, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', description: 'Fiery black pepper roasted chicken curry served with 2 flaky Malabar parottas.' },
    { restKey: 'rest5', name: 'Traditional Filter Coffee (Flask for 2)', price: 90, isVeg: true, category: 'South Indian', calories: 120, image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80', description: 'Chicory blend freshly brewed in brass filter with boiled whole milk.' },
    { restKey: 'rest5', name: 'Surplus South Indian Feast Box', price: 110, originalPrice: 240, discountPercentage: 54, isVeg: true, isSurplus: true, surplusQuantity: 7, surplusDeadline: deadlineShort, category: 'Surplus Deals', calories: 420, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', description: 'Contains 4 Podi Idlis, 1 Medu Vada, Lemon Rice, and Sambhar.', preparationInfo: 'Steamed fresh in afternoon service. Packed in palm-leaf eco-box.', safetyGuarantee: '100% Edible and hygienic.' },

    // --- Rest 6: Zenith Asian Wok ---
    { restKey: 'rest6', name: 'Avocado & Asparagus Tempura Roll (8 Pcs)', price: 380, isVeg: true, category: 'Pan-Asian & Sushi', calories: 290, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', description: 'Nori roll with crispy asparagus tempura, ripe avocado, spicy vegan mayo, and toasted sesame.' },
    { restKey: 'rest6', name: 'Spicy Truffle Edamame Dim Sum (6 Pcs)', price: 340, isVeg: true, category: 'Pan-Asian & Sushi', calories: 210, image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', description: 'Translucent crystal dumplings stuffed with mashed edamame and infused with black truffle oil.' },
    { restKey: 'rest6', name: 'Teriyaki Glazed Atlantic Salmon Bowl', price: 520, isVeg: false, category: 'Pan-Asian & Sushi', calories: 490, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', description: 'Pan-seared Atlantic salmon in homemade mirin-teriyaki glaze over Japanese sushi rice.' },
    { restKey: 'rest6', name: 'Dan Dan Soba Noodles with Crispy Tofu', price: 320, isVeg: true, category: 'Pan-Asian & Sushi', calories: 410, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', description: 'Buckwheat soba tossed in creamy sesame-chili broth with bok choy and crispy spiced tofu.' },
    { restKey: 'rest6', name: 'Surplus Asian Wok & Dumpling Bento', price: 210, originalPrice: 480, discountPercentage: 56, isVeg: true, isSurplus: true, surplusQuantity: 5, surplusDeadline: deadlineMed, category: 'Surplus Deals', calories: 460, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', description: 'Wok-tossed noodles, 3 veg dim sums, and edamame salad.', preparationInfo: 'Cooked at 1:30 PM. Sealed in temperature-controlled plant container.', safetyGuarantee: 'Certified Safe Food Rescue standard.' },

    // --- Rest 7: Olive & Fig ---
    { restKey: 'rest7', name: 'Grand Mezze Platter with Fresh Pita', price: 340, isVeg: true, category: 'Mediterranean', calories: 440, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', description: 'Creamy classic hummus, smoked mutabal, muhammara, and 4 crisp falafel balls with 2 warm pitas.' },
    { restKey: 'rest7', name: 'Grilled Halloumi & Fig Salad', price: 290, isVeg: true, category: 'Mediterranean', calories: 330, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', description: 'Pan-seared Cyprus halloumi cheese, dried Turkish figs, walnuts, and pomegranate molasses.' },
    { restKey: 'rest7', name: 'Chicken Shish Tawook Pita Wrap', price: 310, isVeg: false, category: 'Mediterranean', calories: 450, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', description: 'Yogurt & garlic-marinated chicken breast cubes with pickled turnips and toum garlic dip.' },

    // --- Rest 8: Taqueria Verde ---
    { restKey: 'rest8', name: 'Smoky Chipotle Jackfruit Burrito Bowl', price: 280, isVeg: true, category: 'Healthy Bowls', calories: 390, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', description: 'Slow-braised chipotle jackfruit carnitas, black beans, brown rice, pico de gallo, and guacamole.' },
    { restKey: 'rest8', name: 'Crispy Battered Avocado Tacos (3 Pcs)', price: 260, isVeg: true, category: 'Mexican', calories: 340, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', description: 'Beer-battered Hass avocado slices in warm corn tortillas with cabbage slaw and chipotle cream.' },
    { restKey: 'rest8', name: 'Pollo Asado Grilled Chicken Tacos (3 Pcs)', price: 310, isVeg: false, category: 'Mexican', calories: 410, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', description: 'Citrus-marinated flame-grilled chicken with charred pineapple salsa in soft corn tortillas.' },

    // --- Rest 9: Pure Root Macrobiotic ---
    { restKey: 'rest9', name: 'Healing Shiitake Miso Noodle Broth', price: 270, isVeg: true, category: 'Vegan', calories: 260, image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', description: 'Aged brown rice miso broth with Japanese shiitake mushrooms, wakame seaweed, and rice noodles.' },
    { restKey: 'rest9', name: 'Tempeh Kimchi Gut Health Bowl', price: 310, isVeg: true, category: 'Healthy Bowls', calories: 380, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', description: 'Organic fermented tempeh, house-made vegan kimchi, steamed bok choy, and black forbidden rice.' },

    // --- Rest 10: The Himalayan Clay Pot ---
    { restKey: 'rest10', name: 'Steamed Tibetan Paneer Momos (8 Pcs)', price: 180, isVeg: true, category: 'Pan-Asian & Sushi', calories: 280, image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', description: 'Delicate hand-pinched momos stuffed with spiced cottage cheese, served with spicy fire chili chutney.' },
    { restKey: 'rest10', name: 'Juicy Himalayan Chicken Kothey Momos (8 Pcs)', price: 220, isVeg: false, category: 'Pan-Asian & Sushi', calories: 340, image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', description: 'Pan-crisped steamed chicken dumplings infused with ginger and scallions.' },

    // --- Rest 11: Brew & Bloom ---
    { restKey: 'rest11', name: 'Madagascar Vanilla Cold Brew (350ml)', price: 180, isVeg: true, category: 'Cold-Pressed Juices', calories: 45, image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80', description: '18-hour cold steeped Arabica beans infused with natural organic vanilla bean pods.' },
    { restKey: 'rest11', name: 'Sourdough Avocado Poached Egg Tartine', price: 280, isVeg: false, category: 'Breakfast', calories: 370, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', description: 'Toasted whole wheat sourdough with smashed Hass avocado, free-range poached eggs, and dukkah.' },

    // --- Rest 12: Nourish Juice Bar ---
    { restKey: 'rest12', name: 'Cold-Pressed Green Glow Detox (500ml)', price: 90, originalPrice: 200, discountPercentage: 55, isVeg: true, isSurplus: true, surplusQuantity: 8, surplusDeadline: deadlineShort, category: 'Surplus Deals', calories: 110, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=600&q=80', description: 'Cold-pressed celery, green apple, cucumber, ginger, and lemon. Glass bottle deposit included.', preparationInfo: 'Cold-pressed at 11:00 AM in sterile glass bottle. Kept on continuous ice.', safetyGuarantee: '100% Raw unpasteurized juice. Chill below 4°C.' },
    { restKey: 'rest12', name: 'Organic Brazilian Acai Energy Bowl', price: 340, isVeg: true, category: 'Healthy Bowls', calories: 320, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', description: 'Thick frozen wild acai berry blend topped with organic granola, chia seeds, and fresh strawberries.' },

    // --- Rest 13: Punjab Heritage ---
    { restKey: 'rest13', name: 'Amritsari Chur Chur Naan Thali', price: 220, isVeg: true, category: 'North Indian', calories: 480, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', description: 'Crushed flaky potato-paneer naan served with spicy chole, raita, and pickled onions.' },
    { restKey: 'rest13', name: 'Tandoori Soya Chaap Tikka', price: 210, isVeg: true, category: 'North Indian', calories: 310, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80', description: 'Protein-rich soy ribs marinated in spiced mustard oil yogurt and cooked in clay tandoor.' },

    // --- Rest 14: Bao Craft ---
    { restKey: 'rest14', name: 'Crispy Panko Tofu Steamed Bao (2 Pcs)', price: 220, isVeg: true, category: 'Pan-Asian & Sushi', calories: 310, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', description: 'Cloud-soft steamed lotus buns with crunchy breaded tofu, scallions, and sriracha mayo.' },
    { restKey: 'rest14', name: 'Braised Pulled Chicken Bao (2 Pcs)', price: 260, isVeg: false, category: 'Pan-Asian & Sushi', calories: 360, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', description: 'Five-spice slow braised shredded chicken with crushed peanuts and pickled red chilies.' },

    // --- Rest 15: Sohna Farmstead ---
    { restKey: 'rest15', name: 'Charred Cottage Cheese & Herb Skewers', price: 260, isVeg: true, category: 'North Indian', calories: 340, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', description: 'Farm cottage cheese cubes skewered with bell peppers and glazed with green herb oil.' },
    { restKey: 'rest15', name: 'Smoked Chicken Seekh Kebabs', price: 320, isVeg: false, category: 'North Indian', calories: 420, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', description: 'Minced chicken skewers infused with green chilies, cilantro, and roasted cumin on charcoal.' },

    // --- Rest 16: Soul Sourdough ---
    { restKey: 'rest16', name: 'Belgian Chocolate Babka Loaf (400g)', price: 280, isVeg: true, category: 'Artisan Bakery', calories: 410, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80', description: 'Intricate twisted brioche loaf swirled with 70% Callebaut dark chocolate and vanilla syrup.' },
    { restKey: 'rest16', name: 'Pistachio Cream Brioche Bun', price: 175, isVeg: true, category: 'Artisan Bakery', calories: 290, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', description: 'Pillow-soft golden brioche filled with Sicilian pistachio pastry cream.' },

    // --- Rest 17: Indus Vegan Thali ---
    { restKey: 'rest17', name: 'Royal Ragi & Jowar Millet Thali', price: 240, isVeg: true, category: 'Vegan', calories: 460, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', description: 'Nutritious millet rotis, sprouted lentils, seasonal organic vegetable curry, and amaranth kheer.' },
    { restKey: 'rest17', name: 'Spiced Sprouted Moong Usal Bowl', price: 160, isVeg: true, category: 'Healthy Bowls', calories: 240, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', description: 'Slow-cooked sprouted whole green gram tempered with curry leaves, mustard seeds, and fresh coconut.' },

    // --- Rest 18: The Mediterranean Breeze ---
    { restKey: 'rest18', name: 'Greek Salad with Organic Feta', price: 260, isVeg: true, category: 'Mediterranean', calories: 280, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', description: 'Ripe heirloom tomatoes, Persian cucumbers, Kalamata olives, and barrel-aged Greek feta block.' },
    { restKey: 'rest18', name: 'Grilled Halloumi Souvlaki Wrap', price: 290, isVeg: true, category: 'Mediterranean', calories: 370, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80', description: 'Charred Cyprus halloumi, wild greens, pickled red onion, and tzatziki in warm grilled flatbread.' }
  ];

  for (const item of menuTemplates) {
    const rDoc = createdRestaurantsMap[item.restKey];
    if (!rDoc) continue;
    const { restKey, ...itemData } = item;
    await MenuItems.create({
      ...itemData,
      restaurantId: rDoc._id,
      isAvailable: true,
      estimatedWasteKg: itemData.isSurplus ? 0.45 : 0
    });
  }

  // 5. Sample Reviews
  const reviewsData = [
    { restaurantId: createdRestaurantsMap.rest1._id, customerId: customer1._id, customerName: 'Aarav Sharma', rating: 5, comment: 'Incredible Quinoa bowl through Food Rescue! Fresh and earned 35 eco-points!' },
    { restaurantId: createdRestaurantsMap.rest2._id, customerId: customer1._id, customerName: 'Priya N.', rating: 5, comment: 'The Surplus Pastry Box is the best deal. Packaging was 100% compostable!' },
    { restaurantId: createdRestaurantsMap.rest3._id, customerId: customer1._id, customerName: 'Vikram J.', rating: 5, comment: 'Clay pot Dum Biryani was piping hot and aromatic. Real SDG 12 impact!' },
    { restaurantId: createdRestaurantsMap.rest4._id, customerId: customer1._id, customerName: 'Ritu K.', rating: 5, comment: 'Authentic Neapolitan crust and super fast EV courier delivery!' },
    { restaurantId: createdRestaurantsMap.rest6._id, customerId: customer1._id, customerName: 'Manish S.', rating: 5, comment: 'Zenith sushi roll is fresh and dim sums arrived steam-warm.' }
  ];
  for (const rev of reviewsData) await Reviews.create(rev);

  // 6. Active Sample Order with real Dijkstra route recorded
  const sampleOrder = await Orders.create({
    orderNumber: 'FL-9024',
    customerId: customer1._id,
    customerName: customer1.name,
    customerPhone: customer1.phone,
    restaurantId: createdRestaurantsMap.rest1._id,
    restaurantName: createdRestaurantsMap.rest1.name,
    deliveryPartnerId: createdDeliveryPartners[0]._id,
    deliveryPartnerName: createdDeliveryPartners[0].name,
    deliveryPartnerPhone: createdDeliveryPartners[0].phone,
    deliveryPartnerVehicle: createdDeliveryPartners[0].vehicle,
    items: [
      { name: 'Avocado Quinoa Power Bowl', price: 320, quantity: 1, isSurplus: false },
      { name: 'Chef Surplus: Sunset Harvest Quinoa Bowl', price: 150, quantity: 1, isSurplus: true }
    ],
    subtotal: 470,
    deliveryFee: 30,
    ecoPackagingFee: 15,
    totalAmount: 515,
    noCutlery: true,
    ecoPackagingSelected: true,
    ecoPointsEarned: 45,
    status: 'Out for Delivery',
    dijkstraRoute: {
      sourceNode: 'N2', // Galleria Market
      destinationNode: 'N7', // Sushant Lok (Customer)
      totalDistanceKm: 1.6,
      estimatedMinutes: 8,
      waypoints: ['N2', 'N7'],
      roadSegments: ['Sushant Lok Cross Road']
    },
    statusHistory: [
      { status: 'Placed', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: 'Order placed by customer with No Cutlery option.' },
      { status: 'Accepted', timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(), note: 'Kitchen accepted order.' },
      { status: 'Preparing', timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(), note: 'Packed in biodegradable boxes.' },
      { status: 'Ready for Pickup', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), note: 'Packaged at dispatch counter.' },
      { status: 'Picked Up', timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(), note: `Assigned to ${createdDeliveryPartners[0].name} via Min-Heap Priority Queue.` },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), note: 'Courier en route via Dijkstra Shortest Path.' }
    ],
    deliveryAddress: customer1.address,
    restaurantAddress: createdRestaurantsMap.rest1.address,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    wasteSavedKg: 0.45,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  });

  console.log(`FoodLoop database successfully seeded with 18 restaurants, complete menus & 5 delivery partners!`);
}
