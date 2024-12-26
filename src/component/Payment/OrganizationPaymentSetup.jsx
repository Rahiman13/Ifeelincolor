import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCashMultiple, mdiAlertCircleOutline, mdiCashRegister } from '@mdi/js';
import {
  Card,
  Typography,
  Box,
  CircularProgress,
  Button,
  Backdrop, Tooltip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import BaseUrl from '../../api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';



// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51QQ5mPEO0XTlFhbUdSBmDZ0dfl2fiMQVnCbB8mHQE8TTKxakT4ejqO2UDUGEbZe5zr6JSl9irEmIYpmYhc0vD3SV00dQ2x41fY");

// Add these styled components
const PageContainer = styled('div')(({ theme }) => ({
  background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
  minHeight: '100vh',
  padding: theme.spacing(4),
  fontFamily: "'Poppins', sans-serif",
  color: '#1a365d',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '220px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    zIndex: 0,
    borderRadius: '0 0 50px 50px',
  }
}));

const PageHeader = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  // background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  // padding: theme.spacing(1),
  // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  // border: '1px solid rgba(255, 255, 255, 0.2)',
  '.page-title': {
    fontSize: '3rem',
    fontWeight: 700,
    // background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'white',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  '.page-title-icon': {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '16px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
    // transform: 'rotate(-10deg)',
    width: '48px',
    height: '48px',
  }
}));

const PaymentCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledInput = styled('input')(({ theme }) => ({
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.9)',
  transition: 'all 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
  }
}));

const StyledSelect = styled('select')(({ theme }) => ({
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.9)',
  transition: 'all 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
  }
}));

const StyledButton = styled(Button)(({ theme, color }) => ({
  background: color === 'primary'
    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '12px',
  padding: '12px 24px',
  color: '#fff',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  }
}));

// Add CardContainer styled component
const CardContainer = styled(Box)(({ theme }) => ({
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  padding: theme.spacing(2),
  backgroundColor: '#f8fafc',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#fff',
    borderColor: '#3b82f6',
  },
  '& .StripeElement': {
    padding: '10px',
  }
}));

const PaymentView = ({ searchParams, loading, setLoading }) => {
  const elements = useElements();
  const stripe = useStripe();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayNow = async (e) => {
    e.preventDefault();
    setPaymentError('');

    try {
      setLoading(true);

      const response = await axios.post(`${BaseUrl}/api/payment/create-payment-intent`, {
        amount: searchParams.get('amount'),
        email: searchParams.get('email'),
        orderId: searchParams.get('orderId'),
        orgName: searchParams.get('orgName'),
        validity: searchParams.get('validity'),
        clinicians: searchParams.get('clinicians')
      });

      if (response.data && response.data.clientSecret) {
        const result = await stripe.confirmCardPayment(response.data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: searchParams.get('email'),
              name: searchParams.get('orgName')
            },
          }
        });

        if (result.error) {
          toast.error(result.error.message, {
            position: 'top-right',
            autoClose: 4000,
          });
          setPaymentError(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          setPaymentSuccess(true);
          
          // Show success message with SweetAlert2
          await Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            text: 'Your payment has been processed successfully.',
            confirmButtonColor: '#3b82f6',
          });

          // Navigate to transaction details
          navigate('/transaction-details', {
            state: {
              paymentStatus: 'success',
              amount: searchParams.get('amount'),
              email: searchParams.get('email'),
              orgName: searchParams.get('orgName'),
              validity: searchParams.get('validity'),
              clinicians: searchParams.get('clinicians'),
              orderId: searchParams.get('orderId'),
              transactionId: result.paymentIntent.id
            }
          });
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'Payment processing failed. Please try again.',
        confirmButtonColor: '#3b82f6',
      });
      setPaymentError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            {/* <Icon path={mdiCashMultiple} size={1.5} color="#ffffff" /> */}
            <Icon
              path={mdiCashMultiple}
              size={1.5}
              color="#ffffff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>
          <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
            Organization Payment
          </span>
        </div>
        <Tooltip
          title={
            <Box sx={{
              p: 1,
              maxHeight: '70vh', // Set maximum height
              overflowY: 'auto', // Enable vertical scrolling
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '10px',
                '&:hover': {
                  background: 'rgba(255,255,255,0.4)',
                },
              },
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Organization Payment System
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                A secure and efficient payment processing system for managing organization subscriptions and clinician access.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Payment Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Secure Stripe integration for payment processing</li>
                <li>Multiple payment methods support</li>
                <li>Automated receipt generation</li>
                <li>Transaction history tracking</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Subscription Management:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Flexible subscription periods</li>
                <li>Customizable clinician limits</li>
                <li>Automatic renewal options</li>
                <li>Prorated billing support</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Security Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>PCI DSS compliance</li>
                <li>Encrypted transaction data</li>
                <li>Secure payment processing</li>
                <li>Fraud detection and prevention</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Administrative Tools:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Payment link generation</li>
                <li>Transaction monitoring</li>
                <li>Subscription status tracking</li>
                <li>Payment dispute handling</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Reporting and Analytics:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Revenue tracking and forecasting</li>
                <li>Subscription analytics</li>
                <li>Payment success rates</li>
                <li>Churn analysis</li>
              </ul>

              <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon path={mdiAlertCircleOutline} size={0.6} />
                  Secure Payment: All transactions are processed through Stripe's secure payment gateway
                </Typography>
              </Box>
            </Box>
          }
        // ... rest of the tooltip props remain the same ...
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '12px',
          }}>
            <Typography sx={{
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}>
              Overview
            </Typography>
            <Icon
              path={mdiAlertCircleOutline}
              size={0.8}
              color="#fff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                animation: 'pulse 2s infinite'
              }}
            />
          </Box>
        </Tooltip>
      </PageHeader>

      <PaymentCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>

          {/* Display payment details in read-only fields */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Organization Name
            </Typography>
            <Typography variant="body1">
              {searchParams.get('orgName')}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {searchParams.get('email')}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body1">
              ${searchParams.get('amount')}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Validity (days)
            </Typography>
            <Typography variant="body1">
              {searchParams.get('validity')}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Number of Clinicians
            </Typography>
            <Typography variant="body1">
              {searchParams.get('clinicians')}
            </Typography>
          </Box>

          {/* Card Element */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Card Details
            </Typography>
            <CardContainer>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </CardContainer>
          </Box>

          {/* Error Message */}
          {paymentError && (
            <Typography
              color="error"
              sx={{ mb: 2 }}
            >
              {paymentError}
            </Typography>
          )}

          {/* Success Message */}
          {paymentSuccess && (
            <Typography
              color="success.main"
              sx={{ mb: 2 }}
            >
              Payment successful! Redirecting...
            </Typography>
          )}

          {/* Pay Now Button */}
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handlePayNow}
            disabled={loading || !stripe || !elements || paymentSuccess}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Pay Now'
            )}
          </StyledButton>
        </Box>
      </PaymentCard>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </PageContainer>
  );
};

const OrganizationPayment = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    email: '',
    amount: '',
    validity: '',
    clinicians: ''
  });
  const [generatedLink, setGeneratedLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState('');
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Check if this is a payment link view
  const searchParams = new URLSearchParams(location.search);
  const isPaymentView = searchParams.get('view') === 'payment';

  useEffect(() => {
    if (isPaymentView) {
      // Set payment details from URL parameters
      const urlParams = {
        email: searchParams.get('email'),
        amount: searchParams.get('amount'),
        validity: searchParams.get('validity'),
        clinicians: searchParams.get('clinicians'),
        orgName: searchParams.get('orgName')
      };
      console.log("URL Parameters:", urlParams);
      setPaymentDetails(urlParams);
    } else {
      fetchOrganizations();
    }
  }, [location.search]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const adminPortal = sessionStorage.getItem('adminPortal');
      const token = sessionStorage.getItem('token');

      // console.log('Admin Portal:', adminPortal);
      // console.log('Token:', token);

      if (adminPortal === 'true' && token) {
        const response = await axios.get(`${BaseUrl}/api/admin/organizations`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // console.log('API Response:', response.data);

        if (response.data.status === 'success') {
          const activeOrgsWithoutSub = response.data.body.filter(org =>
            org.active === false && !org.subscription
          );
          // console.log('Filtered organizations:', activeOrgsWithoutSub);
          setOrganizations(activeOrgsWithoutSub);
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerateLink = () => {
    try {
      // Validate required fields
      if (!paymentDetails.email || !paymentDetails.amount ||
        !paymentDetails.validity || !paymentDetails.clinicians) {
        toast.error('Please fill in all required fields', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
        });
        return;
      }

      // Generate the payment link with all necessary parameters
      const paymentLink = `${window.location.origin}/payment/stripe?view=payment&email=${encodeURIComponent(paymentDetails.email)}&amount=${encodeURIComponent(paymentDetails.amount)}&validity=${encodeURIComponent(paymentDetails.validity)}&clinicians=${encodeURIComponent(paymentDetails.clinicians)}&orgName=${encodeURIComponent(selectedOrg?.companyName || selectedOrg?.name)}&orderId=${encodeURIComponent(selectedOrg?._id)}`;

      console.log('Generated Link:', paymentLink);
      setGeneratedPaymentLink(paymentLink);
      setGeneratedLink(true);
      
      toast.success('Payment link generated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // Render payment view if accessed via payment link
  if (isPaymentView) {
    return (
      <Elements stripe={stripePromise}>
        <PaymentView searchParams={searchParams} loading={loading} setLoading={setLoading} />
      </Elements>
    );
  }

  // Render admin view for generating payment link
  return (
    <PageContainer>
      <PageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            <Icon
              // path={mdiCashMultiple}
              path={mdiCashRegister}
              size={1.5}
              color="#ffffff"
            />
          </div>
          <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
            Organization Payment Setup
          </span>
        </div>
        <Tooltip
          title={
            <Box sx={{
              p: 1,
              maxHeight: '70vh', // Set maximum height
              overflowY: 'auto', // Enable vertical scrolling
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '10px',
                '&:hover': {
                  background: 'rgba(255,255,255,0.4)',
                },
              },
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Organization Payment System
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                A secure and efficient payment processing system for managing organization subscriptions and clinician access.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Payment Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Secure Stripe integration for payment processing</li>
                <li>Multiple payment methods support</li>
                <li>Automated receipt generation</li>
                <li>Transaction history tracking</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Subscription Management:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Flexible subscription periods</li>
                <li>Customizable clinician limits</li>
                <li>Automatic renewal options</li>
                <li>Prorated billing support</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Security Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>PCI DSS compliance</li>
                <li>Encrypted transaction data</li>
                <li>Secure payment processing</li>
                <li>Fraud detection and prevention</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Administrative Tools:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Payment link generation</li>
                <li>Transaction monitoring</li>
                <li>Subscription status tracking</li>
                <li>Payment dispute handling</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Reporting and Analytics:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Revenue tracking and forecasting</li>
                <li>Subscription analytics</li>
                <li>Payment success rates</li>
                <li>Churn analysis</li>
              </ul>

              <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon path={mdiAlertCircleOutline} size={0.6} />
                  Secure Payment: All transactions are processed through Stripe's secure payment gateway
                </Typography>
              </Box>
            </Box>
          }
        // ... rest of the tooltip props remain the same ...
        >
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '12px',
          }}>
            <Typography sx={{
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}>
              Overview
            </Typography>
            <Icon
              path={mdiAlertCircleOutline}
              size={0.8}
              color="#fff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                animation: 'pulse 2s infinite'
              }}
            />
          </Box>
        </Tooltip>
      </PageHeader>

      {!generatedLink ? (
        <PaymentCard>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Payment Setup
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1, fontWeight: 500 }}>Organization</Typography>
            <StyledSelect
              value={paymentDetails.email}
              onChange={(e) => {
                const org = organizations.find(org => org.email === e.target.value);
                setSelectedOrg(org);
                setPaymentDetails(prev => ({
                  ...prev,
                  email: e.target.value
                }));
              }}
            >
              <option value="">Select Organization</option>
              {organizations.map((org) => (
                <option key={org._id} value={org.email}>
                  {org.companyName || org.name} ({org.email})
                </option>
              ))}
            </StyledSelect>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 4 }}>
            <div>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Amount</Typography>
              <StyledInput
                type="number"
                name="amount"
                value={paymentDetails.amount}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Validity (in days)</Typography>
              <StyledInput
                type="number"
                name="validity"
                value={paymentDetails.validity}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>Number of Clinicians</Typography>
              <StyledInput
                type="number"
                name="clinicians"
                value={paymentDetails.clinicians}
                onChange={handleInputChange}
              />
            </div>
          </Box>

          <StyledButton
            color="primary"
            onClick={handleGenerateLink}
          >
            Generate Payment Link
          </StyledButton>
        </PaymentCard>
      ) : (
        <PaymentCard>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
            Payment Link Generated
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 2, fontWeight: 500 }}>
              Share this link with the organization:
            </Typography>
            <Box sx={{
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: 2,
              wordBreak: 'break-all'
            }}>
              {generatedPaymentLink}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(generatedPaymentLink);
                toast.success('Link copied to clipboard!', {
                  position: 'top-right',
                  autoClose: 2000,
                });
              }}
            >
              Copy Link
            </StyledButton>
            <StyledButton
              color="secondary"
              onClick={() => setGeneratedLink(false)}
            >
              Generate New Link
            </StyledButton>
          </Box>
        </PaymentCard>
      )}

      {loading && (
        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </PageContainer>
  );
};

export default OrganizationPayment;
