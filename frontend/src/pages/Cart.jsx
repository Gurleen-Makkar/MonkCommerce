import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import customTheme from '../theme';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { 
  getApplicableCoupons, 
  applyCoupon, 
  updateQuantity, 
  removeFromCart 
} from '../store/couponSlice';

function Cart() {
  const dispatch = useDispatch();
  const { currentCart, applicableCoupons, status } = useSelector((state) => state.coupons);
  const products = useSelector((state) => state.products.items);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');

  const cartItems = currentCart?.items || [];

  useEffect(() => {
    if (cartItems.length > 0) {
      dispatch(getApplicableCoupons({ items: cartItems }));
    }
  }, [cartItems, dispatch]);

  const handleQuantityChange = (productId, change) => {
    const item = cartItems.find(item => item.product_id === productId);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        dispatch(removeFromCart({ productId }));
      } else {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
      }
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleApplyCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponCode(coupon.code);
    dispatch(applyCoupon({ id: coupon.coupon_id, cart: { items: cartItems } }));
  };

  const handleManualCouponApply = () => {
    const coupon = applicableCoupons?.find(c => c.code === couponCode);
    if (coupon) {
      handleApplyCoupon(coupon);
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setCouponCode('');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getProductDetails = (productId) => {
    return products.find(p => p.id === productId) || {
      name: `Product ${productId}`,
      description: `SKU: ${productId}`
    };
  };

  return (
    <Grid container spacing={4} sx={{ p: 3, backgroundColor: customTheme.colors.background.default }}>
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: customTheme.colors.text.primary
        }}>
          Your cart
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ships at checkout
        </Typography>

        {cartItems.length > 0 && (
          <Paper 
            elevation={0} 
            sx={{ 
              mt: 2, 
              p: 2, 
              border: `1px dashed ${customTheme.colors.divider}`,
              backgroundColor: customTheme.colors.background.paper
            }}
          >
            <Typography variant="body2" sx={{ color: customTheme.colors.info.main }}>
              {calculateSubtotal() >= 1000 ? (
                'You have FREE SHIPPING!'
              ) : (
                `You're ₹${(1000 - calculateSubtotal()).toFixed(2)} away from FREE SHIPPING!`
              )}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((calculateSubtotal() / 1000) * 100, 100)} 
              sx={{ 
                mt: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: customTheme.colors.background.secondary,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: customTheme.colors.info.main
                }
              }}
            />
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          {cartItems.map((item) => {
            const product = getProductDetails(item.product_id);
            return (
              <Grid item xs={12} key={item.product_id}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    border: `1px solid ${customTheme.colors.divider}`,
                    backgroundColor: customTheme.colors.background.default
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 100,
                      height: 100,
                      overflow: 'hidden',
                      borderRadius: 1,
                      border: `1px solid ${customTheme.colors.divider}`,
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 500,
                        color: customTheme.colors.text.primary
                      }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        mt: 0.5,
                        color: customTheme.colors.text.secondary
                      }}>
                        {product.description}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1">
                        ₹{item.price.toFixed(2)}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${customTheme.colors.divider}`,
                        borderRadius: 1,
                        width: 'fit-content',
                        mt: 0.5
                      }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.product_id, -1)}
                          disabled={item.quantity === 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ px: 2 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.product_id, 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={2} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>

                  <IconButton
                    size="small"
                    onClick={() => handleRemoveItem(item.product_id)}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.lighter'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            backgroundColor: customTheme.colors.background.paper,
            border: `1px solid ${customTheme.colors.divider}`,
            position: 'sticky',
            top: 20
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Summary
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <Typography>Bag total</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'right' }}>
              <Typography>₹{(currentCart?.total_price || calculateSubtotal()).toFixed(2)}</Typography>
            </Grid>
          </Grid>

          {selectedCoupon && currentCart?.total_discount > 0 && (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={8}>
                <Typography>
                  Applied Coupon ({selectedCoupon.code})
                  <Button 
                    size="small"
                    sx={{ 
                      ml: 1,
                      color: 'error.main',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        background: 'none',
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </Button>
                </Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography sx={{ color: customTheme.colors.success.main }}>
                  -₹{selectedCoupon.discount.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <Typography>
                Convenience Fee
                <Button 
                  sx={{ 
                    ml: 1, 
                    textTransform: 'none', 
                    color: customTheme.colors.info.main,
                    p: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      background: 'none',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  What&apos;s this?
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'right' }}>
              <Typography>
                <span style={{ color: customTheme.colors.success.main, marginRight: '8px' }}>
                  Free
                </span>
                <span style={{ textDecoration: 'line-through' }}>₹99.00</span>
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={8}>
              <Typography sx={{ fontWeight: 600 }}>Order Total</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontWeight: 600 }}>
                ₹{(currentCart?.final_price || calculateSubtotal()).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Available Coupons
            </Typography>
            {cartItems.length === 0 ? (
              <Alert severity="info" sx={{ mt: 1 }}>
                Add items to cart to see available coupons
              </Alert>
            ) : applicableCoupons?.length > 0 ? (
              <List disablePadding>
                {applicableCoupons.map((coupon) => (
                  <Paper 
                    key={coupon.coupon_id} 
                    elevation={0}
                    sx={{ 
                      mb: 1,
                      border: `1px solid ${customTheme.colors.divider}`,
                      borderRadius: 1
                    }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {coupon.type.toUpperCase()}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: customTheme.colors.success.main }}>
                            Save ₹{coupon.discount.toFixed(2)}
                          </Typography>
                        }
                      />
                      <Button
                        size="small"
                        onClick={() => handleApplyCoupon(coupon)}
                        sx={{ 
                          textTransform: 'none',
                          color: customTheme.colors.primary.main,
                          '&:hover': {
                            backgroundColor: customTheme.colors.primary.light
                          }
                        }}
                      >
                        Apply
                      </Button>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mt: 1 }}>
                No applicable coupons for current cart
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    borderColor: customTheme.colors.divider
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={handleManualCouponApply}
                      disabled={status === 'loading' || !couponCode}
                      sx={{ 
                        textTransform: 'none',
                        minWidth: 'auto',
                        color: customTheme.colors.primary.main,
                        '&:hover': {
                          backgroundColor: customTheme.colors.primary.light
                        }
                      }}
                    >
                      {status === 'loading' ? 'Applying...' : 'Apply'}
                    </Button>
                  )
                }}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: customTheme.colors.primary.main,
              color: customTheme.colors.background.default,
              '&:hover': {
                backgroundColor: customTheme.colors.primary.dark
              }
            }}
          >
            Checkout
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Cart;
