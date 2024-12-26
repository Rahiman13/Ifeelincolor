import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { styled } from '@mui/material/styles';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import { useLocation } from 'react-router-dom';

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51QQ5mPEO0XTlFhbUdSBmDZ0dfl2fiMQVnCbB8mHQE8TTKxakT4ejqO2UDUGEbZe5zr6JSl9irEmIYpmYhc0vD3SV00dQ2x41fY");

// Styled Components
// Styled Components
const PageWrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    transform: 'skewY(-6deg)',
    transformOrigin: 'top left',
  }
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  padding: 0,
  overflow: 'hidden',
  position: 'relative',
  maxWidth: '550px',
  width: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const FormHeader = styled(Box)(({ theme }) => ({
  background: '#fff',
  color: '#1a237e',
  padding: theme.spacing(4),
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  position: 'relative',
}));

const FormContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#fff',
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#fff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a237e',
      },
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a237e',
        borderWidth: '2px',
      },
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': {
      color: '#1a237e',
    }
  },
  marginBottom: theme.spacing(3),
}));

const CardContainer = styled(Box)(({ theme }) => ({
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: theme.spacing(3),
  backgroundColor: '#f8fafc',
  marginBottom: theme.spacing(3),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#fff',
    borderColor: '#1a237e',
  }
}));

const PaymentButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  borderRadius: '8px',
  padding: '12px 24px',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
  },
  '&.Mui-disabled': {
    background: '#e2e8f0',
    color: '#94a3b8',
  }
}));

const StatusDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    maxWidth: '400px',
    width: '100%'
  }
}));

const PaymentIdContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: '#f8fafc',
  padding: theme.spacing(2),
  borderRadius: '8px',
  marginTop: theme.spacing(2),
  '& .copy-button': {
    color: '#64748b',
    '&:hover': {
      color: '#1a237e',
    }
  }
}));

const FinalStatusContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: theme.spacing(3)
}));

const StatusCard = styled(Paper)(({ theme, success }) => ({
  padding: theme.spacing(4),
  maxWidth: '500px',
  width: '100%',
  textAlign: 'center',
  borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  background: '#ffffff',
  border: `2px solid ${success ? '#15803d' : '#dc2626'}`,
}));

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const [paymentDetails] = useState({
    amount: searchParams.get('amount') || "",
    customerName: searchParams.get('orgName') || "",
    orderId: searchParams.get('orderId') || "",
    email: searchParams.get('email') || "",
    validity: searchParams.get('validity') || "",
    clinicians: searchParams.get('clinicians') || ""
  });
  
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFinalStatus, setShowFinalStatus] = useState(false);

  const handleCopyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    setOpenSnackbar(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      alert("Please wait for Stripe to initialize!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://rough-1-gcic.onrender.com/api/payment/create-payment-intent", {
        amount: parseFloat(paymentDetails.amount),
        email: paymentDetails.email,
        orderId: paymentDetails.orderId,
        orgName: paymentDetails.customerName,
        validity: paymentDetails.validity,
        clinicians: paymentDetails.clinicians
      });

      const { clientSecret } = response.data;
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: paymentDetails.customerName },
        },
      });

      if (error) {
        setPaymentStatus("Payment failed! " + error.message);
        setIsSuccess(false);
      } else {
        try {
          const subscriptionResponse = await axios.post(
            "https://rough-1-gcic.onrender.com/api/orgSubscription/create",
            {
              organizationId: paymentDetails.orderId,
              clinicians: paymentDetails.clinicians,
              price: paymentDetails.amount,
              validity: paymentDetails.validity
            }
          );

          if (subscriptionResponse.data.status === "success") {
            setPaymentStatus("Payment and subscription setup successful!");
          } else {
            setPaymentStatus("Payment successful but subscription setup failed. Please contact support.");
          }
        } catch (subscriptionError) {
          console.error("Subscription setup error:", subscriptionError);
          setPaymentStatus("Payment successful but subscription setup failed. Please contact support.");
        }

        setPaymentId(paymentIntent.id);
        setIsSuccess(true);
      }
      setShowFinalStatus(true);
    } catch (err) {
      setPaymentStatus("Error occurred: " + err.message);
      setIsSuccess(false);
      setShowFinalStatus(true);
    } finally {
      setLoading(false);
    }
  };

  if (showFinalStatus) {
    return (
      <FinalStatusContainer>
        <StatusCard success={isSuccess}>
          {isSuccess ? (
            <CheckCircleIcon 
              sx={{ 
                fontSize: 64, 
                color: '#15803d', 
                mb: 2 
              }} 
            />
          ) : (
            <ErrorIcon 
              sx={{ 
                fontSize: 64, 
                color: '#dc2626', 
                mb: 2 
              }} 
            />
          )}
          
          <Typography variant="h4" sx={{ mb: 3, color: isSuccess ? '#15803d' : '#dc2626' }}>
            {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: '#1e293b' }}>
            {paymentStatus}
          </Typography>
          
          {isSuccess && paymentId && (
            <PaymentIdContainer>
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1, 
                  fontFamily: 'monospace',
                  color: '#1e293b'
                }}
              >
                Payment ID: {paymentId}
              </Typography>
              <Tooltip title="Copy Payment ID">
                <IconButton 
                  className="copy-button"
                  onClick={handleCopyPaymentId}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </PaymentIdContainer>
          )}
          
          <Typography variant="body2" sx={{ mt: 4, color: '#64748b' }}>
            {isSuccess 
              ? 'You can close this window now. A confirmation email has been sent to your registered email address.'
              : 'Please contact support if you believe this is an error. You can try the payment again by refreshing the page.'}
          </Typography>
        </StatusCard>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="Payment ID copied to clipboard"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              bgcolor: '#1a237e',
              borderRadius: '8px'
            }
          }}
        />
      </FinalStatusContainer>
    );
  }

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <FormContainer elevation={3}>
          <FormHeader>
            <Typography variant="h4" component="h2" fontWeight="bold" 
              sx={{ textAlign: 'center' }}>
              Organization Payment Details
            </Typography>
          </FormHeader>
          
          <FormContent>
            <form onSubmit={handlePayment}>
              <StyledInput
                fullWidth
                label="Organization Name"
                value={paymentDetails.customerName}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { fontSize: '1.1rem', backgroundColor: '#f5f5f5' }
                }}
              />

              <StyledInput
                fullWidth
                label="Order ID"
                value={paymentDetails.orderId}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { fontSize: '1.1rem', backgroundColor: '#f5f5f5' }
                }}
              />

              <StyledInput
                fullWidth
                label="Amount (USD)"
                value={paymentDetails.amount}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography sx={{ mr: 1, color: '#666' }}>$</Typography>,
                  sx: { fontSize: '1.1rem', backgroundColor: '#f5f5f5' }
                }}
              />

              <StyledInput
                fullWidth
                label="Email"
                value={paymentDetails.email}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { fontSize: '1.1rem', backgroundColor: '#f5f5f5' }
                }}
              />

              <StyledInput
                fullWidth
                label="Validity (days)"
                value={paymentDetails.validity}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { fontSize: '1.1rem', backgroundColor: '#f5f5f5' }
                }}
              />

              <StyledInput
                fullWidth
                label="Number of Clinicians"
                value={paymentDetails.clinicians}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  sx: { fontSize: '1.1rem', backgroundColor: '#f5f5f5' }
                }}
              />

              <CardContainer>
                <Typography variant="subtitle1" sx={{ mb: 2, color: '#666' }}>
                  Enter Card Details
                </Typography>
                <CardElement options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      padding: '10px 0',
                    },
                  },
                }} />
              </CardContainer>

              <PaymentButton
                fullWidth
                type="submit"
                disabled={!stripe || !elements || loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Processing...' : `Pay $${paymentDetails.amount || '0'}`}
              </PaymentButton>
            </form>
            
            {paymentStatus && (
              <Typography
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: paymentStatus.includes('successful') ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
                  color: paymentStatus.includes('successful') ? '#2f855a' : '#c53030',
                  border: `1px solid ${paymentStatus.includes('successful') ? '#48bb78' : '#f56565'}`,
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                }}
              >
                {paymentStatus}
              </Typography>
            )}
          </FormContent>
        </FormContainer>
      </Container>
    </PageWrapper>
  );
};

const StripePaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripePaymentPage;
