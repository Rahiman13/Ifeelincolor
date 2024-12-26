import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Backdrop, CircularProgress, Typography, Box, Button, Tooltip } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card_circle from '../../assets/circle.png';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiChartLine, mdiCashMultiple, mdiEye, mdiMonitor, mdiDoctor, mdiOfficeBuilding, mdiAlertCircleOutline, mdiDownload } from '@mdi/js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns'; // Add this import at the top of your file
import { styled, alpha, keyframes } from '@mui/material/styles';
// import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import BaseUrl from '../../api';


// Add these styled components at the top of your file, after the imports
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  color: 'white',
};

const StyledTable = styled(Table)({
  minWidth: 700,
});

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

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     // backgroundColor: alpha(theme.palette.primary.light, 0.05),
//   },
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.light, 0.1),
//     transform: 'translateY(-2px)',
//     // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//   },
//   transition: 'all 0.3s ease',
// }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'white',
  '&:nth-of-type(odd)': {
  },
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'translateY(-2px)',
    // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTableCell = styled(TableCell)({
  fontSize: '0.875rem',
  lineHeight: '1.43',
  padding: '16px',
});

// Add these new styled components and keyframes
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '20px', // Slightly less rounded for a classic look
    background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    border: 'none',
    color: theme.palette.common.white,
    padding: '4px 10px', // Adjusted padding for a more compact look
    transition: 'all 0.3s ease-in-out',
    width: '140px', // Decreased width for a more compact look
    fontSize: '0.7rem', // Decreased text size for a more compact look
    fontWeight: '600',
    '&:hover': {
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)', // Softer shadow for a classic feel
      transform: 'translateY(-1px)',
    },
    '&::before, &::after': {
      display: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '5px 12px',
    width: 'calc(100% - 60px)', // Adjust width to accommodate the calendar icon
    '&::placeholder': {
      // color: 'rgba(255,255,255,0.7)',
      color: 'white',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
  '&:hover .MuiInputBase-root::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '468px 100%',
    animation: `${shimmer} 2s infinite`,
    zIndex: 1,
    borderRadius: '30px',
  },
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
          color: percentage.startsWith('↑') ? '#4CAF50' : percentage.startsWith('↓') ? '#FF5252' : 'inherit'
        }}>
          {percentage}
        </p>
      </div>
    </Card.Body>
  </Card>
);

const calculatePercentageIncrease = (current, previous) => {
  if (!current || !previous) return '0% of total';
  if (previous === 0) return current > 0 ? '100% of total' : '0% of total';

  const increase = ((current - previous) / Math.abs(previous)) * 100;
  const formattedValue = Math.abs(increase).toFixed(1);

  if (increase > 0) {
    return `↑ ${formattedValue}% of total`;
  } else if (increase < 0) {
    return `↓ ${formattedValue}% of total`;
  }
  return '0% of total';
};

const downloadCSV = (subscriptions) => {
  // Define CSV headers based on role
  const isAdmin = sessionStorage.getItem('role') === 'Admin';
  const headers = [
    'S.No',
    'Name',
    'Email',
    ...(isAdmin ? [] : ['Clinician']),
    'Plan',
    'Price',
    'Start Date',
    'End Date',
    'Renewal'
  ].join(',');

  // Convert subscriptions to CSV rows
  const csvRows = subscriptions.map((subscription, index) => {
    const row = [
      index + 1,
      subscription.patient.userName || '-',
      subscription.patient.email,
      ...(isAdmin ? [] : [subscription.clinisist?.name || 'N/A']),
      subscription.plan?.name || 'N/A',
      subscription.plan?.price ? `$${subscription.plan.price.toFixed(2)}` : 'N/A',
      new Date(subscription.startDate).toLocaleDateString(),
      new Date(subscription.endDate).toLocaleDateString(),
      subscription.renewal ? 'Yes' : 'No'
    ].map(cell => `"${cell}"`).join(',');
    return row;
  });

  // Combine headers and rows
  const csvContent = [headers, ...csvRows].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'earnings_details.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const BudgetAnalysis = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [budgetData, setBudgetData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // January 1st of current year
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), 11, 31)); // December 31st of current year
  const [metricData, setMetricData] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);

  // Initial load
  useEffect(() => {
    const initialFetch = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([fetchMetricData(), fetchBudgetData(), fetchSubscriptions()]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setInitialLoading(false);
      }
    };
    initialFetch();
  }, []); // Empty dependency array for initial load only

  // Date change updates
  useEffect(() => {
    if (!initialLoading) { // Only run this effect after initial load
      const updateData = async () => {
        setLoading(true);
        try {
          await Promise.all([fetchMetricData(), fetchBudgetData()]);
        } catch (error) {
          console.error('Error updating data:', error);
          toast.error('Failed to update data');
        } finally {
          setLoading(false);
        }
      };
      updateData();
    }
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMetricData(), fetchBudgetData(), fetchSubscriptions()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetricData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      let url;

      if (role === 'organization') {
        url = `${BaseUrl}/api/organization/earnings`;
      } else if (role === 'manager') {
        url = `${BaseUrl}/api/manager/earnings`;
      }

      if (url) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.body;

        // Get current month and year
        const currentDate = new Date();
        const currentMonthKey = format(currentDate, 'yyyy-MM');

        // Extract current month earnings
        const currentMonthEarnings = data.monthlyEarnings[currentMonthKey] || 0;

        setMetricData({
          currentMonthEarnings: currentMonthEarnings,
          currentYearEarnings: data.currentYearTotal || 0,
          totalEarnings: data.allTimeTotal || 0
        });
      }
    } catch (error) {
      console.error('Error fetching metric data:', error);
      toast.error('Failed to fetch metric data');
      // Set default values on error
      setMetricData({
        currentMonthEarnings: 0,
        currentYearEarnings: 0,
        totalEarnings: 0
      });
    }
  };

  const fetchBudgetData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      let url;

      // Use current year if startDate or endDate is null
      const currentYear = new Date().getFullYear();
      const start = startDate ? startDate.toISOString().split('T')[0] : `${currentYear}-01-01`;
      const end = endDate ? endDate.toISOString().split('T')[0] : `${currentYear}-12-31`;

      if (role === 'manager') {
        url = `${BaseUrl}/api/manager/earnings?startDate=${start}&endDate=${end}`;
      } else {
        url = `${BaseUrl}/api/organization/earnings?startDate=${start}&endDate=${end}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.body;

      if (role === 'organization') {
        // Calculate current year total
        const currentYearTotal = Object.entries(data.monthlyEarnings)
          .filter(([key]) => key.startsWith(currentYear.toString()))
          .reduce((total, [, value]) => total + value, 0);

        // Calculate previous year total
        const previousYear = currentYear - 1;
        const previousYearTotal = Object.entries(data.monthlyEarnings)
          .filter(([key]) => key.startsWith(previousYear.toString()))
          .reduce((total, [, value]) => total + value, 0);

        data.currentYearTotal = currentYearTotal;
        data.previousYearTotal = previousYearTotal;
      }

      setBudgetData(data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      toast.error('Failed to fetch budget data');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      let url;

      if (role === 'manager') {
        url = `${BaseUrl}/api/manager/subscriptions`;
      }
      else if (role === 'Admin') {
        url = `${BaseUrl}/api/admin/subscriptions`;

      } else {
        url = `${BaseUrl}/api/organization/subscriptions`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscriptions(response.data.body);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to fetch subscriptions');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1
          }
        }
      },
      toolbar: {
        show: true,
        tools: {
          download: `<i class='mdi mdi-download fs-4'></i>`,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        },
        export: {
          csv: {
            filename: 'Earnings Analysis Data',
            columnDelimiter: ',',
            headerCategory: 'Month',
            headerValue: 'Earnings',
          },
          svg: {
            filename: 'Earnings Analysis Chart',
          },
          png: {
            filename: 'Earnings Analysis Chart',
          }
        },
        autoSelected: 'zoom'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
        distributed: false,
      }
    },
    colors: ['#1a2980'],
    xaxis: {
      categories: Object.keys(budgetData?.monthlyEarnings || {})
        .filter(key => {
          const date = new Date(key);
          if (!startDate && !endDate) {
            return date.getFullYear() === new Date().getFullYear();
          }
          return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        })
        .map(key => {
          const date = new Date(key);
          return format(date, 'MMM yyyy');
        }),
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Earnings ($)',
        style: {
          fontSize: '14px'
        }
      },
      labels: {
        formatter: function (value) {
          return `$${value.toFixed(2)}`;
        }
      }
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: '#90A4AE',
      strokeDashArray: 4,
      opacity: 0.2
    },
    theme: {
      mode: 'light',
      palette: 'palette1'
    }
  };

  const chartSeries = budgetData ? [
    {
      name: 'Monthly Earnings',
      data: Object.entries(budgetData.monthlyEarnings)
        .filter(([key]) => {
          const date = new Date(key);
          // If no dates selected, show current year's data
          if (!startDate && !endDate) {
            return date.getFullYear() === new Date().getFullYear();
          }
          // Otherwise, filter by selected date range
          return (!startDate || date >= startDate) && (!endDate || date <= endDate);
        })
        .map(([, value]) => value),
    },
  ] : [];

  return (
    <div className="budget-analysis p-3">
      {initialLoading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <Icon path={mdiChartLine} size={1.3} />
              </span> Earnings
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
                    Earnings Analysis Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                    A comprehensive financial tracking system that provides detailed insights into your organization's earnings and subscription metrics.
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Key Metrics Overview:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Current Month Total: Track monthly revenue performance</li>
                    <li>Current Year Total: Monitor annual earnings progress</li>
                    <li>All Time Total: View cumulative earnings history</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Interactive Chart Features:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Date Range Selection: Customize analysis period</li>
                    <li>Zoom Controls: Detailed view of specific time periods</li>
                    <li>Export Options: Download data in various formats</li>
                    <li>Dynamic Updates: Real-time data visualization</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Detailed Transaction Table:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Patient Information: Name and contact details</li>
                    <li>Subscription Details: Plan type and pricing</li>
                    <li>Duration Tracking: Start and end dates</li>
                    <li>Renewal Status: Active subscription monitoring</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Analysis Tools:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Percentage Changes: Month-over-month comparisons</li>
                    <li>Trend Analysis: Visual earnings patterns</li>
                    <li>Pagination Controls: Easy data navigation</li>
                    <li>Sorting Options: Customizable data organization</li>
                  </ul>

                  <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon path={mdiAlertCircleOutline} size={0.6} />
                      Note: Data updates automatically based on new transactions and subscription changes
                    </Typography>
                  </Box>
                </Box>
              }
            // ... rest of tooltip props remain the same ...
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
            {/* <Tooltip
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
            </Tooltip> */}
          </div>

          <Container fluid>
            {/* First Row: Cards */}
            <Row className="mb-4">
              {/* Removed adminPortal related cards */}
              <Col md={4} className="mb-3">
                <MetricCard
                  title="Current Month Total"
                  value={metricData?.currentMonthEarnings || 0}
                  icon={mdiCurrencyUsd}
                  gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                  percentage={calculatePercentageIncrease(
                    metricData?.currentMonthEarnings || 0,
                    budgetData?.previousMonthEarnings || 0
                  )}
                />
              </Col>
              <Col md={4} className="mb-3">
                <MetricCard
                  title="Current Year Total"
                  value={metricData?.currentYearEarnings || 0}
                  icon={mdiChartLine}
                  gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                  percentage={calculatePercentageIncrease(
                    metricData?.currentYearEarnings || 0,
                    budgetData?.previousYearTotal || 0
                  )}
                />
              </Col>
              <Col md={4} className="mb-3">
                <MetricCard
                  title="All Time Total"
                  value={metricData?.totalEarnings || 0}
                  icon={mdiCashMultiple}
                  gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                  percentage="Total Earnings"
                />
              </Col>
            </Row>

            {/* Second Row: Stacked Column Chart */}
            <Row className="mb-4">
              <Col>
                <Card className="mb-4">
                  <Card.Header style={cardHeaderStyle} className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <span className='font-weight-bold'>Earning Analysis Overview</span>
                    <div className="d-flex gap-2">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <StyledDatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(newValue) => setStartDate(newValue)}
                          defaultValue={new Date(new Date().getFullYear(), 0, 1)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: {
                                width: '140px',
                                '& .MuiInputLabel-root': {
                                  color: '#fff',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }
                            },
                            inputAdornment: {
                              style: { marginRight: '-8px' }
                            }
                          }}
                        />
                        <StyledDatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          defaultValue={new Date(new Date().getFullYear(), 11, 31)}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: {
                                width: '140px',
                                '& .MuiInputLabel-root': {
                                  color: '#fff',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                }
                              }
                            },
                            inputAdornment: {
                              style: { marginRight: '-8px' }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </Card.Header>
                  <Card.Body style={{ minHeight: '400px' }}>
                    <ReactApexChart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      height={400}
                      width="100%"
                      className="apex-charts"
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Third Row: Table */}
            <Row>
              <Col>
                <StyledTableContainer component={Paper} className="p-0">
                  <TableHeaderBox>
                    <Typography variant="h5" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                      Earning Details
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Icon path={mdiDownload} size={1} />}
                      onClick={() => downloadCSV(subscriptions)}
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
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                        <StyledHeaderCell align="center">Name</StyledHeaderCell>
                        <StyledHeaderCell align="center">Email</StyledHeaderCell>
                        {sessionStorage.getItem('role') !== 'Admin' && (
                          <StyledHeaderCell align="center">Clinician</StyledHeaderCell>
                        )}
                        <StyledHeaderCell align="center">Plan</StyledHeaderCell>
                        <StyledHeaderCell align="center">Price</StyledHeaderCell>
                        <StyledHeaderCell align="center">Start Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">End Date</StyledHeaderCell>
                        <StyledHeaderCell align="center">Renewal</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subscription, index) => (
                        <StyledTableRow key={subscription._id}>
                          <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.patient.userName || '-'}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.patient.email}</StyledTableCell>
                          {sessionStorage.getItem('role') !== 'Admin' && (
                            <StyledTableCell align="center">{subscription.clinisist?.name || 'N/A'}</StyledTableCell>
                          )}
                          <StyledTableCell align="center">{subscription.plan?.name || 'N/A'}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.plan?.price ? `$${subscription.plan.price.toFixed(2)}` : 'N/A'}</StyledTableCell>
                          <StyledTableCell align="center">{new Date(subscription.startDate).toLocaleDateString()}</StyledTableCell>
                          <StyledTableCell align="center">{new Date(subscription.endDate).toLocaleDateString()}</StyledTableCell>
                          <StyledTableCell align="center">{subscription.renewal ? 'Yes' : 'No'}</StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    className="mt-2"
                    component="div"
                    count={subscriptions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  />
                </StyledTableContainer>
              </Col>
            </Row>
          </Container>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BudgetAnalysis;
