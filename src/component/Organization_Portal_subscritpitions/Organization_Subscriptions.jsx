import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaCheckCircle, FaRedo, FaTimesCircle } from 'react-icons/fa';
// import Organizations_SubscriptionCharts from '../subscription-management/Organizations_SubscriptionCharts';
import Organizations_SubscriptionCharts from './Organizations_SubscriptionCharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Backdrop, Box, Typography, Avatar, Tooltip, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
// import './ClinicianSubscription.scss';
import '../subscription-management/ClinicianSubscription.scss';
import Card_circle from '../../assets/circle.png';
import { mdiDoctor, mdiAccountGroup, mdiAccountCheck, mdiRefresh, mdiAccountCancel, mdiAlertCircleOutline, mdiDownload } from '@mdi/js';
import Icon from '@mdi/react';
import BaseUrl from '../../api';


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
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  background: theme.palette.grey[200],

}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  // color: theme.palette.common.white,
  color: theme.palette.common.black,

  fontWeight: '500',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  lineHeight: '1.5rem',
  letterSpacing: '0.05em',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    // backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    // transform: 'translateY(-2px)',
    // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTableCell = styled(TableCell)({
  fontSize: '0.875rem',
  lineHeight: '1.43',
  padding: '16px',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
  marginRight: theme.spacing(1),
}));

const MetricCard = ({ title, value, icon, gradient, percentage }) => (
  <Card className="card-trendy text-white" style={{
    height: '160px',
    background: gradient,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <img
      src={Card_circle}
      className="trendy-card-img-absolute"
      alt="circle"
      style={{
        opacity: 0.8,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    />
    <Card.Body className="d-flex flex-column justify-content-between p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: 500 }}>{title}</h5>
        <Icon path={icon} size={1.5} color="rgba(255,255,255,0.8)" />
      </div>
      <div>
        <h2 className="mb-1" style={{ fontSize: '1.8rem', fontWeight: 600 }}>${value.toFixed(2)}</h2>
        <p className="mb-0" style={{
          fontSize: '0.8rem',
          opacity: 0.8,
          color: percentage.includes('↑') ? '#4CAF50' : percentage.includes('↓') ? '#FF5252' : 'inherit'
        }}>
          {percentage}
        </p>
      </div>
    </Card.Body>
  </Card>
);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    try {
      // Fetch subscription counts
      const countsEndpoint = role === 'manager'
        ? `${BaseUrl}/api/manager/subscriptions-counts`
        : `${BaseUrl}/api/organization/subscription-counts`;

      const countsResponse = await axios.get(countsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (countsResponse.data.status === 'success') {
        const counts = countsResponse.data.body;
        setSubscriptionCounts({
          validSubscriptions: counts.validSubscriptions,
          renewalSubscriptions: counts.renewalSubscriptions,
          endedSubscriptions: counts.endedSubscriptions
        });
      }

      // Fetch subscription details
      const subscriptionsEndpoint = role === 'manager'
        ? `${BaseUrl}/api/manager/subscriptions`
        : `${BaseUrl}/api/organization/subscriptions`;

      const subscriptionsResponse = await axios.get(subscriptionsEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (subscriptionsResponse.data.status === 'success') {
        const apiData = subscriptionsResponse.data.body.map(item => ({
          id: item._id,
          name: item.patient.userName,
          image: item.patient.image, // Add this line to include the image URL
          clinician: item.clinisist ? item.clinisist.name : 'N/A',
          subscribedDate: new Date(item.startDate).toLocaleDateString(),
          endDate: new Date(item.endDate).toLocaleDateString(),
          plan: item.plan.name,
          remainingDays: Math.max(0, Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24))),
          renewals: item.renewal ? [new Date(item.endDate).toLocaleDateString()] : [],
          status: new Date(item.endDate) > new Date() ? 'Active' : 'Cancelled',
        }));
        setSubscriptions(apiData);
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

  const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

  const downloadCSV = () => {
    // Convert subscriptions data to CSV format
    const headers = ['S.No', 'Patient', 'Clinician', 'Subscribed Date', 'End Date', 'Plan', 'Remaining Days', 'Renewals'];
    const csvData = subscriptions.map((sub, index) => [
      index + 1,
      sub.name,
      sub.clinician,
      sub.subscribedDate,
      sub.endDate,
      sub.plan,
      sub.remainingDays,
      sub.renewals.length > 0 ? sub.renewals[sub.renewals.length - 1] : 'No Renewals'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'subscription_details.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="clinician-subscription p-3">
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white text-xl me-2">
                <Icon path={isAdminPortal ? mdiDoctor : mdiAccountGroup} size={1.3} />
              </span>
              {isAdminPortal ? 'Clinician Subscription' : 'Subscriptions'}
            </h3>
            {/* <span>
              Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </span> */}
            <Tooltip
              title={
                <Box sx={{
                  p: 1,
                  maxHeight: '70vh',
                  overflowY: 'auto',
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
                    Subscription Management Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                    A comprehensive dashboard for monitoring and managing subscriptions, providing real-time insights and detailed analytics.
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Key Metrics Display:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Active Subscriptions Count & Revenue</li>
                    <li>Renewal Statistics & Trends</li>
                    <li>Subscription End Tracking</li>
                    <li>Revenue Performance Indicators</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Analytical Features:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Subscription Growth Charts</li>
                    <li>Revenue Trend Analysis</li>
                    <li>Patient Distribution Metrics</li>
                    <li>Clinician Assignment Analytics</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Detailed Records:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Patient-Clinician Mappings</li>
                    <li>Subscription Duration Tracking</li>
                    <li>Plan Type Distribution</li>
                    <li>Renewal History Logs</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Management Tools:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Subscription Status Monitoring</li>
                    <li>Expiration Alerts System</li>
                    <li>Patient Activity Tracking</li>
                    <li>Clinician Performance Metrics</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Data Visualization:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Interactive Charts & Graphs</li>
                    <li>Subscription Timeline Views</li>
                    <li>Revenue Distribution Charts</li>
                    <li>Performance Trend Indicators</li>
                  </ul>

                  <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon path={mdiAlertCircleOutline} size={0.6} />
                      Real-time Updates: Dashboard refreshes automatically to show the latest subscription data
                    </Typography>
                  </Box>
                </Box>
              }
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
                  color: '#1434A4',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  Overview
                </Typography>
                <Icon
                  path={mdiAlertCircleOutline}
                  size={0.8}
                  color="#1434A4"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                    animation: 'pulse 2s infinite'
                  }}
                />
              </Box>
            </Tooltip>
          </div>
          <Container fluid>
            <Row className="mb-4">
              <Col md={4} className="mb-3">
                <MetricCard
                  title="Active Subscriptions"
                  value={subscriptionCounts.validSubscriptions}
                  icon={mdiAccountCheck}
                  gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                  percentage={`${subscriptionCounts.validSubscriptions}% of total${subscriptionCounts.validSubscriptions === 0 ? '' :
                    subscriptionCounts.validSubscriptions > subscriptionCounts.endedSubscriptions ? ' ↑' : ' ↓'
                    }`}
                />
              </Col>
              <Col md={4} className="mb-3">
                <MetricCard
                  title="Renewals"
                  value={subscriptionCounts.renewalSubscriptions}
                  icon={mdiRefresh}
                  gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                  percentage={`${subscriptionCounts.renewalSubscriptions}% of total${subscriptionCounts.renewalSubscriptions === 0 ? '' :
                    subscriptionCounts.renewalSubscriptions > subscriptionCounts.validSubscriptions ? ' ↑' : ' ↓'
                    }`}
                />
              </Col>
              <Col md={4} className="mb-3">
                <MetricCard
                  title="Ended Subscriptions"
                  value={subscriptionCounts.endedSubscriptions}
                  icon={mdiAccountCancel}
                  gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                  percentage={`${subscriptionCounts.endedSubscriptions}% of total${subscriptionCounts.endedSubscriptions === 0 ? '' :
                    subscriptionCounts.endedSubscriptions > subscriptionCounts.validSubscriptions ? ' ↑' : ' ↓'
                    }`}
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col>
                <Organizations_SubscriptionCharts
                  subscriptions={subscriptions}
                  chartTitle={isAdminPortal ? "Clinician Subscription Analysis" : "Subscription Analysis"}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                {/* <StyledTableContainer component={Paper} className='px-4 pt-3'> */}
                <StyledTableContainer component={Paper} className='p-0'>
                  <TableHeaderBox>
                    <Typography variant="h6" component="h4" style={{ color: 'white', fontWeight: 'bold' }}>
                      Subscription Details
                    </Typography>
                    {/* <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<Icon path={mdiEye} size={0.8} />}
                      onClick={this.handleViewAllClick}
                    >
                      View All
                    </Button> */}
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<Icon path={mdiDownload} size={0.8} />}
                      onClick={downloadCSV}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      Download CSV
                    </Button>
                  </TableHeaderBox>
                  <StyledTable aria-label="clinician subscription table">
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                        <StyledHeaderCell align="center">Patient</StyledHeaderCell>
                        <StyledHeaderCell align="center">Clinician</StyledHeaderCell>
                        <StyledHeaderCell align="center">Subscribed Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">End Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">Plan</StyledHeaderCell>
                        <StyledHeaderCell align="center">Remaining Days</StyledHeaderCell>
                        <StyledHeaderCell align="center">Renewals</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sub, index) => (
                        <StyledTableRow key={sub.id}>
                          <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                          <StyledTableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <StyledAvatar src={sub.image} alt={sub.name}>
                                {sub.name.charAt(0)}
                              </StyledAvatar>
                              {sub.name}
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell align="center">{sub.clinician}</StyledTableCell>
                          <StyledTableCell align="center">{sub.subscribedDate}</StyledTableCell>
                          <StyledTableCell align="center">{sub.endDate}</StyledTableCell>
                          <StyledTableCell align="center">{sub.plan}</StyledTableCell>
                          <StyledTableCell align="center">{sub.remainingDays}</StyledTableCell>
                          <StyledTableCell align="center">
                            {sub.renewals.length > 0 ? sub.renewals[sub.renewals.length - 1] : 'No Renewals'}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    component="div"
                    count={subscriptions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </StyledTableContainer>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}
