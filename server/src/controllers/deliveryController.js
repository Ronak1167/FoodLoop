import { Orders, Users } from '../db/storage.js';

export async function getAvailableDeliveries(req, res) {
  try {
    // Deliveries ready for courier or unassigned
    const orders = await Orders.find({
      status: { $in: ['Ready for Pickup', 'Preparing', 'Accepted'] },
      deliveryPartnerId: null
    });
    return res.json({ deliveries: orders });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch available deliveries', error: err.message });
  }
}

export async function getMyDeliveries(req, res) {
  try {
    const orders = await Orders.find(
      { deliveryPartnerId: req.user._id },
      { sort: { createdAt: -1 } }
    );

    const active = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    const completed = orders.filter(o => o.status === 'Delivered');

    const totalEarnings = (req.user.totalEarnings || 0) + (completed.length * 60);

    return res.json({
      active,
      completed,
      summary: {
        totalCompleted: completed.length,
        totalEarnings,
        rating: req.user.rating || 4.9,
        vehicle: req.user.vehicle || 'Zero-Emission Electric Scooter'
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch partner deliveries', error: err.message });
  }
}

export async function acceptDelivery(req, res) {
  try {
    const { orderId } = req.params;
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryPartnerId && String(order.deliveryPartnerId) !== String(req.user._id)) {
      return res.status(400).json({ message: 'Order is already assigned to another delivery partner' });
    }

    const history = order.statusHistory || [];
    history.push({
      status: 'Ready for Pickup',
      timestamp: new Date().toISOString(),
      note: `Delivery partner ${req.user.name} accepted the pickup on ${req.user.vehicle || 'EV'}.`
    });

    const updated = await Orders.findByIdAndUpdate(
      orderId,
      {
        deliveryPartnerId: req.user._id,
        deliveryPartnerName: req.user.name,
        deliveryPartnerPhone: req.user.phone,
        deliveryPartnerVehicle: req.user.vehicle || 'Zero-Emission Electric Scooter',
        status: 'Ready for Pickup',
        statusHistory: history
      },
      { new: true }
    );

    return res.json({ message: 'Delivery accepted successfully!', order: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to accept delivery', error: err.message });
  }
}

export async function updatePartnerLocation(req, res) {
  try {
    const { orderId } = req.params;
    const { lat, lng } = req.body;

    const updated = await Orders.findByIdAndUpdate(
      orderId,
      { deliveryPartnerLocation: { lat: Number(lat), lng: Number(lng) } },
      { new: true }
    );

    return res.json({ message: 'Location updated', location: updated.deliveryPartnerLocation });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update location', error: err.message });
  }
}
