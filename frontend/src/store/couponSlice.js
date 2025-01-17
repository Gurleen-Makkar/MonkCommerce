import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponApi } from '../services/api';

// Async thunks
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchAll',
  async () => {
    const response = await couponApi.getAllCoupons();
    return response;
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/create',
  async (couponData) => {
    const response = await couponApi.createCoupon(couponData);
    return response;
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/update',
  async ({ id, couponData }) => {
    const response = await couponApi.updateCoupon(id, couponData);
    return response;
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/delete',
  async (id) => {
    await couponApi.deleteCoupon(id);
    return id;
  }
);

export const getApplicableCoupons = createAsyncThunk(
  'coupons/getApplicable',
  async (cart) => {
    const response = await couponApi.getApplicableCoupons(cart);
    return response;
  }
);

export const applyCoupon = createAsyncThunk(
  'coupons/apply',
  async ({ id, cart }) => {
    const response = await couponApi.applyCoupon(id, cart);
    return response;
  }
);

const initialState = {
  coupons: [],
  applicableCoupons: [],
  currentCart: null,
  status: 'idle',
  error: null,
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product } = action.payload;
      const currentItems = state.currentCart?.items || [];
      const existingItem = currentItems.find(item => item.product_id === product.id);

      if (existingItem) {
        state.currentCart = {
          items: currentItems.map(item =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        state.currentCart = {
          items: [...currentItems, {
            product_id: product.id,
            quantity: 1,
            price: product.price
          }]
        };
      }
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      const currentItems = state.currentCart?.items || [];
      
      state.currentCart = {
        items: currentItems.filter(item => item.product_id !== productId)
      };
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const currentItems = state.currentCart?.items || [];

      if (quantity === 0) {
        state.currentCart = {
          items: currentItems.filter(item => item.product_id !== productId)
        };
      } else {
        state.currentCart = {
          items: currentItems.map(item =>
            item.product_id === productId
              ? { ...item, quantity }
              : item
          )
        };
      }
    },
    clearCart: (state) => {
      state.currentCart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create coupon
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload);
      })
      // Update coupon
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(coupon => coupon._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      // Delete coupon
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(coupon => coupon._id !== action.payload);
      })
      // Get applicable coupons
      .addCase(getApplicableCoupons.fulfilled, (state, action) => {
        state.applicableCoupons = action.payload.applicable_coupons;
      })
      // Apply coupon
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.currentCart = action.payload.updated_cart;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = couponSlice.actions;

export default couponSlice.reducer;
