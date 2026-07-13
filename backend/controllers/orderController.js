import Order from '../models/Order.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin Only)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Admin Only)
export const createOrder = async (req, res) => {
  const { customerName, customerId, phone, dressName, status } = req.body;

  try {
    if (!customerName || !customerId || !phone || !dressName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Normalize customerId to uppercase
    const formattedCustomerId = customerId.trim().toUpperCase();

    // Check if customer ID already exists
    const existingOrder = await Order.findOne({ customerId: formattedCustomerId });
    if (existingOrder) {
      return res.status(400).json({ message: `Customer ID "${formattedCustomerId}" already exists` });
    }

    const order = new Order({
      customerName,
      customerId: formattedCustomerId,
      phone,
      dressName,
      status: status || 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order details or status
// @route   PUT /api/orders/:id
// @access  Private (Admin Only)
export const updateOrder = async (req, res) => {
  const { customerName, customerId, phone, dressName, status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If changing customerId, verify uniqueness
    if (customerId && customerId.toUpperCase() !== order.customerId) {
      const formattedCustomerId = customerId.trim().toUpperCase();
      const existingOrder = await Order.findOne({ customerId: formattedCustomerId });
      if (existingOrder) {
        return res.status(400).json({ message: `Customer ID "${formattedCustomerId}" already exists` });
      }
      order.customerId = formattedCustomerId;
    }

    order.customerName = customerName || order.customerName;
    order.phone = phone || order.phone;
    order.dressName = dressName || order.dressName;
    order.status = status || order.status;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private (Admin Only)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track an order by Customer ID
// @route   GET /api/orders/track/:customerId
// @access  Public
export const trackOrder = async (req, res) => {
  try {
    const customerId = req.params.customerId.trim().toUpperCase();
    const order = await Order.findOne({ customerId });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: `No order found with Customer ID: ${customerId}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publicly book a dress for stitching
// @route   POST /api/orders/book
// @access  Public
export const bookOrder = async (req, res) => {
  const { customerName, phone, dressName } = req.body;

  try {
    if (!customerName || !phone || !dressName) {
      return res.status(400).json({ message: 'All fields (Customer Name, Phone Number, Dress Name) are required' });
    }

    // Generate unique customerId: e.g. TP872145
    let customerId = '';
    let isUnique = false;
    
    while (!isUnique) {
      const randNum = Math.floor(100000 + Math.random() * 900000); // 6-digit code
      customerId = `TP${randNum}`;
      
      const existing = await Order.findOne({ customerId });
      if (!existing) {
        isUnique = true;
      }
    }

    const order = new Order({
      customerName,
      customerId,
      phone,
      dressName,
      status: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
