import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
import ClinicianSubscriptionCharts from './ClinicianSubscriptionCharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Backdrop, Box, Typography, Chip, Avatar, Tooltip, LinearProgress } from '@mui/material';
import { styled, alpha, createTheme } from '@mui/material/styles';
import './ClinicianSubscription.scss';
import Card_circle from '../../assets/circle.png';
import { mdiDoctor } from '@mdi/js';
import { FaUserMd, FaCalendarAlt, FaDollarSign, FaClock, FaUsers, FaStar, FaChartLine, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import Icon from '@mdi/react';
import { ThemeProvider } from '@mui/material/styles';
import { mdiAlertCircleOutline, mdiMagnify } from '@mdi/js';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../../api';


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
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
  minWidth: 650,
});

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
    // transform: 'translateY(-2px)',
    // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
    : 'linear-gradient(45deg, #e74c3c, #c0392b)',
  padding: '10px 15px',
  borderRadius: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
  },
}));

const IconWrapper = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const ProgressWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '10px',
  borderRadius: '5px',
}));

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
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'Duration not specified';

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate the difference in milliseconds
  const diffTime = Math.abs(end - start);

  // Convert to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '1 day';
  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'}`;
};

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '24px 24px 0 0',
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

export default function ClinicianSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionCounts, setSubscriptionCounts] = useState({
    validSubscriptions: 0,
    renewalSubscriptions: 0,
    endedSubscriptions: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (!isAdminPortal) {
      setLoading(false);
      return;
    }

    try {
      // Fetch subscription counts
      const countsResponse = await axios.get(`${BaseUrl}/api/doctorSub/counts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (countsResponse.data.status === 'success') {
        setSubscriptionCounts(countsResponse.data.body);
      }

      // Fetch subscription details (if needed)
      const response = await axios.get(`${BaseUrl}/api/doctorSub/getAll`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setSubscriptions(response.data.body);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setToastMessage('Failed to fetch data');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Add this function to filter subscriptions based on search query
  const getFilteredSubscriptions = () => {
    return subscriptions.filter(sub => {
      if (!searchQuery) return true;

      const clinicianName = sub.clinician?.name?.toLowerCase() || '';
      const clinicianEmail = sub.clinician?.email?.toLowerCase() || '';
      const searchLower = searchQuery.toLowerCase();

      return clinicianName.includes(searchLower) ||
        clinicianEmail.includes(searchLower);
    });
  };

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
                    path={mdiDoctor}
                    size={1.5}
                    color="#ffffff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                </div>
                <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  Clinician Subscription
                </span>
              </div>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Clinician Subscription Management System
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                      A comprehensive dashboard for managing and monitoring clinician subscriptions, providing detailed insights into subscription statuses, revenue metrics, and user engagement.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Dashboard Overview:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                      <li>Active Subscriptions: Track currently active clinician memberships</li>
                      <li>Renewal Status: Monitor upcoming and pending subscription renewals</li>
                      <li>Ended Subscriptions: View historical subscription data</li>
                      <li>Performance Analytics: Visual representation of subscription trends</li>
                    </ul>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                      Key Features:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                      <li>Real-time subscription tracking and monitoring</li>
                      <li>Advanced search and filtering capabilities</li>
                      <li>Detailed clinician profiles and history</li>
                      <li>Subscription status indicators and alerts</li>
                      <li>Performance metrics and analytics</li>
                      <li>Payment tracking and revenue insights</li>
                      <li>Automated renewal notifications</li>
                    </ul>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                      Data Management:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                      <li>Clinician personal and professional information</li>
                      <li>Subscription plan details and pricing</li>
                      <li>Payment history and transaction logs</li>
                      <li>Career history and specializations</li>
                      <li>Patient engagement metrics</li>
                      <li>Performance ratings and reviews</li>
                    </ul>

                    <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Icon path={mdiAlertCircleOutline} size={0.6} />
                        Admin Access Required: Full access to all features requires administrative privileges
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
                        {subscriptionCounts.validSubscriptions}
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
                        {calculatePercentageChange(subscriptionCounts.validSubscriptions, subscriptionCounts.validSubscriptions + subscriptionCounts.endedSubscriptions)} of total
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
                        {/* <FaRedo className="fs-1 mr-3" /> */}
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.renewalSubscriptions}
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
                        {calculatePercentageChange(subscriptionCounts.renewalSubscriptions, subscriptionCounts.validSubscriptions + subscriptionCounts.endedSubscriptions)} of total
                      </Typography>
                      <FaRedo size={32} style={{ opacity: 0.2 }} />
                      {/* <FaRedo className="fs-1 mr-3" /> */}
                    </Box>
                  </ModernMetricCard>
                </Col>
                <Col md={4} className="mb-3">
                  <ModernMetricCard gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)">
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                        Ended Subscriptions
                        {/* <FaTimesCircle className="fs-1 me-3" /> */}
                      </Typography>
                      <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                        {subscriptionCounts.endedSubscriptions}
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
                        {calculatePercentageChange(subscriptionCounts.endedSubscriptions, subscriptionCounts.validSubscriptions + subscriptionCounts.endedSubscriptions)} of total
                      </Typography>
                      {/* <FaTimesCircle className="fs-1 me-3" /> */}
                      <FaTimesCircle size={32} style={{ opacity: 0.2 }} />
                    </Box>
                  </ModernMetricCard>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <ClinicianSubscriptionCharts
                    subscriptions={subscriptions}
                    chartTitle="Clinician Subscription Analysis"
                  />
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
                        justifyContent: 'space-between',
                        width: '100%',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            Clinician Subscription Details
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
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
                          {searchQuery && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: '-24px',
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
                              {`Found ${getFilteredSubscriptions().length} results`}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </TableHeaderBox>
                    <StyledTable>
                      <StyledTableHead>
                        <TableRow>
                          <StyledHeaderCell>Patient Information</StyledHeaderCell>
                          <StyledHeaderCell>Specialization & Experience</StyledHeaderCell>
                          <StyledHeaderCell>Subscription Details</StyledHeaderCell>
                          <StyledHeaderCell>Performance Metrics</StyledHeaderCell>
                          <StyledHeaderCell>Career History</StyledHeaderCell>
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {getFilteredSubscriptions()
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((sub) => (
                            <StyledTableRow key={sub._id}>
                              <StyledTableCell>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    alt={sub.clinician?.name || 'Unknown'}
                                    src={sub.clinician?.image}
                                    sx={{ marginRight: 2 }}
                                  />
                                  <div>
                                    <div>{sub.clinician?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                      {sub.clinician?.email || 'No email'}
                                    </div>
                                  </div>
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Tooltip title={sub.clinician?.specializedIn || 'Not specified'} arrow>
                                  <Chip
                                    icon={<FaUserMd />}
                                    label={sub.clinician?.specializedIn || 'Not specified'}
                                    variant="outlined"
                                    size="small"
                                  />
                                </Tooltip>
                                <div style={{ marginTop: '8px' }}>
                                  <IconWrapper>
                                    <FaGraduationCap />
                                  </IconWrapper>
                                  {sub.clinician?.experince || 'Not specified'}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Tooltip title={`Subscribed: ${new Date(sub.startDate).toLocaleDateString()}\nEnds: ${new Date(sub.endDate).toLocaleDateString()}`} arrow>
                                  <div>
                                    <IconWrapper>
                                      <FaCalendarAlt />
                                    </IconWrapper>
                                    {sub.validity} days
                                  </div>
                                </Tooltip>
                                <div>
                                  <IconWrapper>
                                    <FaDollarSign />
                                  </IconWrapper>
                                  ${sub.price}
                                </div>
                                <StatusChip
                                  label={sub.active ? 'Active' : 'Inactive'}
                                  status={sub.active ? 'Active' : 'Inactive'}
                                />
                              </StyledTableCell>
                              <StyledTableCell>
                                <Tooltip title={`${sub.patients} patients`} arrow>
                                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <FaUsers style={{ marginRight: '8px' }} />
                                    <ProgressWrapper>
                                      <StyledLinearProgress variant="determinate" value={(sub.patients / 100) * 100} />
                                    </ProgressWrapper>
                                  </div>
                                </Tooltip>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <Chip
                                    icon={<FaStar style={{ color: '#ffc107' }} />}
                                    label={sub.clinician?.ratings}
                                    variant="outlined"
                                    size="small"
                                  />
                                </div>
                                <div>
                                  <IconWrapper>
                                    <FaMapMarkerAlt />
                                  </IconWrapper>
                                  {sub.clinician?.location}
                                </div>
                              </StyledTableCell>
                              <StyledTableCell>
                                <div style={{ fontSize: '0.8rem', marginBottom: '8px' }}>
                                  {sub.clinician?.highlights || 'No highlights'}
                                </div>
                                {sub.clinician?.careerpath?.map((career, index) => (
                                  <Tooltip
                                    key={index}
                                    title={
                                      <div>
                                        <div>{career.description || 'No description'}</div>
                                        <div>Organization: {career.organizationName || 'Not specified'}</div>
                                        <div>Specialty: {career.specialty || 'Not specified'}</div>
                                        <div>Start Date: {career.startDate ? new Date(career.startDate).toLocaleDateString() : 'Not specified'}</div>
                                        <div>End Date: {career.endDate ? new Date(career.endDate).toLocaleDateString() : 'Not specified'}</div>
                                      </div>
                                    }
                                    arrow
                                  >
                                    <Chip
                                      label={`${career.name} (${calculateDuration(career.startDate, career.endDate)})`}
                                      variant="outlined"
                                      size="small"
                                      style={{ margin: '2px' }}
                                    />
                                  </Tooltip>
                                )) || 'No career path information'}
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </StyledTable>
                    <TablePagination
                      component="div"
                      count={getFilteredSubscriptions().length}
                      page={page}
                      onPageChange={handleChangePage}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </StyledTableContainer>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </StyledDashboard>
    </ThemeProvider>
  );
}
