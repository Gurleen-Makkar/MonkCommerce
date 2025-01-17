import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import customTheme from '../theme';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { updateCoupon } from '../store/couponSlice';
import { couponApi } from '../services/api';

function EditCoupon() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('cart-wise');
  const [formData, setFormData] = useState({
    cart_wise: {
      threshold: '',
      discount: ''
    },
    product_wise: {
      product_id: '',
      discount: ''
    },
    bxgy: {
      buy_products: [{ product_id: '', quantity: '' }],
      get_products: [{ product_id: '', quantity: '' }],
      repetition_limit: ''
    }
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await couponApi.getCouponById(id);
        const coupon = response.data;
        setType(coupon.type);
        setFormData(prev => ({
          ...prev,
          [coupon.type.replace('-', '_')]: coupon.details
        }));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch coupon:', error);
        navigate('/coupons');
      }
    };
    fetchCoupon();
  }, [id, navigate]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [type.replace('-', '_')]: {
        ...prev[type.replace('-', '_')],
        [field]: value
      }
    }));
  };

  const handleProductArrayChange = (arrayType, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      bxgy: {
        ...prev.bxgy,
        [arrayType]: prev.bxgy[arrayType].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addProduct = (arrayType) => {
    setFormData(prev => ({
      ...prev,
      bxgy: {
        ...prev.bxgy,
        [arrayType]: [...prev.bxgy[arrayType], { product_id: '', quantity: '' }]
      }
    }));
  };

  const removeProduct = (arrayType, index) => {
    setFormData(prev => ({
      ...prev,
      bxgy: {
        ...prev.bxgy,
        [arrayType]: prev.bxgy[arrayType].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentData = formData[type.replace('-', '_')];
    
    const couponData = {
      type,
      details: type === 'bxgy' ? currentData : {
        ...currentData,
        threshold: Number(currentData.threshold),
        discount: Number(currentData.discount),
        product_id: currentData.product_id ? Number(currentData.product_id) : undefined
      }
    };

    try {
      await dispatch(updateCoupon({ id, couponData })).unwrap();
      navigate('/coupons');
    } catch (error) {
      console.error('Failed to update coupon:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: customTheme.colors.background.default }}>
      <Typography variant="h4" sx={{ 
        mb: 4,
        fontWeight: 600,
        color: customTheme.colors.text.primary 
      }}>
        Edit Coupon
      </Typography>

      <Card 
        elevation={0}
        sx={{ 
          maxWidth: 800,
          mx: 'auto',
          border: `1px solid ${customTheme.colors.divider}`,
          backgroundColor: customTheme.colors.background.paper
        }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Coupon Type</InputLabel>
              <Select 
                value={type} 
                onChange={handleTypeChange} 
                label="Coupon Type"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: customTheme.colors.divider
                  }
                }}
              >
                <MenuItem value="cart-wise">Cart-wise</MenuItem>
                <MenuItem value="product-wise">Product-wise</MenuItem>
                <MenuItem value="bxgy">Buy X Get Y</MenuItem>
              </Select>
            </FormControl>

            {type === 'cart-wise' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Threshold Amount (₹)"
                  type="number"
                  value={formData.cart_wise.threshold}
                  onChange={(e) => handleInputChange('threshold', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Discount Percentage"
                  type="number"
                  value={formData.cart_wise.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  required
                />
              </>
            )}

            {type === 'product-wise' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Product ID"
                  type="number"
                  value={formData.product_wise.product_id}
                  onChange={(e) => handleInputChange('product_id', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Discount Percentage"
                  type="number"
                  value={formData.product_wise.discount}
                  onChange={(e) => handleInputChange('discount', e.target.value)}
                  required
                />
              </>
            )}

            {type === 'bxgy' && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Buy Products
                  <IconButton
                    onClick={() => addProduct('buy_products')}
                    size="small"
                    sx={{ 
                      color: customTheme.colors.primary.main,
                      '&:hover': {
                        backgroundColor: customTheme.colors.primary.light
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Typography>

                {formData.bxgy.buy_products.map((product, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Product ID"
                        type="number"
                        value={product.product_id}
                        onChange={(e) => handleProductArrayChange('buy_products', index, 'product_id', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductArrayChange('buy_products', index, 'quantity', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      {index > 0 && (
                        <IconButton
                          onClick={() => removeProduct('buy_products', index)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.lighter'
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Get Products
                  <IconButton
                    onClick={() => addProduct('get_products')}
                    size="small"
                    sx={{ 
                      color: customTheme.colors.primary.main,
                      '&:hover': {
                        backgroundColor: customTheme.colors.primary.light
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Typography>

                {formData.bxgy.get_products.map((product, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Product ID"
                        type="number"
                        value={product.product_id}
                        onChange={(e) => handleProductArrayChange('get_products', index, 'product_id', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleProductArrayChange('get_products', index, 'quantity', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={2}>
                      {index > 0 && (
                        <IconButton
                          onClick={() => removeProduct('get_products', index)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': {
                              backgroundColor: 'error.lighter'
                            }
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}

                <TextField
                  fullWidth
                  margin="normal"
                  label="Repetition Limit"
                  type="number"
                  value={formData.bxgy.repetition_limit}
                  onChange={(e) => handleInputChange('repetition_limit', e.target.value)}
                  required
                />
              </>
            )}

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  backgroundColor: customTheme.colors.primary.main,
                  color: customTheme.colors.background.default,
                  '&:hover': {
                    backgroundColor: customTheme.colors.primary.dark
                  }
                }}
              >
                Update Coupon
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditCoupon;
