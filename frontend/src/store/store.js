import { configureStore } from '@reduxjs/toolkit';
import couponReducer from './couponSlice';
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    coupons: couponReducer,
    products: productReducer,
  },
});

export default store;
