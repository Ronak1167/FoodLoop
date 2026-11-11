/**
 * Object-Oriented Programming (OOP) Domain Models for FoodLoop.
 * 
 * Demonstrates core OOP tenets for JIIT Data Structures & OOP evaluation:
 * 1. Encapsulation: Private fields (#), controlled accessor/mutator methods, input validation.
 * 2. Inheritance: Specialized sub-classes extending foundational base classes.
 * 3. Polymorphism: Overridden methods behaving dynamically based on runtime instance type.
 * 4. Abstraction: Clean public interfaces concealing internal implementation details.
 */

// ==========================================
// 1. USER CLASS HIERARCHY (Inheritance & Polymorphism)
// ==========================================

export class BaseUser {
  #id;
  #name;
  #email;
  #role;
  #createdAt;

  constructor(id, name, email, role) {
    if (new.target === BaseUser) {
      throw new TypeError('Cannot construct abstract BaseUser instance directly; instantiate a subclass.');
    }
    this.#id = id || ('U-' + Math.floor(Math.random() * 10000));
    this.#name = name;
    this.#email = email;
    this.#role = role;
    this.#createdAt = new Date().toISOString();
  }

  // Encapsulated Getters
  getId() { return this.#id; }
  getName() { return this.#name; }
  getEmail() { return this.#email; }
  getRole() { return this.#role; }
  getCreatedAt() { return this.#createdAt; }

  // Polymorphic method to be overridden by subclasses
  getDashboardRoute() {
    return '/profile';
  }

  // Polymorphic role permissions
  getRolePermissions() {
    return ['BROWSE_MENU', 'VIEW_PROFILE'];
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      role: this.#role,
      permissions: this.getRolePermissions(),
      dashboardRoute: this.getDashboardRoute(),
      createdAt: this.#createdAt
    };
  }
}

export class CustomerUser extends BaseUser {
  #ecoPoints;
  #mealsRescued;

  constructor(id, name, email, ecoPoints = 120, mealsRescued = 4) {
    super(id, name, email, 'customer');
    this.#ecoPoints = ecoPoints;
    this.#mealsRescued = mealsRescued;
  }

  getEcoPoints() { return this.#ecoPoints; }
  getMealsRescued() { return this.#mealsRescued; }

  addEcoPoints(pts) {
    this.#ecoPoints += Math.max(0, pts);
  }

  recordMealRescued() {
    this.#mealsRescued += 1;
    this.addEcoPoints(25); // +25 bonus per meal rescued
  }

  override
  getDashboardRoute() {
    return '/sustainability';
  }

  override
  getRolePermissions() {
    return ['BROWSE_MENU', 'PLACE_ORDER', 'RESCUE_FOOD', 'GROUP_ORDER', 'VIEW_SUSTAINABILITY'];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ecoPoints: this.#ecoPoints,
      mealsRescued: this.#mealsRescued,
      ecoRank: this.#ecoPoints > 200 ? 'Climate Champion' : this.#ecoPoints > 80 ? 'Green Guardian' : 'Eco Seedling'
    };
  }
}

export class RestaurantOwnerUser extends BaseUser {
  #restaurantId;
  #cuisineType;

  constructor(id, name, email, restaurantId, cuisineType = 'Organic Indian') {
    super(id, name, email, 'restaurant_owner');
    this.#restaurantId = restaurantId;
    this.#cuisineType = cuisineType;
  }

  getRestaurantId() { return this.#restaurantId; }

  override
  getDashboardRoute() {
    return '/restaurant-dashboard';
  }

  override
  getRolePermissions() {
    return ['MANAGE_MENU', 'POST_SURPLUS_DEAL', 'UPDATE_ORDER_STATUS', 'VIEW_REVENUE'];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      restaurantId: this.#restaurantId,
      cuisineType: this.#cuisineType
    };
  }
}

export class DeliveryPartnerUser extends BaseUser {
  #vehicleType;
  #isAvailable;
  #assignedNode;
  #rating;

  constructor(id, name, email, vehicleType = 'Electric Scooter (EV)', assignedNode = 'N1', rating = 4.9) {
    super(id, name, email, 'delivery_partner');
    this.#vehicleType = vehicleType;
    this.#isAvailable = true;
    this.#assignedNode = assignedNode;
    this.#rating = rating;
  }

  isEV() {
    return this.#vehicleType.toLowerCase().includes('ev') || this.#vehicleType.toLowerCase().includes('electric');
  }

  override
  getDashboardRoute() {
    return '/delivery-dashboard';
  }

  override
  getRolePermissions() {
    return ['VIEW_ASSIGNED_ORDERS', 'UPDATE_DELIVERY_STATUS', 'GRAPH_NAVIGATION', 'VIEW_EARNINGS'];
  }

  toJSON() {
    return {
      ...super.toJSON(),
      vehicleType: this.#vehicleType,
      isAvailable: this.#isAvailable,
      assignedNode: this.#assignedNode,
      rating: this.#rating,
      isZeroEmission: this.isEV()
    };
  }
}

export class AdminUser extends BaseUser {
  constructor(id, name, email) {
    super(id, name, email, 'admin');
  }

  override
  getDashboardRoute() {
    return '/admin-dashboard';
  }

  override
  getRolePermissions() {
    return ['ALL_PERMISSIONS', 'AUDIT_USERS', 'MANAGE_RESTAURANTS', 'VIEW_METRICS', 'DSA_MONITOR'];
  }
}

// ==========================================
// 2. FOOD ITEM CLASS HIERARCHY (Polymorphism & Encapsulation)
// ==========================================

export class FoodItem {
  #id;
  #name;
  #basePrice;
  #category;
  #isVeg;

  constructor(id, name, basePrice, category = 'Main Course', isVeg = true) {
    this.#id = id || ('ITEM-' + Math.floor(Math.random() * 10000));
    this.#name = name;
    this.#basePrice = Number(basePrice);
    this.#category = category;
    this.#isVeg = Boolean(isVeg);
  }

  getId() { return this.#id; }
  getName() { return this.#name; }
  getBasePrice() { return this.#basePrice; }
  getCategory() { return this.#category; }
  getIsVeg() { return this.#isVeg; }

  // Base polymorphic method: calculate checkout price
  calculateFinalPrice(ecoPackaging = false) {
    const packagingCharge = ecoPackaging ? 10 : 15;
    return this.#basePrice + packagingCharge;
  }

  // Base polymorphic method: eco impact score
  getEcoImpactScore() {
    // Veg meals have a base sustainability score of 70
    return this.#isVeg ? 70 : 40;
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      basePrice: this.#basePrice,
      category: this.#category,
      isVeg: this.#isVeg,
      finalPriceSample: this.calculateFinalPrice(true),
      ecoScore: this.getEcoImpactScore(),
      type: 'Standard'
    };
  }
}

export class RegularFoodItem extends FoodItem {
  #chefSpecial;

  constructor(id, name, basePrice, category, isVeg, chefSpecial = false) {
    super(id, name, basePrice, category, isVeg);
    this.#chefSpecial = chefSpecial;
  }

  override
  calculateFinalPrice(ecoPackaging = false) {
    const packaging = ecoPackaging ? 10 : 15;
    return this.getBasePrice() + packaging;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      chefSpecial: this.#chefSpecial,
      type: 'RegularMenuItem'
    };
  }
}

export class SurplusFoodDeal extends FoodItem {
  #discountPercent;
  #portionsLeft;
  #expiryMinutes;

  constructor(id, name, basePrice, category, isVeg, discountPercent = 50, portionsLeft = 5, expiryMinutes = 90) {
    super(id, name, basePrice, category, isVeg);
    this.#discountPercent = discountPercent;
    this.#portionsLeft = portionsLeft;
    this.#expiryMinutes = expiryMinutes;
  }

  getDiscountPercent() { return this.#discountPercent; }
  getPortionsLeft() { return this.#portionsLeft; }
  getExpiryMinutes() { return this.#expiryMinutes; }

  // Polymorphic override: applies SDG 12 heavy discount
  override
  calculateFinalPrice(ecoPackaging = false) {
    const discounted = Math.round(this.getBasePrice() * (1 - this.#discountPercent / 100));
    const packaging = ecoPackaging ? 10 : 15;
    return discounted + packaging;
  }

  // Polymorphic override: massive eco-impact because it prevents landfill waste!
  override
  getEcoImpactScore() {
    return super.getEcoImpactScore() + 45; // Huge bonus for diverting food waste
  }

  toJSON() {
    return {
      ...super.toJSON(),
      discountPercent: this.#discountPercent,
      portionsLeft: this.#portionsLeft,
      expiryMinutes: this.#expiryMinutes,
      type: 'SurplusFoodRescueDeal',
      savings: this.getBasePrice() - Math.round(this.getBasePrice() * (1 - this.#discountPercent / 100))
    };
  }
}

