# Monk Commerce

A modern coupon management system built with React and Node.js. Check out the demo:

<video src="video.mov" controls title="Demo Video"></video>

## What's this about?

This is a full-stack application that helps manage different types of coupons and discounts. Whether you need simple percentage discounts or complex buy-one-get-one deals, we've got you covered.

## Implemented Features

### Cart-level Discounts
We've implemented a wide range of cart-based discounts:

- **Basic Discounts**
  - Percentage discounts (e.g., 10% off on orders above ₹1000)
  - Flat amount off (e.g., ₹500 off on orders above ₹5000)
  - Maximum discount caps
  - Minimum purchase requirements
  - User-specific limits
  - Stackable/non-stackable options

- **Time-based Offers**
  - Happy hour discounts
  - Weekend specials
  - Flash sales
  - Peak/off-peak pricing
  - Seasonal discounts
  - Holiday offers
  - Early bird specials
  - Last-minute deals

- **User-specific Deals**
  - First-time user discounts
  - New vs existing user offers
  - Loyalty tier benefits
  - Account age rewards
  - Purchase history based offers
  - Membership perks
  - Referral rewards
  - Win-back offers

- **Location & Device**
  - Geo-specific pricing
  - Store-specific deals
  - Regional offers
  - Mobile/desktop specific discounts
  - App-only deals
  - Online vs in-store pricing
  - Delivery zone discounts
  - Click-and-collect offers

### Product-specific Discounts
For individual products, we support:

- **Basic Product Offers**
  - Percentage off specific items
  - Fixed amount discounts
  - Buy X% off deals
  - Quantity-based requirements
  - Maximum purchase limits
  - Stackable options
  - Category restrictions

- **Advanced Product Rules**
  - Size-specific deals
  - Color-based offers
  - Material-based discounts
  - Quality grade pricing
  - Package size offers
  - Bundle deals
  - Custom configuration pricing

### Buy X Get Y (BOGO) Deals
Flexible BOGO implementations including:

- **Basic BOGO**
  - Multiple product combos
  - Mix and match options
  - Quantity thresholds
  - Value-based triggers
  - Time restrictions
  - User limits

- **Advanced Combinations**
  - Same product (Buy 2 Get 1)
  - Cross-product offers
  - Cross-category deals
  - Premium-budget combos
  - Seasonal bundles

### Complex Scenarios

- **Multi-currency Support**
  - Real-time exchange rates
  - Regional pricing
  - Market-specific strategies
  - B2B/B2C pricing
  - Bulk order matrices

- **Tax Handling**
  - Tax-inclusive/exclusive pricing
  - GST/VAT calculations
  - State-specific rules
  - Regulatory compliance

- **Shipping Rules**
  - Free shipping thresholds
  - Location-based rates
  - Weight-based discounts
  - Express shipping deals
  - International shipping

## Tech Stack

- **Frontend**: React, Redux, Material-UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **State Management**: Redux with Redux Toolkit

## Quick Start

1. Clone and install dependencies:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install
```

2. Fire up the servers:
```bash
# Start backend (from backend directory)
npm start

# Start frontend (from frontend directory)
npm run dev
```

## API Endpoints

### Coupons
- `POST /coupons` - Create a coupon
- `GET /coupons` - List all coupons
- `GET /coupons/:id` - Get coupon details
- `PUT /coupons/:id` - Update a coupon
- `DELETE /coupons/:id` - Delete a coupon

### Cart Operations
- `POST /applicable-coupons` - Get valid coupons for cart
- `POST /apply-coupon/:id` - Apply coupon to cart

## Current Limitations

- Single currency support (INR only)
- One coupon per cart (unless marked as stackable)
- No user authentication
- Basic error handling
- Limited inventory tracking
- No distributed caching
- Limited automated testing
- Basic performance optimization

## Roadmap

### Short-term
- User authentication
- Multi-currency support
- Advanced analytics
- Mobile app
- Better error handling

### Long-term
- ML-powered recommendations
- Advanced fraud detection
- Real-time analytics dashboard
- Multi-level referral system
- Advanced inventory management
- Cross-border commerce
- Subscription management

## Contributing

Feel free to open issues and submit PRs. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT
