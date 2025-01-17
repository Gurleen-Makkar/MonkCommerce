import { createSlice } from '@reduxjs/toolkit';

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

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: products,
    status: 'idle',
    error: null
  },
  reducers: {}
});

export default productSlice.reducer;
