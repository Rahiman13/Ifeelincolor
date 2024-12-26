import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Grid,
  TablePagination,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  Chip,
  CircularProgress,
  LinearProgress,
  Tooltip,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import Icon from '@mdi/react';
import { mdiAccount, mdiAlertCircleOutline, mdiMagnify } from '@mdi/js';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseUrl from '../../api';



// Add these new styled components at the top after existing styled components
const DashboardContainer = styled('div')(({ theme }) => ({
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

const CardHeader = styled(Box)(({ theme }) => ({
  // background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',

  padding: theme.spacing(2),
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const HeaderSelect = styled(Select)(({ theme }) => ({
  height: 40,
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white'
  },
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '& .MuiSelect-select': {
    padding: '8px 14px'
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  // borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    // transform: 'translateY(-8px)',
    // boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledTableContainerHeader = styled(TableContainer)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    // transform: 'translateY(-8px)',
    // boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '.MuiTableCell-root': {
    borderColor: 'rgba(0, 0, 0, 0.06)',
  }
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
  '&:hover': {
    transition: 'all 0.3s ease',
    // transform: 'translateY(-2px)',
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
  fontWeight: 500,
  borderRadius: '6px',
  fontSize: '0.75rem',
  height: '24px',
  ...(status === 'Active' && {
    color: theme.palette.success.dark,
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
  }),
  ...(status === 'Expired' && {
    color: theme.palette.error.dark,
    backgroundColor: alpha(theme.palette.error.main, 0.1),
    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
  }),
}));

const InfoIcon = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1.5),
  '& svg': {
    fontSize: '1.2rem',
  }
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '24px 24px 0 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    // transform: 'translateY(-2px)',
    // boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

// // Add this styled component after your existing styled components
// const SearchContainer = styled('div')(({ theme }) => ({
//   position: 'relative',
//   width: '300px',
//   '& input': {
//     width: '100%',
//     padding: '10px 36px 10px 40px',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     borderRadius: '12px',
//     color: 'white',
//     fontSize: '0.9rem',
//     transition: 'all 0.2s ease',
//     '&::placeholder': {
//       color: 'rgba(255, 255, 255, 0.6)',
//     },
//     '&:focus': {
//       outline: 'none',
//       backgroundColor: 'rgba(255, 255, 255, 0.15)',
//       borderColor: 'rgba(255, 255, 255, 0.3)',
//     },
//   },
//   '& .search-icon': {
//     position: 'absolute',
//     left: '12px',
//     top: '50%',
//     transform: 'translateY(-50%)',
//     color: 'rgba(255, 255, 255, 0.6)',
//   },
// }));

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

// Add new styled component for the dialog
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
  padding: '15px',
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

// ... rest of your styled components ...

const StyledEditDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(8px)',
  },
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '600px',
    width: '100%',
    margin: '16px',
    fontFamily: "'Poppins', sans-serif",
  }
}));

const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default function Component() {
  // State declarations (at the top of the component)
  const [filterType, setFilterType] = useState('all');
  const [portalPatients, setPortalPatients] = useState([]);
  const [clinicianPatients, setClinicianPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({
    userName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    mobile: '',
    guardian: '',
    address: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    userName: false,
    email: false,
    password: false,
    mobile: false
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Add API helper function
  const getApiBaseUrl = () => {
    const role = sessionStorage.getItem('role');
    return role === 'assistant' ? 'assistant' : 'admin';
  };

  // Add subscription data fetch effect
  const fetchSubscriptionData = async () => {
    setIsLoading(true);
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
    if (!isAdminPortal) {
      setIsLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      // const response = await fetch(`${BaseUrl}/api/${baseUrl}/subscription-counts`, {
      const response = await fetch(`${BaseUrl}/api/patients/join-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSubscriptionData(data.body.monthlyData);
        const years = [...new Set(Object.keys(data.body.monthlyData).map(date => date.split('-')[0]))];
        setAvailableYears(years.sort());
        if (years.length > 0) {
          setSelectedYear(Math.max(...years.map(Number)));
        }
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchSubscriptionData();
  }, []);

  // Update chart data configuration
  const barChartData = {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            // download: true,
            download: `<i class="mdi mdi-download fs-4"></i>`,
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      xaxis: {
        categories: subscriptionData
          ? Object.keys(subscriptionData)
            .filter(date => date.startsWith(selectedYear))
            .map(date => {
              const [year, month] = date.split('-');
              return new Date(year, month - 1).toLocaleString('default', { month: 'short' }).toUpperCase();
            })
          : [],
      },
      fill: {
        opacity: 1,
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 1,
          gradientToColors: ['#36A2EB'],
          opacityFrom: 0.7,
          opacityTo: 0.9,
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    series: [{
      name: 'Patients',
      data: subscriptionData
        ? Object.entries(subscriptionData)
          .filter(([date]) => date.startsWith(selectedYear))
          .map(([_, value]) => value)
        : []
    }]
  };

  // Update the fetchAllPatients effect
  const fetchAllPatients = async () => {
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
    if (!isAdminPortal || filterType !== 'all') {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      const baseUrl = role === 'assistant' ? 'assistant' : 'admin';

      const response = await fetch(`${BaseUrl}/api/${baseUrl}/get-patients`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        const formattedData = data.body.map(patient => ({
          id: patient._id,
          name: patient.userName,
          email: patient.email,
          mobile: patient.mobile || 'N/A',
          subscriptionType: 'Portal',
          planName: 'Basic Plan', // You might want to update this based on actual plan data
          details: 'Standard patient portal access',
          startDate: new Date().toLocaleDateString(), // Update with actual subscription dates
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString(),
          avatarSrc: patient.image || "/placeholder-user.jpg",
          avatarFallback: patient.userName.split(' ').map(n => n[0]).join(''),
          verified: patient.verified,
          location: patient.location,
          guardian: patient.guardian,
          dateOfBirth: patient.dateOfBirth
        }));

        setPortalPatients(formattedData);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };
  useEffect(() => {

    fetchAllPatients();
  }, [filterType]);

  // Update the portal patients effect
  const fetchPortalPatients = async () => {
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
    if (!isAdminPortal || filterType !== 'portal') return;

    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${BaseUrl}/api/${baseUrl}/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        const formattedData = data.body.map(subscription => ({
          id: subscription.patient._id,
          subscriptionId: subscription._id,
          name: subscription.patient.userName,
          email: subscription.patient.email,
          mobile: subscription.patient.mobile,
          subscriptionType: 'Portal',
          planName: subscription.plan.name,
          details: subscription.plan.details,
          status: subscription.plan.status,
          startDate: new Date(subscription.startDate).toLocaleDateString(),
          endDate: new Date(subscription.endDate).toLocaleDateString(),
          avatarSrc: subscription.patient.image || "/placeholder-user.jpg",
          avatarFallback: subscription.patient.userName.split(' ').map(n => n[0]).join(''),
          guardian: subscription.patient.guardian,
          location: subscription.patient.location,
          dateOfBirth: subscription.patient.dateOfBirth,
          verified: subscription.patient.verified
        }));
        setPortalPatients(formattedData);
      }
    } catch (error) {
      console.error('Error fetching portal subscriptions:', error);
    }
  };
  useEffect(() => {

    fetchPortalPatients();
  }, [filterType]);

  // Update the clinician patients effect
  const fetchClinicianPatients = async () => {
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';
    if (!isAdminPortal || filterType !== 'clinician') return;

    try {
      const token = sessionStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${BaseUrl}/api/${baseUrl}/doctor-plan-subscriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        const formattedData = data.body.map(item => ({
          id: item.patient?._id,
          name: item.patient?.userName,
          email: item.patient?.email,
          mobile: item.patient?.mobile,
          subscriptionType: 'Clinician',
          clinician: {
            name: item.clinisist?.name,
            specialization: item.clinisist?.specializedIn,
            degree: item.clinisist?.degree,
            licenseNumber: item.clinisist?.licenseNumber
          },
          planName: item.plan?.name,
          details: item.plan?.details,
          status: item.plan?.status,
          startDate: new Date(item.subscription?.startDate).toLocaleDateString(),
          endDate: new Date(item.subscription?.endDate).toLocaleDateString(),
          avatarSrc: item.patient?.image || "/placeholder-user.jpg",
          avatarFallback: item.patient?.userName.split(' ').map(n => n[0]).join(''),
        }));
        setClinicianPatients(formattedData);
      }
    } catch (error) {
      console.error('Error fetching clinician subscriptions:', error);
    }
  };
  useEffect(() => {

    fetchClinicianPatients();
  }, [filterType]);

  // Handler functions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add this helper function
  const calculateProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  // Update the getFilteredUsers function
  const getFilteredUsers = () => {
    let users = [];
    
    // First, apply the type filter
    switch (filterType) {
      case 'portal':
        users = portalPatients;
        break;
      case 'clinician':
        users = clinicianPatients;
        break;
      case 'all':
        users = [...portalPatients, ...clinicianPatients];
        break;
      default:
        users = [];
    }

    // Then, apply the search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      return users.filter(user => {
        const searchFields = [
          user.name?.toLowerCase(),
          user.email?.toLowerCase(),
          user.mobile?.toLowerCase(),
          user.clinician?.name?.toLowerCase(),
          user.clinician?.specialization?.toLowerCase(),
          user.planName?.toLowerCase()
        ];
        
        // Return true if any of the fields contain the search query
        return searchFields.some(field => field?.includes(query));
      });
    }

    return users;
  };

  // Add new handler for patient creation
  const handleCreatePatient = async () => {
    if (!sessionStorage.getItem('adminPortal')) return;

    // Reset errors
    setFormErrors({
      userName: false,
      email: false,
      password: false,
      mobile: false
    });

    // Validate required fields
    const errors = {
      userName: !newPatient.userName,
      email: !newPatient.email,
      password: !newPatient.password,
      mobile: !newPatient.mobile
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newPatient.email)) {
      errors.email = true;
    }

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${BaseUrl}/api/auth/patient-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPatient,
          dateOfBirth: newPatient.dateOfBirth || new Date().toISOString().split('T')[0],
          guardian: newPatient.guardian || '',
          location: newPatient.location || '',
          address: {
            latitude: newPatient.address?.latitude || 0,
            longitude: newPatient.address?.longitude || 0
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create patient');
      }

      if (data.status === 'success') {
        // Reset form and close dialog

        setNewPatient({
          userName: '',
          email: '',
          password: '',
          dateOfBirth: '',
          mobile: '',
          guardian: '',
          address: {
            latitude: 40.7128,
            longitude: -74.0060
          },
          location: ''
        });
        fetchAllPatients();
        fetchSubscriptionData();
        setOpenDialog(false);
        showSuccessToast('Patient created successfully');


        // Refresh data
      }
    } catch (error) {
      console.error('Error creating patient:', error.message);
      // You might want to show an error notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this helper function to get counts
  const getCounts = () => {
    const searchString = searchQuery.toLowerCase();

    const filteredPortal = portalPatients.filter(user => {
      const hasMatchingName = user.name.toLowerCase().includes(searchString);
      const hasMatchingEmail = user.email.toLowerCase().includes(searchString);
      return hasMatchingName || hasMatchingEmail;
    });

    const filteredClinician = clinicianPatients.filter(user => {
      const hasMatchingName = user.name.toLowerCase().includes(searchString);
      const hasMatchingEmail = user.email.toLowerCase().includes(searchString);
      const hasMatchingClinician = user.clinician?.name?.toLowerCase().includes(searchString);
      return hasMatchingName || hasMatchingEmail || hasMatchingClinician;
    });

    return {
      portal: filteredPortal.length,
      clinician: filteredClinician.length,
      total: filteredPortal.length + filteredClinician.length
    };
  };

  const handleEditClick = (user) => {
    setEditingPatient({
      id: user.id,
      userName: user.name,
      email: user.email,
      mobile: user.mobile,
      guardian: user.guardian || '',
      location: user.location || '',
      dateOfBirth: user.dateOfBirth || new Date().toISOString().split('T')[0],
      address: user.address || {
        latitude: 40.7128,
        longitude: -74.0060
      }
    });
    setOpenEditDialog(true);
  };

  const handleUpdatePatient = async () => {
    if (!sessionStorage.getItem('adminPortal')) return;

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${BaseUrl}/api/patients/update-patient-by-admin/${editingPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: editingPatient.userName,
          email: editingPatient.email,
          mobile: editingPatient.mobile,
          guardian: editingPatient.guardian,
          location: editingPatient.location,
          dateOfBirth: editingPatient.dateOfBirth,
          address: editingPatient.address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update patient');
      }

      if (data.status === 'success') {
        // Refresh data based on current filter type

        switch (filterType) {
          case 'portal':
            await fetchPortalPatients();
            break;
          case 'clinician':
            await fetchClinicianPatients();
            break;
          case 'all':
            await fetchAllPatients();
            break;
        }

        setOpenEditDialog(false);
        setEditingPatient(null);
        showSuccessToast('Patient updated successfully');
      }
    } catch (error) {
      console.error('Error updating patient:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleDeletePatient = async (patientId) => {
  //   if (!sessionStorage.getItem('adminPortal')) return;

  //   const result = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: "This action cannot be undone!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //     background: '#fff',
  //     borderRadius: '16px',
  //     customClass: {
  //       container: 'custom-swal-container',
  //       popup: 'custom-swal-popup',
  //       title: 'custom-swal-title',
  //       content: 'custom-swal-content',
  //     }
  //   });


  //   // Add confirmation dialog
  //   if (!window.confirm('Are you sure you want to delete this patient?')) {
  //     return;
  //   }

  //   try {
  //     const token = sessionStorage.getItem('token');

  //     const response = await fetch(`${BaseUrl}/api/patients/delete-patient-by-admin/${patientId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || 'Failed to delete patient');
  //     }

  //     if (data.status === 'success') {
  //       // Refresh data based on current filter type
  //       switch (filterType) {
  //         case 'portal':
  //           await fetchPortalPatients();
  //           break;
  //         case 'clinician':
  //           await fetchClinicianPatients();
  //           break;
  //         case 'all':
  //           await fetchAllPatients();
  //           break;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error deleting patient:', error.message);
  //     // You might want to show an error message to the user
  //   }
  // };

  const handleDeletePatient = async (patientId) => {
    if (!sessionStorage.getItem('adminPortal')) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      borderRadius: '16px',
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        content: 'custom-swal-content',
      }
    });


    if (result.isConfirmed) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${BaseUrl}/api/patients/delete-patient-by-admin/${patientId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.status === 'success') {
          showSuccessToast('Patient deleted successfully');
          // Refresh data based on current filter type
          switch (filterType) {
            case 'portal':
              await fetchPortalPatients();
              break;
            case 'clinician':
              await fetchClinicianPatients();
              break;
            case 'all':
              await fetchAllPatients();
              break;
          }
        } else {
          showErrorToast('Failed to delete patient');
        }
      } catch (error) {
        console.error('Error deleting patient:', error.message);
        showErrorToast('Error deleting patient');
      }
    }
  };

  // Update the useEffect for data fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsTableLoading(true); // Use table-specific loading state
      try {
        switch (filterType) {
          case 'portal':
            await fetchPortalPatients();
            break;
          case 'clinician':
            await fetchClinicianPatients();
            break;
          case 'all':
            await fetchAllPatients();
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsTableLoading(false); // Use table-specific loading state
      }
    };

    fetchData();
  }, [filterType]);

  return (
    <DashboardContainer>
      {isLoading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box sx={{ width: '100%' }}>
          <PageHeader>
            <div className="page-title">
              <div className="page-title-icon">
                <Icon
                  path={mdiAccount}
                  size={1.2}
                  color="#ffffff"
                  style={{
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                  }}
                />
              </div>
              <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                Patient Management
              </span>
            </div>
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Patient Management Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    A comprehensive platform for managing patient information and subscriptions:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      View monthly patient statistics and subscription trends
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Filter patients by type: Portal or Clinician subscriptions
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Search patients by name, email, or clinician
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Monitor subscription status and progress
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      Add new patients and manage their information
                    </li>
                    <li>
                      Track contact details and subscription timelines
                    </li>
                  </ul>
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
          </PageHeader>

          <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid item xs={12}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <CardHeader>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Patient Count by Month
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <HeaderSelect
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      displayEmpty
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </HeaderSelect>
                  </FormControl>
                </CardHeader>
                <CardContent>
                  <Box sx={{ height: 350 }}>
                    <Chart
                      options={barChartData.options}
                      series={barChartData.series}
                      type="bar"
                      height="100%"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <StyledTableContainerHeader>
                <TableHeaderBox>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      Patient Management
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
                        placeholder="Search patients..."
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
                      {`Found ${getFilteredUsers().length} results`}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <HeaderSelect
                        value={filterType}
                        onChange={(e) => {
                          setFilterType(e.target.value);
                          setPage(0);
                        }}
                        displayEmpty
                      >
                        {/* <MenuItem value="all">All Patients ({getCounts().total})</MenuItem> */}
                        <MenuItem value="all">All Patients </MenuItem>
                        {/* <MenuItem value="portal">Portal Patients ({getCounts().portal})</MenuItem> */}
                        <MenuItem value="portal">Portal Patients </MenuItem>
                        {/* <MenuItem value="clinician">Clinician Patients ({getCounts().clinician})</MenuItem> */}
                        <MenuItem value="clinician">Clinician Patients </MenuItem>
                      </HeaderSelect>
                    </FormControl>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
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
                      Add Patient
                    </Button>
                  </Box>
                </TableHeaderBox>

                <StyledTableContainer className="border-radius-0">
                  <StyledTable>
                    <StyledTableHead>
                      <TableRow>
                        <StyledHeaderCell width="20%">Patient Details</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Contact Information</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Subscription Details</StyledHeaderCell>
                        <StyledHeaderCell width="20%">Clinician Details</StyledHeaderCell>
                        <StyledHeaderCell width="10%">Status</StyledHeaderCell>
                        <StyledHeaderCell width="10%">Action</StyledHeaderCell>
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {isTableLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                            <CircularProgress size={40} />
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredUsers()
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((user) => (
                            <StyledTableRow key={user.id}>
                              <StyledTableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    src={user.avatarSrc}
                                    alt={user.userName}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                  />
                                  <Box sx={{ ml: 2 }}>
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        mb: 0.5
                                      }}
                                    >
                                      {user.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      {/* <span style={{ color: '#666' }}>ID:</span>&nbsp;{user.id} */}
                                    </Typography>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#2196f3', 0.1) }}>
                                      <EmailIcon sx={{ color: '#2196f3' }} />
                                    </InfoIcon>
                                    <Typography variant="body2">{user.email}</Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#4caf50', 0.1) }}>
                                      <PhoneIcon sx={{ color: '#4caf50' }} />
                                    </InfoIcon>
                                    <Typography variant="body2">{user.mobile}</Typography>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#9c27b0', 0.1) }}>
                                      <LocalHospitalIcon sx={{ color: '#9c27b0' }} />
                                    </InfoIcon>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {user.planName}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {user.details}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </StyledTableCell>

                              <StyledTableCell>
                                {user.subscriptionType !== 'Portal' ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ bgcolor: alpha('#ff9800', 0.1) }}>
                                      <LocalHospitalIcon sx={{ color: '#ff9800' }} />
                                    </InfoIcon>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {user.clinician?.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {user.clinician?.specialization}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          display: 'block',
                                          color: 'text.disabled',
                                          fontSize: '0.7rem'
                                        }}
                                      >
                                        {user.clinician?.degree}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {user.clinician?.licenseNumber}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.disabled">N/A</Typography>
                                )}
                              </StyledTableCell>

                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                  {/* <StatusChip
                                    label={new Date(user.endDate) > new Date() ? 'Active' : 'Expired'}
                                    status={new Date(user.endDate) > new Date() ? 'Active' : 'Expired'}
                                    size="small"
                                  /> */}
                                  <StatusChip label={user.status || 'N/A'} status={user.status?'Active':'Expired'} size="small" />

                                  {/* <Box>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'text.secondary',
                                        display: 'block',
                                        mb: 0.5
                                      }}
                                    >
                                      {user.startDate} - {user.endDate}
                                    </Typography>
                                    <LinearProgress
                                      variant="determinate"
                                      value={calculateProgress(user.startDate, user.endDate)}
                                      sx={{
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: alpha('#000', 0.05),
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: new Date(user.endDate) > new Date() ? 'success.main' : 'error.main',
                                        }
                                      }}
                                    />
                                  </Box> */}
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'center' }}>
                                  <Tooltip
                                    title="Edit Patient"
                                    arrow
                                    sx={{
                                      '& .MuiTooltip-tooltip': {
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        color: '#1e293b',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem'
                                      }
                                    }}
                                  >
                                    <ActionButton onClick={() => handleEditClick(user)}>
                                      <UpdateIcon
                                        sx={{
                                          fontSize: '1.2rem',
                                          color: '#3b82f6'
                                        }}
                                      />
                                    </ActionButton>
                                  </Tooltip>

                                  <Tooltip
                                    title="Delete Patient"
                                    arrow
                                    sx={{
                                      '& .MuiTooltip-tooltip': {
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        color: '#1e293b',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem'
                                      }
                                    }}
                                  >
                                    {/* <ActionButton> */}
                                    <ActionButton onClick={() => handleDeletePatient(user.id)}>

                                      <DeleteIcon
                                        sx={{
                                          fontSize: '1.2rem',
                                          color: '#ef4444'
                                        }}
                                      />
                                    </ActionButton>
                                  </Tooltip>
                                </Box>
                              </StyledTableCell>

                            </StyledTableRow>
                          ))
                      )}
                    </TableBody>
                  </StyledTable>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    component="div"
                    count={getFilteredUsers().length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
                  />
                </StyledTableContainer>
              </StyledTableContainerHeader>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Add Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
        }}>
          Add New Patient
          <IconButton onClick={() => setOpenDialog(false)} className="text-white">
            <CloseIcon className="text-white" />
          </IconButton>
        </StyledDialogTitle>
        <StyledDialogContent sx={{ mt: 2 }}>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* <Grid item xs={12} sm={6}> */}
            <TextField
              required
              fullWidth
              label="Name"
              name="name"
              value={newPatient.userName}
              onChange={(e) => setNewPatient({ ...newPatient, userName: e.target.value })}
              margin="normal"
              error={formErrors.userName}
              helperText={formErrors.userName && "Name is required"}
            />
            {/* </Grid> */}
            {/* <Grid item xs={12} sm={6}> */}
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={newPatient.email}
              onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              margin="normal"
              error={formErrors.email}
              helperText={formErrors.email && "Valid email is required"}
            />
            {/* </Grid> */}
            {/* <Grid item xs={12} sm={6}> */}
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={newPatient.password}
              onChange={(e) => setNewPatient({ ...newPatient, password: e.target.value })}
              margin="normal"
              error={formErrors.password}
              helperText={formErrors.password && "Password is required"}
            />
            {/* </Grid>
            <Grid item xs={12} sm={6}> */}
            <TextField
              required
              fullWidth
              label="Mobile"
              value={newPatient.mobile}
              onChange={(e) => setNewPatient({ ...newPatient, mobile: e.target.value })}
              margin="normal"
              error={formErrors.mobile}
              helperText={formErrors.mobile && "Mobile number is required"}
            />
            {/* </Grid> */}
            {/* <Grid item xs={12} sm={6}> */}
            <TextField
              fullWidth
              label="Guardian"
              value={newPatient.guardian}
              onChange={(e) => setNewPatient({ ...newPatient, guardian: e.target.value })}
              margin="normal"
              className="mt-2"

            />
            {/* </Grid> */}
            {/* <Grid item xs={12}> */}
            <TextField
              fullWidth
              label="Location"
              value={newPatient.location}
              onChange={(e) => setNewPatient({ ...newPatient, location: e.target.value })}
              margin="normal"
              className="mt-2"

            />
            {/* </Grid> */}
          </Box>
          {/* </StyledDialogContent> */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 1
          }}>
            <Button
              onClick={() => setOpenDialog(false)}
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
              onClick={handleCreatePatient}
              variant="contained"
              disabled={isSubmitting}
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
              {isSubmitting ? <CircularProgress size={24} sx={{color:'#fff'}} /> : 'Create Patient'}
            </Button>
          </Box>
        </StyledDialogContent>
      </StyledDialog>

      <StyledEditDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <div className="icon-wrapper">
              <UpdateIcon />
            </div>
            <span className="title-text">Edit Patient</span>
          </Box>
          <IconButton onClick={() => setOpenEditDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        <StyledDialogContent sx={{ mt: 2 }}>
          {editingPatient && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
              <TextField
                fullWidth
                label="Name"
                value={editingPatient.userName}
                onChange={(e) => setEditingPatient({ ...editingPatient, userName: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                value={editingPatient.email}
                onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Mobile"
                value={editingPatient.mobile}
                onChange={(e) => setEditingPatient({ ...editingPatient, mobile: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Guardian"
                value={editingPatient.guardian}
                onChange={(e) => setEditingPatient({ ...editingPatient, guardian: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Location"
                value={editingPatient.location}
                onChange={(e) => setEditingPatient({ ...editingPatient, location: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={editingPatient.dateOfBirth}
                onChange={(e) => setEditingPatient({ ...editingPatient, dateOfBirth: e.target.value })}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          )}
        </StyledDialogContent>

        <StyledDialogActions>
          <Button
            onClick={() => setOpenEditDialog(false)}
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
            onClick={handleUpdatePatient}
            variant="contained"
            disabled={isSubmitting}
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
            {isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Update Patient'}
          </Button>
        </StyledDialogActions>
      </StyledEditDialog>
    </DashboardContainer >
  );
}