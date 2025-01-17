import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['cart-wise', 'product-wise', 'bxgy']
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function(details) {
        switch (this.type) {
          case 'cart-wise':
            return (
              typeof details.threshold === 'number' &&
              typeof details.discount === 'number' &&
              details.threshold >= 0 &&
              details.discount > 0 &&
              (!details.maxDiscount || typeof details.maxDiscount === 'number') &&
              (!details.validHours || (
                typeof details.validHours === 'object' &&
                typeof details.validHours.start === 'number' &&
                typeof details.validHours.end === 'number' &&
                details.validHours.start >= 0 &&
                details.validHours.start < 24 &&
                details.validHours.end > 0 &&
                details.validHours.end <= 24
              )) &&
              (!details.validDays || (
                Array.isArray(details.validDays) &&
                details.validDays.every(day => typeof day === 'number' && day >= 0 && day <= 6)
              )) &&
              (!details.category || typeof details.category === 'string') &&
              (!details.firstTimeOnly || typeof details.firstTimeOnly === 'boolean')
            );
          
          case 'product-wise':
            return (
              typeof details.product_id === 'number' &&
              typeof details.discount === 'number' &&
              details.product_id > 0 &&
              details.discount > 0 &&
              details.discount <= 100 &&
              (!details.minQuantity || typeof details.minQuantity === 'number') &&
              (!details.stackable || typeof details.stackable === 'boolean')
            );
          
          case 'bxgy':
            return (
              Array.isArray(details.buy_products) &&
              Array.isArray(details.get_products) &&
              typeof details.repetition_limit === 'number' &&
              details.buy_products.length > 0 &&
              details.get_products.length > 0 &&
              details.repetition_limit > 0 &&
              details.buy_products.every(p => 
                typeof p.product_id === 'number' &&
                typeof p.quantity === 'number' &&
                p.product_id > 0 &&
                p.quantity > 0
              ) &&
              details.get_products.every(p => 
                typeof p.product_id === 'number' &&
                typeof p.quantity === 'number' &&
                p.product_id > 0 &&
                p.quantity > 0
              ) &&
              (!details.stackable || typeof details.stackable === 'boolean')
            );
          
          default:
            return false;
        }
      },
      message: 'Invalid coupon details for the specified type'
    }
  },
  expiryDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ type: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
