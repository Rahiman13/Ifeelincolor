import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ToastContainer, Toast } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle, FaSearch, FaChartBar, FaBell, FaHistory, FaCog, FaEye, FaCalendarCheck, FaChartPie } from 'react-icons/fa';
import OrganizationSubscriptionCharts from './OrganizationSubscriptionCharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, TablePagination, CircularProgress, Backdrop, Box, Typography, Chip, Tooltip, LinearProgress } from '@mui/material';
import { styled, alpha, keyframes } from '@mui/material/styles';
import './OrganizationSubscription.scss';
import Card_circle from '../../assets/circle.png';
import { mdiOfficeBuilding, mdiAlertCircleOutline } from '@mdi/js';
import { FaBuilding, FaCalendarAlt, FaDollarSign, FaUsers, FaStar, FaMapMarkerAlt, FaGlobe, FaChartLine, FaUserTie } from 'react-icons/fa';
import Icon from '@mdi/react';
import axios from 'axios';
import { mdiMagnify } from '@mdi/js';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../../api';


// Keyframes for animations
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  transition: 'all 0.3s ease',
  '&:hover': {
    // boxShadow: '0 15px 40px 0 rgba(0,0,0,0.2)',
    // transform: 'translateY(-5px)',
  },
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
  textAlign: 'center',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '&:hover': {
    // backgroundColor: alpha(theme.palette.primary.light, 0.1),
    transition: 'all 0.3s ease',
    transform: 'translateY(-2px)',
    // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
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
  '& .MuiLinearProgress-bar': {
    backgroundImage: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
  },
}));

const PulseChip = styled(Chip)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
}));

// Add these new styled components at the top (after existing styled components)
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

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
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

export default function OrganizationSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metricCounts, setMetricCounts] = useState({
    active: 0,
    renewal: 0,
    ended: 0
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const adminPortal = sessionStorage.getItem('adminPortal');
      const token = sessionStorage.getItem('token');

      if (adminPortal === 'true' && token) {
        try {
          const subscriptionsResponse = await axios.get(`${BaseUrl}/api/orgSubscription/getAll`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const countsResponse = await axios.get(`${BaseUrl}/api/orgSubscription/subscriptionCounts`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (subscriptionsResponse.data.status === 'success') {
            const validSubscriptions = subscriptionsResponse.data.data.filter(sub => sub && sub.organization);
            setSubscriptions(validSubscriptions);
          } else {
            setSubscriptions([]);
          }

          if (countsResponse.data.status === 'success') {
            setMetricCounts({
              active: countsResponse.data.data.validSubscriptions || 0,
              renewal: countsResponse.data.data.renewalSubscriptions || 0,
              ended: countsResponse.data.data.endedSubscriptions || 0
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setToastMessage('Failed to fetch data');
          setShowToast(true);
          setSubscriptions([]);
        }
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const getFilteredSubscriptions = () => {
    const validSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

    if (!searchQuery) {
      return validSubscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }

    const query = searchQuery.toLowerCase();
    const filtered = validSubscriptions.filter(sub => {
      if (!sub?.organization) return false;

      const name = sub.organization.name?.toLowerCase() || '';
      const email = sub.organization.email?.toLowerCase() || '';
      const companyName = sub.organization.companyName?.toLowerCase() || '';

      return name.includes(query) ||
        email.includes(query) ||
        companyName.includes(query);
    });

    return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return (
    <StyledDashboard>
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <StyledPageHeader>
            <div className="page-title">
              <div className="page-title-icon">
                {/* <Icon path={mdiOfficeBuilding} size={1.5} color="#ffffff" /> */}
                <Icon
                  path={mdiOfficeBuilding}
                  size={1.5}
                  color="#ffffff"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
              <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                Organization Subscription
              </span>
            </div>
            <Tooltip
              title={
                <Box sx={{ p: 1, maxWidth: 500 }}>
                  <Typography variant="h6" sx={{
                    color: '#fff',
                    mb: 2,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    pb: 1
                  }}>
                    Organization Subscription Management
                  </Typography>

                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                    A comprehensive dashboard for managing and monitoring organizational subscriptions,
                    providing real-time insights into subscription statuses, renewals, and analytics.
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{
                      color: '#fff',
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FaChartLine /> Key Metrics
                    </Typography>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: 'rgba(255,255,255,0.9)',
                      listStyleType: 'none'
                    }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaCheckCircle size={12} color="#4CAF50" /> Active Subscriptions
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaRedo size={12} color="#FFA726" /> Pending Renewals
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaTimesCircle size={12} color="#EF5350" /> Ended Subscriptions
                      </li>
                    </ul>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{
                      color: '#fff',
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FaUsers /> Key Features
                    </Typography>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: 'rgba(255,255,255,0.9)',
                      listStyleType: 'none'
                    }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaSearch size={12} /> Advanced Search & Filtering
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaChartBar size={12} /> Subscription Analytics
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaBell size={12} /> Renewal Notifications
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaHistory size={12} /> Subscription History
                      </li>
                    </ul>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{
                      color: '#fff',
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FaCog /> Available Actions
                    </Typography>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: 'rgba(255,255,255,0.9)',
                      listStyleType: 'none'
                    }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaEye size={12} /> View detailed organization information
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaCalendarCheck size={12} /> Monitor subscription status
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <FaChartPie size={12} /> Access analytics dashboard
                      </li>
                    </ul>
                  </Box>

                  <Box sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    borderRadius: 1,
                    border: '1px solid rgba(33, 150, 243, 0.2)'
                  }}>
                    <Typography variant="caption" sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#90CAF9'
                    }}>
                      <Icon path={mdiAlertCircleOutline} size={0.6} />
                      Pro Tip: Use the search bar to quickly find specific organizations by name, email, or company name.
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
                  maxWidth: 500
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
                      {metricCounts.active}
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
                      {calculatePercentageChange(metricCounts.active, metricCounts.active + metricCounts.ended)} of total
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
                      {metricCounts.renewal}
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
                      {calculatePercentageChange(metricCounts.renewal, metricCounts.active + metricCounts.ended)} of total
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
                      {metricCounts.ended}
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
                      {calculatePercentageChange(metricCounts.ended, metricCounts.active + metricCounts.ended)} of total
                    </Typography>
                    <FaTimesCircle size={32} style={{ opacity: 0.2 }} />
                  </Box>
                </ModernMetricCard>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <OrganizationSubscriptionCharts
                  subscriptions={subscriptions}
                  chartTitle="Organization Subscription Analysis"
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
                      justifyContent: 'space-between', // Add this
                      width: '100%', // Add this
                      // gap: 3,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          color: 'white',
                          fontWeight: 'bold',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        Organization Subscription Details
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
                          bottom: '-10px',
                          left: '350px',
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
                        {`Found ${subscriptions.filter(sub =>
                          sub.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.organization.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.organization.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length} results`}
                      </Box>
                    </Box>
                  </TableHeaderBox>
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell sx={{ width: '20%' }}>Organization Info</StyledHeaderCell>
                        <StyledHeaderCell sx={{ width: '20%' }}>Company Details</StyledHeaderCell>
                        <StyledHeaderCell sx={{ width: '20%' }}>Subscription Details</StyledHeaderCell>
                        <StyledHeaderCell sx={{ width: '15%' }}>Clinicians</StyledHeaderCell>
                        <StyledHeaderCell sx={{ width: '25%' }}>Location</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {getFilteredSubscriptions().map((sub) => sub && (
                        <StyledTableRow key={sub._id || 'unknown'}>
                          <StyledTableCell>
                            <Box display="flex" flexDirection="column" alignItems="center">
                              <AnimatedAvatar alt={sub.organization.name} src={sub.organization.image} sx={{ width: 60, height: 60, marginBottom: 1 }} />
                              <Typography variant="subtitle2">{sub.organization.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{sub.organization.email}</Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title={sub.organization.companyName} arrow>
                              <StyledChip
                                icon={<FaBuilding />}
                                label={sub.organization.companyName}
                                variant="outlined"
                                color="primary"
                              />
                            </Tooltip>
                            <Box mt={1}>
                              <IconWrapper sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                              }}>
                                <FaGlobe />
                                <Typography variant="body2">
                                  {sub.organization.established ? new Date(sub.organization.established).getFullYear() : 'N/A'}
                                </Typography>
                              </IconWrapper>
                            </Box>
                            <Box mt={1}>
                              <IconWrapper sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                              }}>
                                <FaUserTie />
                                <Typography variant="body2">
                                  {/* {sub.organization.established ? new Date(sub.organization.established).getFullYear() : 'N/A'} */}
                                  Founder: {sub.organization.founder || 'N/A'}
                                </Typography>
                              </IconWrapper>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title={`Subscribed: ${new Date(sub.startDate).toLocaleDateString()}\nEnds: ${new Date(sub.endDate).toLocaleDateString()}`} arrow>
                              <Box>
                                <IconWrapper sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 1
                                }}>
                                  <FaCalendarAlt />
                                  <Typography variant="body2">{sub.validity} days</Typography>
                                </IconWrapper>
                              </Box>
                            </Tooltip>
                            <Box mt={1}>
                              <IconWrapper sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1
                              }}>
                                <FaDollarSign />
                                <Typography variant="body2">{sub.price}</Typography>
                              </IconWrapper>
                            </Box>
                            <PulseChip
                              label={sub.renewal ? 'Renewal' : 'New'}
                              color={sub.renewal ? 'primary' : 'secondary'}
                              size="small"
                              style={{ marginTop: '8px' }}
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <Tooltip title={`${sub.clinicians} clinicians`} arrow>
                              <Box>
                                <Typography variant="body2" display="flex" alignItems="center">
                                  <FaUsers style={{ marginRight: '8px' }} />
                                  {sub.clinicians} Clinicians
                                </Typography>
                                <ProgressWrapper>
                                  <StyledLinearProgress variant="determinate" value={(sub.clinicians / 100) * 100} />
                                </ProgressWrapper>
                              </Box>
                            </Tooltip>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box>
                              <IconWrapper sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <FaMapMarkerAlt />
                                <Typography variant="body2">{sub.organization.address || 'N/A'}</Typography>
                              </IconWrapper>
                            </Box>
                            {/* <Box mt={1}>
                              <IconWrapper sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <FaUserTie />
                                <Typography variant="body2">Founder: {sub.organization.founder || 'N/A'}</Typography>
                              </IconWrapper>
                            </Box> */}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    component="div"
                    count={Array.isArray(subscriptions) ? subscriptions.filter(sub => {
                      if (!searchQuery) return true;
                      if (!sub?.organization) return false;

                      const query = searchQuery.toLowerCase();
                      const name = sub.organization.name?.toLowerCase() || '';
                      const email = sub.organization.email?.toLowerCase() || '';
                      const companyName = sub.organization.companyName?.toLowerCase() || '';

                      return name.includes(query) ||
                        email.includes(query) ||
                        companyName.includes(query);
                    }).length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    sx={{
                      borderTop: '1px solid rgba(224, 224, 224, 1)',
                      backgroundColor: '#f5f5f5',
                    }}
                  />
                </StyledTableContainer>
              </Col>
            </Row>
          </Container>
        </>
      )}

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </StyledDashboard>
  );
}
