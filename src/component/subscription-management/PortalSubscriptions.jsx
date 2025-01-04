import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
import SubscriptionCharts from './PortalSubscriptionCharts';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Backdrop, Box, Typography, Avatar, Chip, Tooltip } from '@mui/material';
import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import './PortalSubscription.scss';
import Card_circle from '../../assets/circle.png';
import { mdiMonitor, mdiAlertCircleOutline, mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../../api';


// Create a theme with the necessary color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    success: {
      main: '#4caf50',
      contrastText: '#fff',
    },
    warning: {
      main: '#ff9800',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
      contrastText: '#fff',
    },
  },
});

// Styled components (same as in ClinicianSubscription)
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
  minWidth: 650,
});

const TableHeaderBox = styled(Box)(({ theme }) => ({
  // background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',

  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    // backgroundColor: theme.palette.action.selected,
    transition: 'all 0.3s ease',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  color: theme.palette.common.white,
  background: status === 'Active'
    ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
    : status === 'Renewal'
      ? 'linear-gradient(45deg, #f1c40f, #f39c12)'
      : 'linear-gradient(45deg, #e74c3c, #c0392b)',
  padding: '8px 12px',
  borderRadius: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
  },
}));

// Add these new styled components
const InfoChip = styled(Chip)(({ theme, $color, $hoverColor }) => ({
  margin: '4px',
  backgroundColor: 'transparent',
  background: $color,
  color: '#fff',
  fontWeight: 'bold',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  borderRadius: '20px',
  padding: '8px 12px',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    background: $hoverColor,
  },
  transition: 'all 0.3s ease',
}));

const PatientAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  border: '3px solid white',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const DetailBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transform: 'translateY(-2px)',
  },
}));

// Add these new styled components at the top
const StyledDashboard = styled('div')(({ theme }) => ({
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

const StyledPageHeader = styled('div')(({ theme }) => ({
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

// Add this styled component definition
const ModernMetricCard = styled(Card)(({ gradient }) => ({
  background: gradient || 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '24px',
  height: '160px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  },
  '& .MuiTypography-root': {
    color: '#fff',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '135px',
    height: '240px',
    backgroundImage: `url(${Card_circle})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    opacity: 0.6,
    zIndex: 0,
  }
}));

// Update the SearchContainer styled component
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',

  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(8px)',
  borderRadius: '16px',
  padding: '8px 16px',
  width: '300px',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',

  '&:hover, &:focus-within': {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',

    '&::before': {
      transform: 'translateX(300px)',
    },

    '& .search-icon': {
      transform: 'rotate(90deg)',
      color: '#fff',
    },

    '& input::placeholder': {
      color: 'rgba(255, 255, 255, 0.8)',
    }
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100px',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    transition: 'transform 0.5s',
    transform: 'translateX(-100px)',
  },

  '& input': {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    padding: '4px 8px',
    fontSize: '0.875rem',
    color: '#fff',
    fontWeight: '500',
    letterSpacing: '0.5px',

    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.6)',
      transition: 'color 0.3s ease',
    }
  },

  '& .search-icon': {
    transition: 'all 0.3s ease',
    color: 'rgba(255, 255, 255, 0.6)',
  }
}));

export default function PortalSubscription() {
  const [doctorSubscriptions, setDoctorSubscriptions] = useState([]);
  const [portalSubscriptions, setPortalSubscriptions] = useState([]);
  const [subscriptionCounts, setSubscriptionCounts] = useState({
    active: 0,
    renewal: 0,
    ended: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const adminPortal = sessionStorage.getItem('adminPortal');
      const token = sessionStorage.getItem('token');

      if (adminPortal === 'true' && token) {
        try {
          // Fetch both types of subscriptions in parallel
          const [doctorResponse, portalResponse] = await Promise.all([
            axios.get(`${BaseUrl}/api/admin/doctor-plan-subscriptions`, {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get(`${BaseUrl}/api/admin/subscriptions`, {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

          if (doctorResponse.data.status === 'success' && portalResponse.data.status === 'success') {
            setDoctorSubscriptions(doctorResponse.data.body);
            setPortalSubscriptions(portalResponse.data.body);
            
            // Combine both subscription types for counts
            const allSubscriptions = [
              ...doctorResponse.data.body,
              ...portalResponse.data.body
            ];
            
            // Calculate combined subscription counts
            const counts = allSubscriptions.reduce((acc, sub) => {
              if (new Date(sub.endDate) < new Date()) {
                acc.ended++;
              } else if (sub.renewal) {
                acc.renewal++;
              } else {
                acc.active++;
              }
              return acc;
            }, { active: 0, renewal: 0, ended: 0 });
            
            setSubscriptionCounts(counts);
          } else {
            setToastMessage('Failed to fetch subscriptions');
            setShowToast(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setToastMessage('Error fetching data');
          setShowToast(true);
        }
      } else {
        setToastMessage('Unauthorized access');
        setShowToast(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculatePercentageChange = (current, total) => {
    if (total === 0) return '0%';
    const percentage = (current / total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const getFilteredSubscriptions = () => {
    // Combine both subscription types
    const allSubscriptions = [
      ...doctorSubscriptions.map(sub => ({ ...sub, type: 'doctor' })),
      ...portalSubscriptions.map(sub => ({ ...sub, type: 'portal' }))
    ];

    let filtered = [...allSubscriptions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.patient && sub.patient.userName && sub.patient.userName.toLowerCase().includes(query) ||
        sub.patient && sub.patient.email && sub.patient.email.toLowerCase().includes(query)
      );
    }

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Helper function to get combined subscriptions
  const getAllSubscriptions = () => {
    return [
      ...doctorSubscriptions.map(sub => ({ ...sub, type: 'doctor' })),
      ...portalSubscriptions.map(sub => ({ ...sub, type: 'portal' }))
    ];
  };

  if (loading) {
    return (
      <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledDashboard>
        {loading ? (
          <Backdrop open={loading} style={{ zIndex: 9999, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <StyledPageHeader>
              <div className="page-title">
                <div className="page-title-icon">
                  <Icon
                    path={mdiMonitor}
                    size={1.5}
                    color="#ffffff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                </div>
                <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  Portal Subscription
                </span>
              </div>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Portal Subscription Management Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                      A comprehensive dashboard for managing and monitoring all subscription-related activities.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Key Features:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                      <li>Real-time subscription metrics and analytics</li>
                      <li>Detailed patient subscription tracking</li>
                      <li>Subscription status monitoring (Active/Renewal/Expired)</li>
                      <li>Advanced search and filtering capabilities</li>
                      <li>Payment history and transaction logs</li>
                      <li>Automated renewal notifications</li>
                      <li>Subscription plan management</li>
                    </ul>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                      Available Actions:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                      <li>View detailed patient information</li>
                      <li>Monitor subscription statuses</li>
                      <li>Track renewal dates and expiration</li>
                      <li>Access contact information</li>
                      <li>View subscription plan details</li>
                      <li>Generate subscription reports</li>
                      <li>Manage payment information</li>
                    </ul>

                    <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon path={mdiAlertCircleOutline} size={0.6} />
                        Pro Tip: Use the search bar to quickly find specific subscriptions by patient name or email
                      </Typography>
                    </Box>
                  </Box>
                }
                arrow
                placement="bottom-end"
                sx={{
                  '& .MuiTooltip-tooltip': {
                    bgcolor: 'rgba(33, 33, 33, 0.95)',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: 400
                  },
                  '& .MuiTooltip-arrow': {
                    color: 'rgba(33, 33, 33, 0.95)',
                  }
                }}
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
            </StyledPageHeader>

            <Container fluid>
              <Row className="mb-4">
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Active Subscriptions
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.active}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography variant="body2">
                        {calculatePercentageChange(
                          subscriptionCounts.active,
                          subscriptionCounts.active + subscriptionCounts.renewal + subscriptionCounts.ended
                        )} of total
                      </Typography>
                      <FaCheckCircle size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Renewals
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.renewal}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography variant="body2">
                        {calculatePercentageChange(
                          subscriptionCounts.renewal,
                          subscriptionCounts.active + subscriptionCounts.renewal + subscriptionCounts.ended
                        )} of total
                      </Typography>
                      <FaRedo size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Ended Subscriptions
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.ended}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography variant="body2">
                        {calculatePercentageChange(
                          subscriptionCounts.ended,
                          subscriptionCounts.active + subscriptionCounts.renewal + subscriptionCounts.ended
                        )} of total
                      </Typography>
                      <FaTimesCircle size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <SubscriptionCharts subscriptions={getAllSubscriptions()} />
                </Col>
              </Row>

              <Row>
                <Col>
                  <StyledTableContainer sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden'
                  }}>
                    <TableHeaderBox>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', // Add this
                        width: '100%', // Add this
                        // gap: 3,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <Typography variant="h6" component="h4" style={{ color: 'white', fontWeight: 'bold' }}>
                          Portal Subscription Details
                        </Typography>
                        <SearchContainer>
                          <Icon
                            path={mdiMagnify}
                            size={0.9}
                            className="search-icon"
                            style={{
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search subscriptions..."
                            value={searchQuery}
                            onChange={handleSearch}
                            style={{
                              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                          {searchQuery && (
                            <Box
                              component="span"
                              sx={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  transform: 'translateY(-50%) scale(1.1)',
                                }
                              }}
                              onClick={() => setSearchQuery('')}
                            >
                              <CloseIcon
                                sx={{
                                  fontSize: '14px',
                                  color: 'rgba(255, 255, 255, 0.8)',
                                }}
                              />
                            </Box>
                          )}
                        </SearchContainer>
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: '-16px',
                            right: '0',

                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.75rem',
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            opacity: searchQuery ? 1 : 0,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          <Icon
                            path={mdiMagnify}
                            size={0.5}
                            color="rgba(255, 255, 255, 0.6)"
                          />
                          {`Found ${getAllSubscriptions().filter(sub =>
                            sub.patient?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            sub.patient?.email?.toLowerCase().includes(searchQuery.toLowerCase())
                          ).length} results`}
                        </Box>
                      </Box>
                    </TableHeaderBox>
                    <StyledTable aria-label="subscription table">
                      <StyledTableHead>
                        <TableRow>
                          <StyledHeaderCell>Patient Information</StyledHeaderCell>
                          <StyledHeaderCell>Subscription Type</StyledHeaderCell>
                          <StyledHeaderCell>Provider Information</StyledHeaderCell>
                          <StyledHeaderCell>Subscription Details</StyledHeaderCell>
                          <StyledHeaderCell>Status</StyledHeaderCell>
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {getFilteredSubscriptions().map((sub, index) => (
                          <StyledTableRow key={sub._id}>
                            <StyledTableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Tooltip title={`Patient ID: ${sub.patient._id}`} arrow>
                                  <PatientAvatar
                                    src={sub.patient.image}
                                    alt={sub.patient.userName}
                                  >
                                    {sub.patient.userName?.charAt(0)}
                                  </PatientAvatar>
                                </Tooltip>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {sub.patient.userName || '-'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {sub.patient.email}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="text.secondary">
                                    Phone: {sub.patient.mobile}
                                  </Typography>
                                </Box>
                              </Box>
                            </StyledTableCell>

                            <StyledTableCell>
                              <Chip
                                label={sub.type === 'doctor' ? 'Doctor Plan' : 'Portal Plan'}
                                color={sub.type === 'doctor' ? 'primary' : 'secondary'}
                                sx={{ fontWeight: 'bold' }}
                              />
                            </StyledTableCell>

                            <StyledTableCell>
                              {sub.type === 'doctor' && sub.clinisist ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Tooltip title={`Doctor ID: ${sub.clinisist._id}`} arrow>
                                    <PatientAvatar
                                      src={sub.clinisist.image}
                                      alt={sub.clinisist.name}
                                    >
                                      {sub.clinisist.name?.charAt(0)}
                                    </PatientAvatar>
                                  </Tooltip>
                                  <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                      {sub.clinisist.name}
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                      {sub.clinisist.specializedIn}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Experience: {sub.clinisist.experience}
                                    </Typography>
                                  </Box>
                                </Box>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  Portal Subscription
                                </Typography>
                              )}
                            </StyledTableCell>

                            <StyledTableCell>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <InfoChip
                                  label={`${sub.plan.name} - $${sub.plan.price}`}
                                  $color="linear-gradient(45deg, #1976d2, #64b5f6)"
                                  $hoverColor="linear-gradient(45deg, #64b5f6, #1976d2)"
                                />
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarTodayIcon fontSize="small" />
                                    Start: {new Date(sub.startDate).toLocaleDateString()}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <EventBusyIcon fontSize="small" />
                                    End: {new Date(sub.endDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Box>
                            </StyledTableCell>

                            <StyledTableCell>
                              <StatusChip
                                label={sub.renewal ? 'Renewal' : (new Date(sub.endDate) > new Date() ? 'Active' : 'Expired')}
                                status={sub.renewal ? 'Renewal' : (new Date(sub.endDate) > new Date() ? 'Active' : 'Expired')}
                              />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={getAllSubscriptions().length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </StyledTableContainer>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </StyledDashboard>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ThemeProvider>
  );
}
