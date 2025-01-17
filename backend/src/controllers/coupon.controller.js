import Coupon from '../models/coupon.model.js';

// Sample products matching frontend data
const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 1999.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 2499.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80'
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with premium sound quality',
    price: 1499.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80'
  },
  {
    id: 4,
    name: 'Power Bank',
    description: '20000mAh high-capacity portable charger',
    price: 999.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&q=80'
  }
];

// Sample coupons for testing different scenarios
const sampleCoupons = [
  // Cart-wise coupons
  {
    type: 'cart-wise',
    details: {
      threshold: 1000,
      discount: 10,
      maxDiscount: 200 // Maximum discount cap
    },
    code: 'SAVE10',
    expiryDate: new Date('2024-12-31')
  },
  {
    type: 'cart-wise',
    details: {
      threshold: 2000,
      discount: 20,
      maxDiscount: 500,
      validHours: { start: 10, end: 14 } // Happy hours: 10 AM to 2 PM
    },
    code: 'SAVE20',
    expiryDate: new Date('2024-12-31')
  },
  {
    type: 'cart-wise',
    details: {
      threshold: 5000,
      discount: 500,
      category: 'electronics' // Category-specific discount
    },
    code: 'FLAT500',
    expiryDate: new Date('2024-12-31')
  },
  // Product-wise coupons
  {
    type: 'product-wise',
    details: {
      product_id: 1, // Wireless Headphones
      discount: 15,
      stackable: true // Can be combined with other coupons
    },
    code: 'HEAD15',
    expiryDate: new Date('2024-12-31')
  },
  {
    type: 'product-wise',
    details: {
      product_id: 2, // Smart Watch
      discount: 25,
      minQuantity: 2 // Minimum quantity required
    },
    code: 'WATCH25',
    expiryDate: new Date('2024-12-31')
  },
  // BxGy coupons with multiple combinations
  {
    type: 'bxgy',
    details: {
      buy_products: [
        { product_id: 1, quantity: 2 }, // Buy 2 Headphones
        { product_id: 2, quantity: 1 }  // OR 1 Smart Watch
      ],
      get_products: [
        { product_id: 4, quantity: 1 }, // Get 1 Power Bank
        { product_id: 3, quantity: 1 }  // OR 1 Speaker
      ],
      repetition_limit: 2
    },
    code: 'HEAD2PB1',
    expiryDate: new Date('2024-12-31')
  },
  {
    type: 'bxgy',
    details: {
      buy_products: [
        { product_id: 2, quantity: 2 } // Buy 2 Smart Watches
      ],
      get_products: [
        { product_id: 3, quantity: 1 } // Get 1 Bluetooth Speaker
      ],
      repetition_limit: 1,
      stackable: true // Can be combined with product discounts
    },
    code: 'WATCH2SPK1',
    expiryDate: new Date('2024-12-31')
  },
  
  // First-time user coupon
  {
    type: 'cart-wise',
    details: {
      threshold: 0, // No minimum purchase
      discount: 15,
      maxDiscount: 200,
      firstTimeOnly: true
    },
    code: 'WELCOME15',
    expiryDate: new Date('2024-12-31')
  },
  
  // Weekend special
  {
    type: 'cart-wise',
    details: {
      threshold: 1500,
      discount: 25,
      maxDiscount: 1000,
      validDays: [6, 0] // Saturday and Sunday
    },
    code: 'WEEKEND25',
    expiryDate: new Date('2024-12-31')
  }
];

// Create a new coupon
export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific coupon
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applicable coupons for a cart
export const getApplicableCoupons = async (req, res) => {
  try {
    const { cart } = req.body;
    const coupons = await Coupon.find();
    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const applicableCoupons = coupons
      .filter(coupon => {
        // Basic validations
        const currentDate = new Date();
        if (new Date(coupon.expiryDate) < currentDate) {
          return false;
        }

        // Time-based validations
        if (coupon.details.validHours) {
          const currentHour = currentDate.getHours();
          if (currentHour < coupon.details.validHours.start || 
              currentHour >= coupon.details.validHours.end) {
            return false;
          }
        }

        // Day-based validations
        if (coupon.details.validDays) {
          const currentDay = currentDate.getDay();
          if (!coupon.details.validDays.includes(currentDay)) {
            return false;
          }
        }

        // First-time user validation would be handled in the frontend
        // since we don't have user history in this implementation

        switch (coupon.type) {
          case 'cart-wise':
            // Category validation for cart-wise coupons
            if (coupon.details.category) {
              const hasItemFromCategory = cart.items.some(item => {
                const product = products.find(p => p.id === item.product_id);
                return product && product.category === coupon.details.category;
              });
              if (!hasItemFromCategory) {
                return false;
              }
            }
            return cartTotal >= coupon.details.threshold;
          
          case 'product-wise':
            const item = cart.items.find(item => 
              item.product_id === coupon.details.product_id
            );
            // Check minimum quantity if specified
            if (coupon.details.minQuantity && 
                (!item || item.quantity < coupon.details.minQuantity)) {
              return false;
            }
            return !!item;
          
          case 'bxgy':
            // Check if cart has required quantities of buy products
            return coupon.details.buy_products.every(buyProduct => {
              const cartItem = cart.items.find(item => 
                item.product_id === buyProduct.product_id
              );
              return cartItem && cartItem.quantity >= buyProduct.quantity;
            });
          
          default:
            return false;
        }
      })
      .map(coupon => {
        let discount = 0;

        switch (coupon.type) {
          case 'cart-wise':
            // If threshold is high (like FLAT500), it's a flat discount
            let calculatedDiscount = coupon.details.discount > 100 
              ? coupon.details.discount 
              : (cartTotal * coupon.details.discount) / 100;
            
            // Apply maximum discount cap if specified
            if (coupon.details.maxDiscount) {
              calculatedDiscount = Math.min(calculatedDiscount, coupon.details.maxDiscount);
            }
            
            discount = calculatedDiscount;
            break;
          
          case 'product-wise':
            const item = cart.items.find(item => 
              item.product_id === coupon.details.product_id
            );
            if (item) {
              discount = (item.price * item.quantity * coupon.details.discount) / 100;
            }
            break;
          
          case 'bxgy':
            // Calculate how many times the coupon can be applied
            const timesApplicable = Math.min(
              ...coupon.details.buy_products.map(buyProduct => {
                const cartItem = cart.items.find(item => 
                  item.product_id === buyProduct.product_id
                );
                return Math.floor(cartItem.quantity / buyProduct.quantity);
              }),
              coupon.details.repetition_limit
            );

            // Calculate discount based on free products
            coupon.details.get_products.forEach(getProduct => {
              const freeProduct = cart.items.find(item => 
                item.product_id === getProduct.product_id
              );
              if (freeProduct) {
                discount += freeProduct.price * getProduct.quantity * timesApplicable;
              }
            });
            break;
        }

        return {
          coupon_id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discount: Math.round(discount * 100) / 100
        };
      })
      .filter(coupon => coupon.discount > 0)
      .sort((a, b) => b.discount - a.discount);

    res.json({ applicable_coupons: applicableCoupons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply a coupon to cart
export const applyCoupon = async (req, res) => {
  try {
    const { cart } = req.body;
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    const currentDate = new Date();
    if (new Date(coupon.expiryDate) < currentDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    let totalDiscount = 0;
    let updatedItems = [...cart.items];

    switch (coupon.type) {
      case 'cart-wise':
        if (cartTotal >= coupon.details.threshold) {
          totalDiscount = coupon.details.discount > 100 
            ? coupon.details.discount 
            : (cartTotal * coupon.details.discount) / 100;
          
          // Distribute discount proportionally
          updatedItems = cart.items.map(item => ({
            ...item,
            total_discount: (item.price * item.quantity * totalDiscount) / cartTotal
          }));
        }
        break;
      
      case 'product-wise':
        updatedItems = cart.items.map(item => {
          if (item.product_id === coupon.details.product_id) {
            const itemDiscount = (item.price * item.quantity * coupon.details.discount) / 100;
            totalDiscount += itemDiscount;
            return { ...item, total_discount: itemDiscount };
          }
          return { ...item, total_discount: 0 };
        });
        break;
      
      case 'bxgy':
        // Calculate how many times the coupon can be applied
        const timesApplicable = Math.min(
          ...coupon.details.buy_products.map(buyProduct => {
            const cartItem = cart.items.find(item => 
              item.product_id === buyProduct.product_id
            );
            return Math.floor(cartItem.quantity / buyProduct.quantity);
          }),
          coupon.details.repetition_limit
        );

        updatedItems = cart.items.map(item => {
          const getFreeProduct = coupon.details.get_products.find(p => 
            p.product_id === item.product_id
          );
          
          if (getFreeProduct) {
            const freeQuantity = getFreeProduct.quantity * timesApplicable;
            const itemDiscount = item.price * freeQuantity;
            totalDiscount += itemDiscount;
            return { ...item, total_discount: itemDiscount };
          }
          return { ...item, total_discount: 0 };
        });
        break;
    }

    const updatedCart = {
      items: updatedItems,
      total_price: cartTotal,
      total_discount: Math.round(totalDiscount * 100) / 100,
      final_price: Math.round((cartTotal - totalDiscount) * 100) / 100
    };

    res.json({ updated_cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize sample coupons
export const initializeSampleCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(sampleCoupons);
      console.log('Sample coupons initialized');
    }
  } catch (error) {
    console.error('Error initializing sample coupons:', error);
  }
};
