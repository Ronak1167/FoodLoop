import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users, Restaurants } from '../db/storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'foodloop_super_secret_jwt_key_2026_sdg12_sustainable';

export async function register(req, res) {
  try {
    const { name, email, password, role = 'customer', phone, address, dietaryPreference, vehicle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await Users.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Users.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: phone || '',
      address: address || { street: '', city: 'Gurugram', state: 'Haryana', zipCode: '122001' },
      dietaryPreference: dietaryPreference || 'all',
      rewardPoints: role === 'customer' ? 50 : 0, // 50 welcome eco-points
      totalMealsRescued: 0,
      totalWasteSavedKg: 0,
      vehicle: role === 'delivery_partner' ? (vehicle || 'Electric Scooter EV') : undefined,
      activeStatus: role === 'delivery_partner' ? 'available' : undefined,
      totalEarnings: role === 'delivery_partner' ? 0 : undefined,
      completedDeliveries: role === 'delivery_partner' ? 0 : undefined
    });

    // If role is restaurant_owner, create a placeholder restaurant profile if provided or ready
    if (role === 'restaurant_owner' && req.body.restaurantName) {
      await Restaurants.create({
        name: req.body.restaurantName,
        ownerId: newUser._id,
        description: req.body.restaurantDescription || 'Fresh, sustainable culinary goodness.',
        address: address || { street: 'Main Commercial Belt', city: 'Gurugram', state: 'Haryana', zipCode: '122001' },
        cuisines: req.body.cuisines || ['Healthy Bowls', 'Eco-Certified'],
        rating: 5.0,
        totalRatings: 1,
        priceRange: '$$',
        bannerImage: req.body.bannerImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
        logoImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        ecoPackagingAvailable: true,
        ecoPackagingFee: 15,
        mealsRescuedCount: 0,
        wastePreventedKg: 0,
        deliveryTime: '25-35 mins',
        deliveryFee: 30,
        minOrder: 100
      });
    }

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = newUser;

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Users.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const user = await Users.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, phone, address, dietaryPreference, favoriteCuisines } = req.body;
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone) updateData.phone = phone.trim();
    if (address) updateData.address = address;
    if (dietaryPreference) updateData.dietaryPreference = dietaryPreference;
    if (favoriteCuisines) updateData.favoriteCuisines = favoriteCuisines;

    const updated = await Users.findByIdAndUpdate(req.user._id, updateData, { new: true });
    const { password, ...safeUser } = updated;
    return res.json({ message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
}
