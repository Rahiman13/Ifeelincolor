import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Backdrop,
  LinearProgress,
  linearProgressClasses,
  Tooltip,
  Container,
  Fade,
} from '@mui/material';
import Icon from '@mdi/react';
import { mdiPlus, mdiAccount, mdiAccountTie, mdiAccountMultiple, mdiChartLine, mdiStethoscope, mdiSleep, mdiAccountCancel, mdiPencil, mdiMagnify, mdiAccountGroup } from '@mdi/js';
import { Menu as MenuIcon } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled, alpha } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Card_circle from '../../assets/circle.png';
import Swal from 'sweetalert2';
import EmailIcon from '@mui/icons-material/Email';
import { mdiAlertCircleOutline } from '@mdi/js';
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Close as CloseIcon } from '@mui/icons-material';
import BaseUrl from '../../api';


// MetricCard component
const MetricCard = ({ title, value, icon, gradient, percentage }) => (
  <Card sx={{
    background: gradient,
    color: 'white',
    padding: 4,
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '195px',
      height: '240px',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      opacity: 0.6,
      zIndex: 0,
    },
    zIndex: 1,
  }}>
    {/* <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative', zIndex: 2 }}> */}
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }} className='d-flex align-items-center gap-2'>

      <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
      <Typography variant="h6" fontWeight="normal">
        {title}
      </Typography>
      <Icon path={icon} size={1.2} color="rgba(255,255,255,0.8)" />
    </Box>
    <Typography variant="h4" fontWeight="bold" my={2} sx={{ position: 'relative', zIndex: 2 }}>
      {value}
    </Typography>
    <Typography variant="body2" sx={{ position: 'relative', zIndex: 2 }}>
      {percentage}
    </Typography>
  </Card>
);

// Styled components
const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  // background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
  minWidth: 700,
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.grey[200],
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.common.black,
  fontWeight: '500',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  lineHeight: '1.5rem',
  letterSpacing: '0.05em',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: '#F5F5F5',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const StyledTableCell = styled(TableCell)({
  fontSize: '0.875rem',
  lineHeight: '1.43',
  padding: '16px',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
  border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  borderRadius: '20px',
  backgroundColor: '#7a990a',
  padding: '0 10px',
  height: 28,
  fontSize: '0.75rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: '4px 10px 3px',
  margin: '3px',
  display: 'flex-column',
  gap: '10px',
  transition: 'all 0.2s',
  backgroundColor: "#F5F5FF5",
  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  borderRadius: '20px',
  '&:hover': {
    transform: 'scale(1.15)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '130px',
  '& .MuiInputBase-root': {
    borderRadius: '20px',
    backgroundColor: 'white',
    fontSize: '0.75rem',
    height: '40px',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 14px',
    fontSize: '0.75rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[300],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

// Add these styled components
const InfoIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
}));

const StatusChip = styled(Chip)(({ status }) => {
  let color = '#4caf50';
  let bgColor = alpha('#4caf50', 0.1);

  if (status === 'inactive') {
    color = '#f44336';
    bgColor = alpha('#f44336', 0.1);
  }

  return {
    borderRadius: 20,
    backgroundColor: bgColor,
    color: color,
    fontWeight: 600,
    fontSize: '0.75rem',
  };
});

const TrendyTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  '&:hover': {
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
    transform: 'translateY(-5px)',
    transition: 'all 0.3s ease',
  },
}));

const GradientTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
  '& th': {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    padding: theme.spacing(2),
    borderBottom: 'none',
  },
}));

const FancyTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.05),
    // transform: 'scale(1.01)',
    // boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
}));

const DataCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '0.875rem',
  '&:hover': {
    // backgroundColor: alpha(theme.palette.primary.light, 0.05),
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme, value }) => ({
  height: 6,
  borderRadius: 3,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
    background: value > 75
      ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
      : value > 50
        ? 'linear-gradient(45deg, #f1c40f, #f39c12)'
        : 'linear-gradient(45deg, #e74c3c, #c0392b)',
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

const ModernMetricCard = ({ title, value, icon, gradient, percentage }) => (
  <Card sx={{
    background: gradient || 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: 3,
    height: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    color: gradient ? '#fff' : 'inherit',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '130px',
      height: '160px',
      backgroundImage: `url(${Card_circle})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      opacity: 0.6,
      zIndex: 0,
    },
    zIndex: 1,
  }}>
    <Box sx={{ position: 'relative', zIndex: 2 }}>
      <Typography variant="h6" sx={{
        fontSize: '1.1rem',
        fontWeight: 600,
        color: gradient ? '#fff' : '#64748b',
        mb: 2
      }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{
        fontSize: '1.8rem',
        fontWeight: 800,
        mb: 1,
        color: gradient ? '#fff' : 'inherit'
      }}>
        {value}
      </Typography>
    </Box>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 2
    }}>
      <Typography variant="body2" sx={{
        fontSize: '0.8rem',
        color: gradient ? '#fff' : '#64748b'
      }}>
        {percentage}
      </Typography>
      <Icon
        path={icon}
        size={1.5}
        style={{
          opacity: 0.6,
          color: gradient ? '#fff' : '#3b82f6'
        }}
      />
    </Box>
  </Card>
);

const StyledButton = styled(Button)({
  borderRadius: '12px',
  textTransform: 'none',
  padding: '10px 24px',
  fontWeight: 600,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  }
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(8px)',
  },
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    // background: '#ffffff',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',

    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '600px',
    width: '100%',
    margin: '16px',
    fontFamily: "'Poppins', sans-serif",
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '200px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      zIndex: 0,
    }
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  color: '#ffffff',
  padding: '32px',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  '& .icon-wrapper': {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  '& .title-text': {
    fontSize: '1.75rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Poppins', sans-serif",
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: '32px',
  background: '#ffffff',
  borderRadius: '24px 24px 0 0',
  // marginTop: '-24px',
  '& .form-section': {
    // marginBottom: '24px',
    '& .section-title': {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1e293b',
      // marginBottom: '12px',
      fontFamily: "'Poppins', sans-serif",
    }
  },
  '& .MuiTextField-root': {
    marginBottom: '24px',
    '& .MuiInputLabel-root': {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      '&.Mui-focused': {
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
      }
    }
  },
  '& .color-picker-section': {
    marginTop: '12px',
    // padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
  }
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '24px 32px',
  background: '#ffffff',
  borderTop: '1px solid rgba(0, 0, 0, 0.05)',
  gap: '12px',
  '& .MuiButton-root': {
    borderRadius: '12px',
    padding: '10px 24px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    fontFamily: "'Poppins', sans-serif",
    minWidth: '120px',
    boxShadow: 'none',
    '&.MuiButton-contained': {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#ffffff',
      '&:hover': {
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
      }
    },
    '&.MuiButton-outlined': {
      borderColor: '#e5e7eb',
      color: '#6b7280',
      '&:hover': {
        background: '#f9fafb',
        borderColor: '#d1d5db',
      }
    }
  }
}));

// Add this styled component (replace the existing SearchTextField)
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

const AssistantPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [assistants, setAssistants] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState("total");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [assistantCounts, setAssistantCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [selectedAssistant, setSelectedAssistant] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAssistants();
  }, [activeTab]);

  const fetchAssistants = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${BaseUrl}/api/admin/assistants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.body) {
        const allAssistants = response.data.body;
        setAssistants(allAssistants);

        // Calculate counts
        setAssistantCounts({
          total: allAssistants.length,
          active: allAssistants.filter(a => a.isActive).length,
          inactive: allAssistants.filter(a => !a.isActive).length,
        });
      }
    } catch (error) {
      console.error('Error fetching assistants:', error);
      toast.error('Failed to fetch assistants');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setActiveTab(filter);
    setPage(0);
    handleClose();
  };

  const handleDateChange = (type) => (date) => {
    setDateRange(prev => {
      const newRange = { ...prev, [type]: date };

      // Validate date range
      if (type === 'from' && newRange.to && date > newRange.to) {
        toast.warning('Start date cannot be after end date');
        return prev;
      }
      if (type === 'to' && newRange.from && date < newRange.from) {
        toast.warning('End date cannot be before start date');
        return prev;
      }

      return newRange;
    });
  };

  const filterAssistantsByDateRange = (assistants) => {
    if (!dateRange.from && !dateRange.to) return assistants;

    return assistants.filter(assistant => {
      const createdDate = new Date(assistant.createdAt);
      // Set time to midnight for accurate date comparison
      createdDate.setHours(0, 0, 0, 0);

      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        return createdDate >= fromDate && createdDate <= toDate;
      } else if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        return createdDate >= fromDate;
      } else if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        return createdDate <= toDate;
      }
      return true;
    });
  };

  const getFilteredAssistants = () => {
    let filtered = [...assistants];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(assistant =>
        assistant.name.toLowerCase().includes(query) ||
        assistant.email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (activeTab === 'active') {
      filtered = filtered.filter(a => a.isActive);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter(a => !a.isActive);
    }

    // Filter by date range
    filtered = filterAssistantsByDateRange(filtered);

    return filtered;
  };

  const isAdmin = sessionStorage.getItem('role') === 'Admin' &&
    sessionStorage.getItem('adminPortal') === 'true';

  const handleCreateAssistant = async () => {
    // First check if user is admin and has permission
    const isAdmin = sessionStorage.getItem('role') === 'Admin' &&
      sessionStorage.getItem('adminPortal') === 'true';

    if (!isAdmin) {
      toast.error('You do not have permission to perform this action');
      return;
    }

    try {
      setLoading(true);

      // Validate input
      if (!selectedAssistant.name || !selectedAssistant.email || !selectedAssistant.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${BaseUrl}/api/assistant/register`,
        {
          name: selectedAssistant.name,
          email: selectedAssistant.email,
          password: selectedAssistant.password
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Assistant registered successfully');
        setOpenDialog(false);
        // Reset the form
        setSelectedAssistant({
          name: '',
          email: '',
          password: ''
        });
        // Refresh the assistants list
        fetchAssistants();
      }
    } catch (error) {
      console.error('Error registering assistant:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register assistant';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (assistant) => {
    try {
      setSelectedAssistant({
        _id: assistant._id,
        name: assistant.name || '',
        email: assistant.email || '',
        password: ''
      });
      setOpenDialog(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      toast.error('Error preparing assistant data for edit');
    }
  };

  const handleDelete = async (assistantId) => {
    // First check if user is admin and has permission
    const isAdmin = sessionStorage.getItem('role') === 'Admin' &&
      sessionStorage.getItem('adminPortal') === 'true';

    if (!isAdmin) {
      toast.error('You do not have permission to perform this action');
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        setLoading(true);
        const token = sessionStorage.getItem('token');
        const response = await axios.delete(
          `${BaseUrl}/api/admin/assistants/${assistantId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === 'success') {
          toast.success('Assistant deleted successfully');
          fetchAssistants();
        }
      }
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast.error(error.response?.data?.message || 'Failed to delete assistant');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setFormSubmitted(true);

    // Validate required fields
    if (!selectedAssistant.name || !selectedAssistant.email ||
      (!selectedAssistant._id && !selectedAssistant.password)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');

      if (selectedAssistant._id) {
        // Update existing assistant
        const response = await axios.put(
          `${BaseUrl}/api/admin/assistants/${selectedAssistant._id}`,
          {
            name: selectedAssistant.name,
            email: selectedAssistant.email
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === 'success') {
          toast.success('Assistant updated successfully');
          fetchAssistants(); // Refresh the list
        }
      } else {
        // Create new assistant
        const response = await axios.post(
          `${BaseUrl}/api/assistant/register`,
          {
            name: selectedAssistant.name,
            email: selectedAssistant.email,
            password: selectedAssistant.password
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === 'success') {
          toast.success('Assistant created successfully');
          fetchAssistants(); // Refresh the list
        }
      }

      // Reset form and close dialog
      setOpenDialog(false);
      setSelectedAssistant({ name: '', email: '', password: '' });
      setFormSubmitted(false);
    } catch (error) {
      console.error('Error saving assistant:', error);
      toast.error(error.response?.data?.message || 'Error saving assistant');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSelectedAssistant(prev => ({
      ...prev,
      [name]: value
    }));
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
                <Icon
                  path={mdiAccountTie}
                  size={1.5}
                  color="#ffffff"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
              <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                Assistant Management
              </span>
            </div>
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Assistant Management Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    A comprehensive platform for managing healthcare assistants and support staff:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    <li>View and manage all healthcare assistants in your organization</li>
                    <li>Track active and inactive status of assistants in real-time</li>
                    <li>Monitor assistant profiles and contact information</li>
                    <li>Manage assistant accounts and access permissions</li>
                    <li>View activity timelines and engagement metrics</li>
                    <li>Add new assistants and update existing profiles</li>
                    <li>Filter and search assistants based on various criteria</li>
                    <li>Generate insights on assistant distribution and activity</li>
                  </ul>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Key Features:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      <li>Real-time status monitoring</li>
                      <li>Advanced search and filtering capabilities</li>
                      <li>Secure account management</li>
                      <li>Activity tracking and metrics</li>
                      <li>Bulk actions and management tools</li>
                    </ul>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                    Use the search and filter options to efficiently manage your assistant workforce.
                  </Typography>
                </Box>
              }
              arrow
              placement="bottom-end"
              sx={{
                '& .MuiTooltip-tooltip': {
                  bgcolor: 'rgba(30, 41, 59, 0.95)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxWidth: 400,
                  fontSize: '0.875rem'
                },
                '& .MuiTooltip-arrow': {
                  color: 'rgba(30, 41, 59, 0.95)',
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
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} mb={4}>
              {/* <ModernMetricCard gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)">
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                    All Assistants
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                    {assistantCounts.total}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <Typography variant="body2">100.0% Total</Typography>
                  <Icon path={mdiChartLine} size={2} color="#fff" style={{ opacity: 0.2 }} />
                </Box>
              </ModernMetricCard> */}
              <ModernMetricCard
                title="All Assistants"
                value={assistantCounts.total || 0}
                icon={mdiAccountGroup}
                gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                percentage="100% of Total"
              />

              {/* <ModernMetricCard gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)">
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                    Active Assistants
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                    {assistantCounts.active}
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
                    {((assistantCounts.active / assistantCounts.total) * 100).toFixed(1)}% of total
                  </Typography>
                  <Icon path={mdiAccountTie} size={2} color="#fff" style={{ opacity: 0.2 }} />
                </Box>
              </ModernMetricCard> */}
              <ModernMetricCard
                title="Active Assistants"
                value={assistantCounts.active || 0}
                icon={mdiAccountTie}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                percentage={`${((assistantCounts.active / assistantCounts.total) * 100).toFixed(1)}% of total`}
              />

              {/* <ModernMetricCard gradient="linear-gradient(135deg, #02aab0 0%, #00cdac 100%)">
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 2 }}>
                    Inactive Assistants
                  </Typography>
                  <Typography variant="h3" sx={{ fontSize: '2.5rem', fontWeight: 800, mb: 1 }}>
                    {assistantCounts.inactive}
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
                    {((assistantCounts.inactive / assistantCounts.total) * 100).toFixed(1)}% of total
                  </Typography>
                  <Icon path={mdiStethoscope} size={2} color="#fff" style={{ opacity: 0.2 }} />
                </Box>
              </ModernMetricCard> */}
              <ModernMetricCard
                title="Inactive Assistants"
                value={assistantCounts.inactive || 0}
                icon={mdiAccountCancel}
                gradient="linear-gradient(135deg, #02aab0 0%, #00cdac 100%)"
                percentage={`${((assistantCounts.inactive / assistantCounts.total) * 100).toFixed(1)}% of total`}
              />
            </Box>

            {/* Update the table container styling */}
            <StyledTableContainer sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden'
            }}>
              <TableHeaderBox>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Assistant Details
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
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
                      placeholder="Search assistants..."
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
                    {`Found ${getFilteredAssistants().length} results`}
                  </Box>
                  {isAdmin && (
                    <Button
                      variant="contained"
                      startIcon={<Icon path={mdiPlus} size={1} />}
                      onClick={() => setOpenDialog(true)}
                      sx={{
                        borderRadius: '15px',
                        background: 'linear-gradient(45deg, #7a990a, #9cb50f)',
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #9cb50f, #7a990a)',
                        }
                      }}
                    >
                      Add Assistant
                    </Button>
                  )}
                </Box>
              </TableHeaderBox>

              <StyledTable>
                <GradientTableHead>
                  <TableRow>
                    <StyledHeaderCell>Assistant Profile</StyledHeaderCell>
                    <StyledHeaderCell>Contact Details</StyledHeaderCell>
                    {/* <StyledHeaderCell>Status</StyledHeaderCell> */}
                    <StyledHeaderCell>Status & Timeline</StyledHeaderCell>
                    <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                  </TableRow>
                </GradientTableHead>
                <TableBody>
                  {getFilteredAssistants()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((assistant, index) => {
                      const joinedDate = new Date(assistant.createdAt);
                      const daysSinceJoined = Math.floor((new Date() - joinedDate) / (1000 * 60 * 60 * 24));
                      const activityScore = Math.min(100, (daysSinceJoined / 30) * 100);

                      return (
                        <FancyTableRow key={assistant._id}>
                          <DataCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <StyledAvatar
                                alt={assistant.name}
                                sx={{
                                  background: 'linear-gradient(45deg, #3a1c71, #d76d77)',
                                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                }}
                              >
                                {assistant.name.charAt(0)}
                              </StyledAvatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {assistant.name}
                                </Typography>
                                {/* <Typography variant="caption" color="textSecondary">
                                  ID: {assistant._id.slice(-8).toUpperCase()}
                                </Typography> */}
                              </Box>
                            </Box>
                          </DataCell>

                          <DataCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon sx={{ bgcolor: alpha('#2196f3', 0.1) }}>
                                  <EmailIcon sx={{ color: '#2196f3' }} />
                                </InfoIcon>
                                <Typography variant="body2">{assistant.email}</Typography>
                              </Box>
                              {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <InfoIcon sx={{ bgcolor: alpha('#4caf50', 0.1) }}>
                                  <Icon path={mdiAccountTie} size={0.8} color="#4caf50" />
                                </InfoIcon>
                                <Typography variant="body2">
                                  Member since {joinedDate.toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })}
                                </Typography>
                              </Box> */}
                            </Box>
                          </DataCell>

                          {/* <DataCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <StatusChip
                                label={assistant.isActive ? 'Active' : 'Inactive'}
                                status={assistant.isActive ? 'active' : 'inactive'}
                                sx={{ alignSelf: 'flex-start' }}
                              />
                              <Box sx={{ width: '100%' }}>
                                <Typography variant="caption" color="textSecondary" gutterBottom>
                                  Activity Score
                                </Typography>
                                <ProgressBar
                                  variant="determinate"
                                  value={activityScore}
                                  sx={{ mt: 1 }}
                                />
                              </Box>

                            </Box>
                          </DataCell> */}

                          <DataCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <StatusChip
                                label={assistant.isActive ? 'Active' : 'Inactive'}
                                status={assistant.isActive ? 'active' : 'inactive'}
                                sx={{ alignSelf: 'flex-start' }}
                              />
                              <Typography variant="body2" color="textSecondary">
                                Joined {daysSinceJoined} days ago
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Icon path={mdiChartLine} size={0.8} color={assistant.isActive ? "#4caf50" : "#f44336"} />
                                <Typography variant="caption">
                                  {assistant.isActive ? 'Currently Active' : 'Currently Inactive'}
                                </Typography>
                              </Box>
                            </Box>
                          </DataCell>

                          <DataCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="Edit Assistant">
                                <ActionButton onClick={() => handleEdit(assistant)}>
                                  <EditIcon sx={{ fontSize: 20, color: '#2196f3' }} />
                                </ActionButton>
                              </Tooltip>
                              <Tooltip title="Delete Assistant">
                                <ActionButton onClick={() => handleDelete(assistant._id)}>
                                  <DeleteIcon sx={{ fontSize: 20, color: '#f44336' }} />
                                </ActionButton>
                              </Tooltip>
                            </Box>
                          </DataCell>
                        </FancyTableRow>
                      );
                    })}
                </TableBody>
              </StyledTable>

              <Box p={2} sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box sx={{
                    display: 'flex',
                    gap: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '8px 16px',
                    borderRadius: '15px'
                  }}>
                    <StyledDatePicker
                      label="From"
                      value={dateRange.from}
                      onChange={handleDateChange('from')}
                      renderInput={(params) => <TextField {...params} />}
                      maxDate={dateRange.to || undefined}
                    />
                    <StyledDatePicker
                      label="To"
                      value={dateRange.to}
                      onChange={handleDateChange('to')}
                      renderInput={(params) => <TextField {...params} />}
                      minDate={dateRange.from || undefined}
                    />
                    {(dateRange.from || dateRange.to) && (
                      <IconButton
                        onClick={() => setDateRange({ from: null, to: null })}
                        sx={{
                          alignSelf: 'center',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </LocalizationProvider>
                <TablePagination
                  component="div"
                  count={getFilteredAssistants().length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </Box>
            </StyledTableContainer>
          </Container>
        </>
      )}
      <StyledDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedAssistant({ name: '', email: '', password: '' });
          setFormSubmitted(false);
        }}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle>
          <div className="icon-container">
            <Icon
              path={selectedAssistant._id ? mdiPencil : mdiPlus}
              size={1.2}
              color="#fff"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          {selectedAssistant._id ? 'Edit Assistant' : 'Add New Assistant'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={selectedAssistant.name}
              onChange={handleInputChange}
              error={formSubmitted && !selectedAssistant.name}
              helperText={formSubmitted && !selectedAssistant.name ? 'Name is required' : ''}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={selectedAssistant.email}
              onChange={handleInputChange}
              error={formSubmitted && !selectedAssistant.email}
              helperText={formSubmitted && !selectedAssistant.email ? 'Email is required' : ''}
              fullWidth
            />
            {!selectedAssistant._id && (
              <TextField
                label="Password"
                name="password"
                type="password"
                value={selectedAssistant.password}
                onChange={handleInputChange}
                error={formSubmitted && !selectedAssistant.password}
                helperText={formSubmitted && !selectedAssistant.password ? 'Password is required for new assistants' : ''}
                fullWidth
              />
            )}
          </Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 4
          }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setSelectedAssistant({ name: '', email: '', password: '' });
                setFormSubmitted(false);
              }}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                padding: '10px 28px',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(100, 116, 139, 0.1)',
                  borderColor: '#cbd5e1',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                padding: '10px 28px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              {selectedAssistant._id ? 'Update Assistant' : 'Add Assistant'}
            </Button>
          </Box>
        </StyledDialogContent>
      </StyledDialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </StyledDashboard>
  );
};

export default AssistantPage;