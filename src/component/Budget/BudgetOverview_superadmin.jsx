import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Backdrop, CircularProgress, Typography, Box, Button, ToggleButton, ToggleButtonGroup, Chip, Tooltip } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card_circle from '../../assets/circle.png';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiChartLine, mdiCashMultiple, mdiEye, mdiMonitor, mdiDoctor, mdiOfficeBuilding, mdiAlertCircleOutline, mdiMagnify, mdiDownload } from '@mdi/js';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns'; // Add this import at the top of your file
import { styled, alpha, keyframes, ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
// import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import { FaCalendarPlus, FaCalendarMinus, FaMapMarkerAlt, FaUserMd, FaBuilding } from 'react-icons/fa';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BaseUrl from '../../api';


// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
  },
});

// Add these styled components at the top of your file, after the imports
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  borderRadius: '24px',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  border: 'none',
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(1),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '24px 24px 0 0',
  border: 'none',
}));

const cardHeaderStyle = {
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  color: 'white',
  padding: '20px',
  borderRadius: '24px 24px 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  zIndex: 1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
    borderRadius: 'inherit',
    zIndex: -1,
  },
};

const StyledTable = styled(Table)({
  minWidth: 700,
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
  '&:hover': {
    backgroundColor: '#fff',
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  },
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
  position: 'relative',
  '& .MuiInputBase-root': {
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    border: 'none',
    color: theme.palette.common.white,
    padding: '4px 10px',
    transition: 'all 0.3s ease-in-out',
    width: '140px',
    fontSize: '0.7rem',
    fontWeight: '600',
    '&:hover': {
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transform: 'translateY(-1px)',
    },
    '&::before, &::after': {
      display: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 12px 4px',
    width: 'calc(100% - 60px)',
    '&::placeholder': {
      color: 'white',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.65rem',
    fontWeight: 500,
    transform: 'translate(12px, 3px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(12px, 3px) scale(1)',
    },
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

const ModernMetricCard = styled(Card)(({ gradient }) => ({
  background: gradient || 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  padding: '24px',
  minHeight: '160px',
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
    width: '155px',
    height: '200px',
    backgroundImage: `url(${Card_circle})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    opacity: 0.6, // Set opacity for transparency
    zIndex: 0, // Ensure it's behind the text
  },
  zIndex: 1, // Ensure the content stays on top

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
    <Card.Body className="d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <h4 className="font-weight-normal mb-0">{title}</h4>
        {/* <Icon path={icon} size={1.8} color="rgba(255,255,255,0.8)" /> */}
        <Icon path={icon} size={1.8} color="rgba(255,255,255,0.8)" />

      </div>
      <h2 className="mb-0">${value.toFixed(2)}</h2>
      <p className="mb-0">{percentage}</p>
    </Card.Body>
  </Card>
);

const getApiBaseUrl = () => {
  const role = sessionStorage.getItem('role');
  return role === 'assistant' ? 'assistant' : 'admin';
};

// Styled components
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

const UserInfoCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.5rem',
  borderRadius: '15px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(59, 130, 246, 0.1)',
    transform: 'translateX(5px)',
  }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '2px solid #ffffff',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiAvatar-img': {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
}));

const DateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.8rem',
  padding: '0.8rem',
  borderRadius: '12px',
  background: 'rgba(59, 130, 246, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(59, 130, 246, 0.1)',
    transform: 'translateX(5px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
  }
}));

const DateLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '& svg': {
    color: theme.palette.primary.main,
  }
}));

const DateValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  fontWeight: 500,
  paddingLeft: '1.5rem',
}));

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

const TableLoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.8)',
  zIndex: 2,
  backdropFilter: 'blur(4px)',
  borderRadius: '24px',
}));

const DownloadButton = styled(Button)(({ theme }) => ({
  borderRadius: '15px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease'
}));

const BudgetAnalysis = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // January 1st of current year
  const [endDate, setEndDate] = useState(new Date()); // Current date
  const [metricData, setMetricData] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [adminEarningsData, setAdminEarningsData] = useState({});
  const [filter, setFilter] = useState('patient');
  const theme = useTheme(); // Add this hook to access theme
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  useEffect(() => {
    fetchSubscriptions();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (sessionStorage.getItem('adminPortal') === 'true') {
        await Promise.all([fetchAdminEarningsData(), fetchAdminMetrics(), fetchSubscriptions()]);
      } else {
        await Promise.all([fetchMetricData(), fetchBudgetData(), fetchSubscriptions()]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminEarningsData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await axios.get(`${BaseUrl}/api/${baseUrl}/detailed-earnings-month-wise`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      });
      setAdminEarningsData(response.data.data);
    } catch (error) {
      console.error('Error fetching admin earnings data:', error);
      toast.error('Failed to fetch admin earnings data');
    }
  };

  const fetchAdminMetrics = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await axios.get(`${BaseUrl}/api/${baseUrl}/total-earnings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminMetrics(response.data.data);
    } catch (error) {
      console.error('Error fetching admin metric data:', error);
      toast.error('Failed to fetch admin metric data');
    }
  };

  const fetchMetricData = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (adminPortal) {
      try {
        const response = await axios.get(`${BaseUrl}/api/admin/total-earnings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdminMetrics(response.data.data);
      } catch (error) {
        console.error('Error fetching admin metric data:', error);
        toast.error('Failed to fetch admin metric data');
      }
    } else {
      // Existing metric data fetching logic for other roles
      // ...
    }
  };

  const fetchBudgetData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      let url;

      if (role === 'manager') {
        url = `${BaseUrl}/api/manager/earnings?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;
      } else {
        url = `${BaseUrl}/api/organization/earnings?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.body;

      if (role === 'organization') {
        // Calculate current year total
        const currentYear = new Date().getFullYear();
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
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
      const baseUrl = getApiBaseUrl();
      let url;

      if (isAdminPortal) {
        if (filter === 'clinician') {
          url = `${BaseUrl}/api/doctorSub/getAll`;
        } else if (filter === 'organization') {
          url = `${BaseUrl}/api/orgSubscription/getAll`;
        } else {
          url = `${BaseUrl}/api/${baseUrl}/subscriptions`;
        }
      } else {
        // Use existing URLs for non-admin users
        const role = sessionStorage.getItem('role');
        if (role === 'manager') {
          url = `${BaseUrl}/api/manager/subscriptions`;
        } else {
          url = `${BaseUrl}/api/organization/subscriptions`;
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscriptions(filter === 'organization' ? response.data.data : response.data.body);
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

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          // download: true,
          download: `<i class="mdi mdi-download fs-3"></i>`,

        },
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: sessionStorage.getItem('adminPortal') === 'true'
        ? Object.keys(adminEarningsData).map(key => format(new Date(key), 'MMM yyyy'))
        : Object.entries(budgetData?.monthlyEarnings || {})
          .filter(([key]) => {
            const date = new Date(key);
            return date >= startDate && date <= endDate;
          })
          .map(([key]) => format(new Date(key), 'MMM yyyy')),
    },
    yaxis: {
      title: {
        text: 'Earnings ($)',
        style: {
          fontSize: '14px',
          fontWeight: 500,
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 1,
        gradientToColors: ['#36A2EB', '#FF6384', '#FEEA56'],
        opacityFrom: 0.7,
        opacityTo: 0.9,
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        radius: 12,
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetY: 0,
        }
      }
    }]
  };

  const chartSeries = sessionStorage.getItem('adminPortal') === 'true'
    ? [
      {
        name: 'Patient Earnings',
        data: Object.entries(adminEarningsData)
          .filter(([key]) => {
            const date = new Date(key);
            return date >= startDate && date <= endDate;
          })
          .map(([, month]) => month.patientEarnings),
      },
      {
        name: 'Clinician Earnings',
        data: Object.entries(adminEarningsData)
          .filter(([key]) => {
            const date = new Date(key);
            return date >= startDate && date <= endDate;
          })
          .map(([, month]) => month.clinicianEarnings),
      },
      {
        name: 'Organization Earnings',
        data: Object.entries(adminEarningsData)
          .filter(([key]) => {
            const date = new Date(key);
            return date >= startDate && date <= endDate;
          })
          .map(([, month]) => month.organizationEarnings),
      },
    ]
    : budgetData
      ? [
        {
          name: 'Monthly Earnings',
          data: Object.entries(budgetData.monthlyEarnings)
            .filter(([key]) => {
              const date = new Date(key);
              return date >= startDate && date <= endDate;
            })
            .map(([, value]) => value),
        },
      ]
      : [];

  const calculatePercentageIncrease = (current, previous) => {
    if (previous === 0) return '100% increase';
    const increase = ((current - previous) / previous) * 100;
    return increase > 0 ? `${increase.toFixed(1)}% increase` : `${Math.abs(increase).toFixed(1)}% decrease`;
  };

  const renderTableHeaders = () => {
    if (filter === 'clinician') {
      return [
        { id: 'sno', label: 'S.No', align: 'center' },
        { id: 'name', label: 'Clinician', align: 'left' },
        { id: 'email', label: 'Email', align: 'center' },
        { id: 'price', label: 'Price', align: 'center' },
        { id: 'subscription_period', label: 'Subscription Period', align: 'center' },
        { id: 'specialization', label: 'Specialization', align: 'center' },
        { id: 'experience', label: 'Experience', align: 'center' },
        { id: 'renewal', label: 'Status', align: 'center' },
      ];
    }
    if (filter === 'organization') {
      return [
        { id: 'sno', label: 'S.No', align: 'center' },
        { id: 'name', label: 'Organization', align: 'left' },
        { id: 'email', label: 'Email', align: 'center' },
        { id: 'price', label: 'Price', align: 'center' },
        { id: 'subscription_period', label: 'Subscription Period', align: 'center' },
        { id: 'founder', label: 'founder', align: 'center' },
        { id: 'clinicians', label: 'Clinicians', align: 'center' },
        { id: 'renewal', label: 'Status', align: 'center' },
      ];
    }
    const commonHeaders = [
      { id: 'sno', label: 'S.No', align: 'center' },
      { id: 'name', label: 'Name', align: 'center' },
      { id: 'email', label: 'Email', align: 'center' },
      { id: 'price', label: 'Price', align: 'center' },
      { id: 'startDate', label: 'Start Date', align: 'center' },
      { id: 'endDate', label: 'End Date', align: 'center' },
      { id: 'renewal', label: 'Renewal', align: 'center' },
    ];

    const specificHeaders = {
      patient: [
        { id: 'guardian', label: 'Guardian', align: 'center' },
        { id: 'location', label: 'Location', align: 'center' },
      ],
      clinician: [
        { id: 'specialization', label: 'Specialization', align: 'center' },
        { id: 'patients', label: 'Patients', align: 'center' },
        { id: 'experience', label: 'Experience', align: 'center' },
      ],
      organization: [
        { id: 'companyName', label: 'Company Name', align: 'center' },
        { id: 'clinicians', label: 'Clinicians', align: 'center' },
        { id: 'established', label: 'Established', align: 'center' },
      ],
    };

    return [...commonHeaders, ...(specificHeaders[filter] || [])];
  };

  const renderTableCell = (subscription, header) => {
    if (filter === 'clinician') {
      switch (header.id) {
        case 'sno':
          return page * rowsPerPage + subscriptions.indexOf(subscription) + 1;
        case 'name':
          return {
            name: subscription.clinician?.name || '-',
            image: subscription.clinician?.image || '',
            title: subscription.clinician?.title || 'Dr.'
          };
        case 'email':
          return subscription.clinician?.email || '-';
        case 'price':
          return `$${subscription.price?.toFixed(2) || 'N/A'}`;
        case 'subscription_period':
          return {
            startDate: subscription.startDate,
            endDate: subscription.endDate
          };
        case 'specialization':
          return subscription.clinician?.specializedIn || '-';
        case 'experience':
          return subscription.clinician?.experience || '-';
        case 'renewal':
          return subscription.renewal;
        default:
          return '-';
      }
    }
    if (filter === 'organization') {
      switch (header.id) {
        case 'sno':
          return page * rowsPerPage + subscriptions.indexOf(subscription) + 1;
        case 'name':
          return {
            name: subscription.organization?.name || '-',
            image: subscription.organization?.image || '',
            companyName: subscription.organization?.companyName || 'Not Specified',
            founder: subscription.organization?.founder || 'Not Specified'
          };
        case 'email':
          return subscription.organization?.email || '-';
        case 'price':
          return `$${subscription.price?.toFixed(2) || 'N/A'}`;
        case 'subscription_period':
          return {
            startDate: subscription.startDate,
            endDate: subscription.endDate
          };
        case 'clinicians':
          return subscription.clinicians || 0;
        case 'founder':
          return subscription.organization?.founder || '-';
        case 'renewal':
          return subscription.renewal;
        default:
          return '-';
      }
    }
    switch (header.id) {
      case 'sno':
        return page * rowsPerPage + subscriptions.indexOf(subscription) + 1;
      case 'name':
        return filter === 'clinician' ? subscription.clinician?.name :
          filter === 'patient' ? subscription.patient?.userName :
            subscription.organization?.name || '-';
      case 'email':
        return filter === 'clinician' ? subscription.clinician?.email :
          filter === 'patient' ? subscription.patient?.email :
            subscription.organization?.email || '-';
      case 'price':
        if (filter === 'patient') {
          return `$${subscription.plan?.price?.toFixed(2) || 'N/A'}`;
        } else {
          return `$${subscription.price?.toFixed(2) || 'N/A'}`;
        }
      case 'startDate':
        return new Date(subscription.startDate).toLocaleDateString();
      case 'endDate':
        return new Date(subscription.endDate).toLocaleDateString();
      case 'renewal':
        return subscription.renewal ? 'Yes' : 'No';
      case 'guardian':
        return subscription.patient?.guardian || '-';
      case 'location':
        return subscription.patient?.location || '-';
      case 'specialization':
        return subscription.clinician?.specializedIn || '-';
      case 'patients':
        return subscription.patients || '-';
      case 'experience':
        return subscription.clinician?.experince || '-';
      case 'companyName':
        return subscription.organization?.companyName || '-';
      case 'clinicians':
        return subscription.clinicians || '-';
      case 'established':
        return subscription.organization?.established ? new Date(subscription.organization.established).getFullYear() : '-';
      default:
        return '-';
    }
  };

  const getFilteredSubscriptions = () => {
    if (!searchQuery) return subscriptions;

    return subscriptions.filter(subscription => {
      const searchString = searchQuery.toLowerCase();

      // Adjust these fields based on your subscription data structure
      const hasMatchingName = filter === 'clinician'
        ? subscription.clinician?.name?.toLowerCase().includes(searchString)
        : filter === 'organization'
          ? subscription.organization?.name?.toLowerCase().includes(searchString)
          : subscription.patient?.userName?.toLowerCase().includes(searchString);

      const hasMatchingEmail = filter === 'clinician'
        ? subscription.clinician?.email?.toLowerCase().includes(searchString)
        : filter === 'organization'
          ? subscription.organization?.email?.toLowerCase().includes(searchString)
          : subscription.patient?.email?.toLowerCase().includes(searchString);

      return hasMatchingName || hasMatchingEmail;
    });
  };

  const convertToCSV = (data, headers) => {
    const headerRow = headers.map(header => header.label).join(',');
    const rows = data.map(subscription =>
      headers.map(header => {
        let value = '';

        // Handle special cases
        if (header.id === 'name') {
          if (filter === 'clinician' || filter === 'organization') {
            const cellValue = renderTableCell(subscription, header);
            value = cellValue.name;
          } else {
            value = renderTableCell(subscription, header);
          }
        } else if (header.id === 'subscription_period') {
          const dates = renderTableCell(subscription, header);
          value = `${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.endDate).toLocaleDateString()}`;
        } else {
          value = renderTableCell(subscription, header);
        }

        // Clean and format the value
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ).join('\n');

    return `${headerRow}\n${rows}`;
  };

  const downloadCSV = (data, headers) => {
    const csv = convertToCSV(data, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, 'subscriptions.csv');
    } else {
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'subscriptions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledDashboard>
        {loading && !subscriptions.length ? (
          <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <StyledPageHeader>

              <div className="page-title">
                <div className="page-title-icon">
                  <Icon
                    path={mdiChartLine}
                    size={1.5}
                    color="#ffffff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                </div>
                <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  Earnings
                </span>
              </div>
              <Tooltip
                title={
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Earnings Dashboard Overview
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      A comprehensive financial analytics dashboard that provides:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      <li>Real-time earnings metrics for patients, clinicians, and organizations</li>
                      <li>Interactive charts showing earnings trends over customizable date ranges</li>
                      <li>Detailed subscription management with filtering and search capabilities</li>
                      <li>Status tracking for active and inactive subscriptions</li>
                      <li>Performance comparisons with previous periods</li>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'primary.light' }}>
                      Use the date filters and toggle buttons to analyze specific data segments
                    </Typography>
                  </Box>
                }
                arrow
                placement="bottom-end"
                sx={{
                  '& .MuiTooltip-tooltip': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    color: '#1e293b',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    maxWidth: 400
                  },
                  '& .MuiTooltip-arrow': {
                    color: 'rgba(255, 255, 255, 0.95)',
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
                  // background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  // '&:hover': {
                  //     background: 'rgba(255, 255, 255, 0.2)',
                  //     transform: 'translateY(-2px)'
                  // }
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
              {/* First Row: Cards */}
              <Row className="mb-4">
                <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3}>
                  {sessionStorage.getItem('adminPortal') === 'true' ? (
                    <>
                      <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                        <Box>
                          <Typography variant="h6" sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            Portal Earnings
                          </Typography>
                          <Typography variant="h3" sx={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            ${adminMetrics?.patientEarnings?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 1
                        }}>
                          <Typography variant="body2" sx={{
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}>
                            Total Patient Earnings
                          </Typography>
                          <Icon path={mdiMonitor} size={1.5} color="#fff" style={{ opacity: 0.6 }} />
                        </Box>
                      </ModernMetricCard>

                      <ModernMetricCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                        <Box>
                          <Typography variant="h6" sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            Clinician Earnings
                          </Typography>
                          <Typography variant="h3" sx={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            ${adminMetrics?.clinicianEarnings?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 1
                        }}>
                          <Typography variant="body2" sx={{
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}>
                            Total Clinician Earnings
                          </Typography>
                          <Icon path={mdiDoctor} size={1.5} color="#fff" style={{ opacity: 0.6 }} />
                        </Box>
                      </ModernMetricCard>

                      <ModernMetricCard gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                        <Box>
                          <Typography variant="h6" sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            Organization Earnings
                          </Typography>
                          <Typography variant="h3" sx={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            ${adminMetrics?.organizationEarnings?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 1
                        }}>
                          <Typography variant="body2" sx={{
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}>
                            Total Organization Earnings
                          </Typography>
                          <Icon path={mdiOfficeBuilding} size={1.5} color="#fff" style={{ opacity: 0.6 }} />
                        </Box>
                      </ModernMetricCard>

                      <ModernMetricCard gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)">
                        <Box>
                          <Typography variant="h6" sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            Total Earnings
                          </Typography>
                          <Typography variant="h3" sx={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            ${(adminMetrics?.patientEarnings + adminMetrics?.clinicianEarnings + adminMetrics?.organizationEarnings)?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 1
                        }}>
                          <Typography variant="body2" sx={{
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}>
                            Overall Portal Earnings
                          </Typography>
                          <Icon path={mdiCurrencyUsd} size={1.5} color="#fff" style={{ opacity: 0.6 }} />
                        </Box>
                      </ModernMetricCard>
                    </>
                  ) : (
                    <>
                      <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                        <Box>
                          <Typography variant="h6" sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            Current Year Earnings
                          </Typography>
                          <Typography variant="h3" sx={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#fff',
                            mb: 0.5
                          }}>
                            ${budgetData?.currentYearTotal?.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 1
                        }}>
                          <Typography variant="body2" sx={{
                            color: '#fff',
                            fontSize: '0.7rem'
                          }}>
                            {calculatePercentageIncrease(budgetData?.currentYearTotal || 0, budgetData?.previousYearTotal || 0)}
                          </Typography>
                          <Icon path={mdiCurrencyUsd} size={1.5} color="#fff" style={{ opacity: 0.6 }} />
                        </Box>
                      </ModernMetricCard>
                    </>
                  )}
                </Box>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Card className="mb-4" sx={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    background: 'white',
                    border: 'none',
                  }}>
                    <Box sx={{
                      borderRadius: '24px',
                      overflow: 'hidden',
                      background: 'white',
                    }}>
                      <Card.Header style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                        color: 'white',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        zIndex: 1,
                        border: 'none',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}>
                          <Icon
                            path={mdiChartLine}
                            size={1.5}
                            color="white"
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '8px',
                              borderRadius: '12px',
                            }}
                          />
                          <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                          }}>
                            Earning Analysis Overview
                          </span>
                        </div>
                        <div className="d-flex gap-3">
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <StyledDatePicker
                              label="Start Date"
                              value={startDate}
                              onChange={(newValue) => setStartDate(newValue)}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  variant: 'outlined',
                                  InputLabelProps: {
                                    shrink: true,
                                  },
                                  sx: {
                                    width: '140px',
                                    '& .MuiInputLabel-root': {
                                      color: 'rgba(255, 255, 255, 0.7)',
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
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  variant: 'outlined',
                                  InputLabelProps: {
                                    shrink: true,
                                  },
                                  sx: {
                                    width: '140px',
                                    '& .MuiInputLabel-root': {
                                      color: 'rgba(255, 255, 255, 0.7)',
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
                      <Card.Body style={{
                        background: 'white',
                        padding: '24px',
                      }}>
                        <ReactApexChart
                          options={chartOptions}
                          series={chartSeries}
                          type="bar"
                          height={350}
                        />
                      </Card.Body>
                    </Box>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <StyledTableContainer component={Paper} className="p-0" sx={{ position: 'relative' }}>
                    <TableHeaderBox>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        position: 'relative',
                        zIndex: 1
                      }}>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                          Earning Details
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
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                          {`Found ${getFilteredSubscriptions().length} results`}
                        </Box>

                      </Box>
                      <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '43%',
                      }}>
                        <DownloadButton
                          onClick={() => downloadCSV(getFilteredSubscriptions(), renderTableHeaders())}
                          startIcon={<Icon path={mdiDownload} size={0.9} />}
                        >
                          Download CSV
                        </DownloadButton>
                        <ToggleButtonGroup
                          value={filter}
                          exclusive
                          onChange={handleFilterChange}
                          aria-label="subscription filter"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '4px',
                            '& .MuiToggleButton-root': {
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              mx: 0.5,
                              '&.Mui-selected': {
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                                },
                              },
                            },
                          }}
                        >
                          <ToggleButton value="patient" aria-label="patient">
                            Patient
                          </ToggleButton>
                          <ToggleButton value="clinician" aria-label="clinician">
                            Clinician
                          </ToggleButton>
                          <ToggleButton value="organization" aria-label="organization">
                            Organization
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    </TableHeaderBox>
                    <StyledTable>
                      <StyledTableHead>
                        <TableRow>
                          {renderTableHeaders().map((header) => (
                            <StyledHeaderCell key={header.id} align={header.align}>
                              {header.label}
                            </StyledHeaderCell>
                          ))}
                        </TableRow>
                      </StyledTableHead>
                      <TableBody>
                        {getFilteredSubscriptions()
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((subscription, index) => (
                            <StyledTableRow key={subscription._id}>
                              {renderTableHeaders().map((header) => (
                                <StyledTableCell key={header.id} align={header.align}>
                                  {header.id === 'name' && filter === 'clinician' ? (
                                    <UserInfoCell>
                                      {renderTableCell(subscription, header).image ? (
                                        <StyledAvatar
                                          src={renderTableCell(subscription, header).image}
                                          alt={renderTableCell(subscription, header).name}
                                          variant="rounded"
                                        />
                                      ) : (
                                        <StyledAvatar variant="rounded">
                                          {renderTableCell(subscription, header).name.charAt(0)}
                                        </StyledAvatar>
                                      )}
                                      <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                          {renderTableCell(subscription, header).title} {renderTableCell(subscription, header).name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                          {subscription.clinician?.qualification || 'Medical Professional'}
                                        </Typography>
                                      </Box>
                                    </UserInfoCell>
                                  ) : header.id === 'name' && filter === 'organization' ? (
                                    <UserInfoCell>
                                      {renderTableCell(subscription, header).image ? (
                                        <StyledAvatar
                                          src={renderTableCell(subscription, header).image}
                                          alt={renderTableCell(subscription, header).name}
                                          variant="rounded"
                                          sx={{ width: 50, height: 50 }}
                                        />
                                      ) : (
                                        <StyledAvatar
                                          variant="rounded"
                                          sx={{
                                            width: 50,
                                            height: 50,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                                          }}
                                        >
                                          {renderTableCell(subscription, header).name.charAt(0)}
                                        </StyledAvatar>
                                      )}
                                      <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                          {renderTableCell(subscription, header).name}
                                        </Typography>
                                        <Typography variant="caption" sx={{
                                          color: 'text.secondary',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}>
                                          <FaBuilding size={10} />
                                          {renderTableCell(subscription, header).companyName}
                                        </Typography>
                                      </Box>
                                    </UserInfoCell>
                                  ) : header.id === 'subscription_period' ? (
                                    <DateContainer>
                                      <Box>
                                        <DateLabel>
                                          <FaCalendarPlus size={12} />
                                          Start Date
                                        </DateLabel>
                                        <DateValue>
                                          {new Date(renderTableCell(subscription, header).startDate).toLocaleDateString()}
                                        </DateValue>
                                      </Box>
                                      <Box>
                                        <DateLabel>
                                          <FaCalendarMinus size={12} />
                                          End Date
                                        </DateLabel>
                                        <DateValue>
                                          {new Date(renderTableCell(subscription, header).endDate).toLocaleDateString()}
                                        </DateValue>
                                      </Box>
                                    </DateContainer>
                                  ) : header.id === 'clinicians' ? (
                                    <Box sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      justifyContent: 'center'
                                    }}>
                                      <FaUserMd size={16} color={theme.palette.primary.main} />
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 600,
                                          background: alpha(theme.palette.primary.main, 0.1),
                                          padding: '0.4rem 0.8rem',
                                          borderRadius: '20px',
                                          minWidth: '60px',
                                          textAlign: 'center'
                                        }}
                                      >
                                        {renderTableCell(subscription, header)}
                                      </Typography>
                                    </Box>
                                  ) : header.id === 'founder' ? (
                                    <Chip
                                      label={renderTableCell(subscription, header)}
                                      size="small"
                                      sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                                        color: 'white',
                                        fontWeight: 500,
                                        padding: '10px 5px',
                                      }}
                                    />
                                  ) : header.id === 'renewal' ? (
                                    <StatusChip
                                      label={renderTableCell(subscription, header) ? 'Active' : 'Inactive'}
                                      status={renderTableCell(subscription, header) ? 'Active' : 'Inactive'}
                                    />
                                  ) : header.id === 'price' ? (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: theme.palette.success.main,
                                        background: alpha(theme.palette.success.main, 0.1),
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        display: 'inline-block'
                                      }}
                                    >
                                      {renderTableCell(subscription, header)}
                                    </Typography>
                                  ) : (
                                    <Typography variant="body2">
                                      {renderTableCell(subscription, header)}
                                    </Typography>
                                  )}
                                </StyledTableCell>
                              ))}
                            </StyledTableRow>
                          ))}
                      </TableBody>
                    </StyledTable>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={getFilteredSubscriptions().length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </StyledTableContainer>
                </Col>
              </Row>

              {/* Update the chart and table containers with similar modern styling */}
              <Row className="mb-4">
                <Col>
                  <Card sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden'
                  }}>
                    {/* ... existing chart content ... */}
                  </Card>
                </Col>
              </Row>

              {/* Update table styling similarly */}
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
                    {/* ... existing table content ... */}
                  </StyledTableContainer>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </StyledDashboard>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
};

export default BudgetAnalysis;
