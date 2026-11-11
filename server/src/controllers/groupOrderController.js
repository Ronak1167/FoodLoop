import crypto from 'crypto';
import { GroupOrders, Restaurants, MenuItems, Orders, Users } from '../db/storage.js';

function generateGroupCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'LOOP-';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return code;
}

export async function createGroupOrder(req, res) {
  try {
    const { restaurantId, splitMethod = 'by_items' } = req.body;

    const restaurant = await Restaurants.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const groupCode = generateGroupCode();

    const hostMember = {
      memberId: crypto.randomBytes(8).toString('hex'),
      userId: req.user ? req.user._id : null,
      name: (req.user ? req.user.name : 'Host') + ' (Host)',
      isHost: true,
      items: [],
      subtotal: 0,
      paid: false
    };

    const newGroup = await GroupOrders.create({
      groupCode,
      hostId: req.user ? req.user._id : 'guest_host',
      hostName: req.user ? req.user.name : 'Host',
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      status: 'open', // 'open' | 'locked' | 'ordered'
      members: [hostMember],
      splitMethod,
      totalAmount: 0,
      deliveryFee: Number(restaurant.deliveryFee || 30),
      ecoPackagingFee: Number(restaurant.ecoPackagingFee || 15),
      noCutlery: true,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      message: 'Group order created!',
      groupOrder: newGroup
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create group order', error: err.message });
  }
}

export async function getGroupByCode(req, res) {
  try {
    const { code } = req.params;
    const group = await GroupOrders.findOne({ groupCode: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({ message: 'Group order not found. Check your invite code.' });
    }

    // Calculate split calculations
    const breakdown = calculateBillSplit(group);

    return res.json({
      groupOrder: group,
      splitBreakdown: breakdown
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch group order', error: err.message });
  }
}

export async function joinGroupOrder(req, res) {
  try {
    const { code } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Your name is required to join this group order.' });
    }

    const group = await GroupOrders.findOne({ groupCode: code.toUpperCase() });
    if (!group) {
      return res.status(404).json({ message: 'Group order not found' });
    }

    if (group.status !== 'open') {
      return res.status(400).json({ message: 'This group order is already locked or ordered.' });
    }

    const memberName = name.trim();
    // Check if member already exists
    const existing = group.members.find(m => m.name.toLowerCase() === memberName.toLowerCase());
    if (existing) {
      return res.json({
        message: `Welcome back to the group, ${memberName}!`,
        groupOrder: group,
        member: existing
      });
    }

    const newMember = {
      memberId: crypto.randomBytes(8).toString('hex'),
      userId: req.user ? req.user._id : null,
      name: memberName,
      isHost: false,
      items: [],
      subtotal: 0,
      paid: false
    };

    group.members.push(newMember);
    const updated = await GroupOrders.findByIdAndUpdate(group._id, { members: group.members }, { new: true });

    return res.status(201).json({
      message: `Joined group order as ${memberName}`,
      groupOrder: updated,
      member: newMember
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to join group order', error: err.message });
  }
}

export async function addItemToGroup(req, res) {
  try {
    const { code } = req.params;
    const { memberId, menuItemId, quantity = 1 } = req.body;

    const group = await GroupOrders.findOne({ groupCode: code.toUpperCase() });
    if (!group) return res.status(404).json({ message: 'Group order not found' });
    if (group.status !== 'open') return res.status(400).json({ message: 'Group order is locked' });

    const menuItem = await MenuItems.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    const memberIndex = group.members.findIndex(m => m.memberId === memberId);
    if (memberIndex === -1) return res.status(404).json({ message: 'Member not found in this group' });

    const member = group.members[memberIndex];
    const existingItem = member.items.find(i => String(i.menuItemId) === String(menuItemId));

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      member.items.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: Number(menuItem.price),
        quantity: Number(quantity),
        isSurplus: Boolean(menuItem.isSurplus),
        image: menuItem.image
      });
    }

    // Recompute member subtotal
    member.subtotal = member.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    group.members[memberIndex] = member;

    // Recompute total group amount
    const totalSubtotal = group.members.reduce((sum, m) => sum + m.subtotal, 0);
    const totalAmount = totalSubtotal + Number(group.deliveryFee || 30) + Number(group.ecoPackagingFee || 15);

    const updated = await GroupOrders.findByIdAndUpdate(
      group._id,
      { members: group.members, totalAmount },
      { new: true }
    );

    return res.json({
      message: `Added ${menuItem.name} to ${member.name}'s items`,
      groupOrder: updated,
      splitBreakdown: calculateBillSplit(updated)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
}

export async function removeItemFromGroup(req, res) {
  try {
    const { code } = req.params;
    const { memberId, menuItemId } = req.body;

    const group = await GroupOrders.findOne({ groupCode: code.toUpperCase() });
    if (!group) return res.status(404).json({ message: 'Group order not found' });

    const memberIndex = group.members.findIndex(m => m.memberId === memberId);
    if (memberIndex === -1) return res.status(404).json({ message: 'Member not found' });

    const member = group.members[memberIndex];
    member.items = member.items.filter(i => String(i.menuItemId) !== String(menuItemId));
    member.subtotal = member.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    group.members[memberIndex] = member;

    const totalSubtotal = group.members.reduce((sum, m) => sum + m.subtotal, 0);
    const totalAmount = totalSubtotal + Number(group.deliveryFee || 30) + Number(group.ecoPackagingFee || 15);

    const updated = await GroupOrders.findByIdAndUpdate(
      group._id,
      { members: group.members, totalAmount },
      { new: true }
    );

    return res.json({
      message: 'Item removed',
      groupOrder: updated,
      splitBreakdown: calculateBillSplit(updated)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
}

export async function toggleSplitMethod(req, res) {
  try {
    const { code } = req.params;
    const { splitMethod } = req.body;

    const group = await GroupOrders.findOne({ groupCode: code.toUpperCase() });
    if (!group) return res.status(404).json({ message: 'Group order not found' });

    const updated = await GroupOrders.findByIdAndUpdate(
      group._id,
      { splitMethod: splitMethod || 'by_items' },
      { new: true }
    );

    return res.json({
      message: `Split bill method changed to ${splitMethod}`,
      groupOrder: updated,
      splitBreakdown: calculateBillSplit(updated)
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to change split method', error: err.message });
  }
}

export async function checkoutGroupOrder(req, res) {
  try {
    const { code } = req.params;
    const { deliveryAddress, paymentMethod = 'UPI' } = req.body;

    const group = await GroupOrders.findOne({ groupCode: code.toUpperCase() });
    if (!group) return res.status(404).json({ message: 'Group order not found' });

    // Aggregate all items across all members
    const combinedItemsMap = new Map();
    for (const member of group.members) {
      for (const item of member.items) {
        const key = String(item.menuItemId);
        if (combinedItemsMap.has(key)) {
          combinedItemsMap.get(key).quantity += item.quantity;
        } else {
          combinedItemsMap.set(key, { ...item });
        }
      }
    }

    const aggregatedItems = Array.from(combinedItemsMap.values());
    if (aggregatedItems.length === 0) {
      return res.status(400).json({ message: 'No items in the group order yet!' });
    }

    // Place confirmed restaurant order
    const restaurant = await Restaurants.findById(group.restaurantId);
    const subtotal = aggregatedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const deliveryFee = Number(group.deliveryFee || 30);
    const ecoPackagingFee = Number(group.ecoPackagingFee || 15);
    const totalAmount = subtotal + deliveryFee + ecoPackagingFee;

    const orderNumber = 'FL-GRP-' + Math.floor(1000 + Math.random() * 9000);

    const placedOrder = await Orders.create({
      orderNumber,
      customerId: req.user ? req.user._id : group.hostId,
      customerName: req.user ? req.user.name : group.hostName,
      restaurantId: group.restaurantId,
      restaurantName: group.restaurantName,
      restaurantAddress: group.restaurantAddress,
      items: aggregatedItems,
      subtotal,
      deliveryFee,
      ecoPackagingFee,
      totalAmount,
      noCutlery: true,
      ecoPackagingSelected: true,
      ecoPointsEarned: 50, // Group bonus!
      isGroupOrder: true,
      groupOrderId: group._id,
      groupCode: group.groupCode,
      groupMembersCount: group.members.length,
      status: 'Placed',
      statusHistory: [
        { status: 'Placed', timestamp: new Date().toISOString(), note: `Group order placed with ${group.members.length} participants.` }
      ],
      deliveryAddress: deliveryAddress || { street: 'Group Delivery Hub, DLF Tower B', city: 'Gurugram', state: 'Haryana', zipCode: '122002' },
      paymentStatus: 'Paid',
      paymentMethod,
      createdAt: new Date().toISOString()
    });

    // Mark group order as ordered
    await GroupOrders.findByIdAndUpdate(group._id, {
      status: 'ordered',
      placedOrderId: placedOrder._id,
      placedOrderNumber: placedOrder.orderNumber
    });

    return res.status(201).json({
      message: 'Group order successfully placed!',
      order: placedOrder
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to checkout group order', error: err.message });
  }
}

function calculateBillSplit(group) {
  const members = group.members || [];
  const memberCount = Math.max(1, members.length);
  const totalSubtotal = members.reduce((sum, m) => sum + (m.subtotal || 0), 0);
  const deliveryFee = Number(group.deliveryFee || 30);
  const ecoPackagingFee = Number(group.ecoPackagingFee || 15);
  const totalBill = totalSubtotal + deliveryFee + ecoPackagingFee;

  const splits = [];

  if (group.splitMethod === 'equal') {
    const equalShare = totalBill / memberCount;
    for (const m of members) {
      splits.push({
        memberId: m.memberId,
        name: m.name,
        isHost: m.isHost,
        itemCount: (m.items || []).reduce((s, i) => s + i.quantity, 0),
        itemsTotal: m.subtotal,
        deliveryShare: deliveryFee / memberCount,
        packagingShare: ecoPackagingFee / memberCount,
        finalShare: Math.round(equalShare),
        paid: m.paid
      });
    }
  } else {
    // 'by_items' split
    for (const m of members) {
      const proportion = totalSubtotal > 0 ? (m.subtotal / totalSubtotal) : (1 / memberCount);
      const deliveryShare = Math.round(deliveryFee * proportion);
      const packagingShare = Math.round(ecoPackagingFee * proportion);
      const finalShare = m.subtotal + deliveryShare + packagingShare;

      splits.push({
        memberId: m.memberId,
        name: m.name,
        isHost: m.isHost,
        itemCount: (m.items || []).reduce((s, i) => s + i.quantity, 0),
        itemsTotal: m.subtotal,
        deliveryShare,
        packagingShare,
        finalShare,
        paid: m.paid
      });
    }
  }

  return {
    splitMethod: group.splitMethod || 'by_items',
    totalBill,
    totalSubtotal,
    deliveryFee,
    ecoPackagingFee,
    members: splits
  };
}
