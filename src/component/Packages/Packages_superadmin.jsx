import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  styled,
  FormControlLabel,
  CircularProgress,
  Backdrop,
  Collapse,
  ToggleButtonGroup,
  ToggleButton,
  keyframes,
  Fade,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';
import Icon from '@mdi/react';
import { mdiClipboardListOutline, mdiDoctor, mdiPencil, mdiDelete, mdiAlertCircleOutline, mdiPlus, mdiClockOutline, mdiCalendarOutline } from '@mdi/js';
import { motion } from 'framer-motion';
import Card_circle from '../../assets/circle.svg';
import { mdiChartLine } from '@mdi/js';
import BaseUrl from '../../api';


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

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(2),
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  padding: '8px 24px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
  '&:hover': {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
  }

}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
  borderRadius: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateX(0)',
    }
  }
}));

const StyledCardContent = styled(Box)({
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
});

const CardHeader = styled('div')({
  marginBottom: '1.5rem',
  position: 'relative',
  '.plan-name': {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.5rem'
  },
  '.plan-price': {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
    '.price-period': {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#64748b'
    }
  }
});

const ActionButtons = styled('div')({
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  gap: '0.5rem',
  opacity: 0,
  transform: 'translateX(10px)',
  transition: 'all 0.3s ease',
  zIndex: 2,
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
    overflow: 'visible',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px)',
    background: 'rgba(15, 23, 42, 0.8)',
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: '32px 32px 24px',
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  color: '#fff',
  fontSize: '1.75rem',
  fontWeight: 700,
  borderRadius: '24px 24px 0 0',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
    animation: 'shimmer 2s infinite',
  },
  '& .icon-container': {
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(12px)',
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '32px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f5f9',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#94a3b8',
    borderRadius: '4px',
    '&:hover': {
      background: '#64748b',
    },
  },
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  padding: theme.spacing(2),
  borderRadius: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  color: '#fff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#e2e8f0',
    },
    '&:hover fieldset': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
});

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '4px',
  display: 'flex',
  justifyContent: 'end',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
  },
  '& .MuiToggleButton-root': {
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    margin: '0 4px',
    padding: '8px 20px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    letterSpacing: '0.025em',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },

    '&:hover': {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      transform: 'translateY(-1px)',
      '&::before': {
        opacity: 1,
      },
    },

    '&.Mui-selected': {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      '&:hover': {
        backgroundColor: '#2563eb',
        boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
        pointerEvents: 'none',
      },
    },

    '&:active': {
      transform: 'translateY(1px)',
    },

    '&:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.4)',
    },

    // Ripple effect
    '& .MuiTouchRipple-root': {
      color: 'rgba(255, 255, 255, 0.3)',
    },

    // Disabled state
    '&.Mui-disabled': {
      opacity: 0.6,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      cursor: 'not-allowed',
    },
  },

  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    padding: '3px',
    '& .MuiToggleButton-root': {
      padding: '6px 16px',
      margin: '0 2px',
      fontSize: '0.813rem',
    },
  },

  // Animation for selected state transition
  '& .MuiToggleButton-root.Mui-selected': {
    animation: 'selectButton 0.3s ease-out',
  },

  '@keyframes selectButton': {
    '0%': {
      transform: 'scale(0.95)',
    },
    '50%': {
      transform: 'scale(1.02)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}));

const getTimeAgo = (dateString) => {
  const diff = new Date() - new Date(dateString);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  if (years === 1) return '1 year ago';
  return `${years} years ago`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [bodyPartSectionExpanded, setBodyPartSectionExpanded] = useState(false);
  const [clinicianPlans, setClinicianPlans] = useState([]);
  const [clinicianPlanSectionExpanded, setClinicianPlanSectionExpanded] = useState(true);
  const [planType, setPlanType] = useState('patient');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openClinicianModal, setOpenClinicianModal] = useState(false);
  const [openEditClinicianModal, setOpenEditClinicianModal] = useState(false);
  const [selectedClinicianPlan, setSelectedClinicianPlan] = useState(null);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const adminPortal = sessionStorage.getItem('adminPortal');
    setIsAdmin(role === 'Admin' || role === 'assistant');
    setIsAdminPortal(adminPortal === 'true');
    fetchPlans();
    if (adminPortal === 'true') {
      fetchClinicianPlans();
    }
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const organizationId = sessionStorage.getItem('OrganizationId');
      const role = sessionStorage.getItem('role');
      // if (!token || !organizationId) {
      //   throw new Error('No authorization token or organization ID found');
      // }

      let url;
      if (role === 'organization') {
        if (!token || !organizationId) {
          throw new Error('No authorization token or organization ID found');
        } else {
          url = `${BaseUrl}/api/organization/plans`
        }
      }
      else if (role === 'Admin' || role === 'assistant') {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = `${BaseUrl}/api/${baseUrl}/portal-plans`;
      }

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            organizationId: organizationId
          }
        }
      );

      if (response.data.status === 'success') {
        const formattedPlans = response.data.body.map(plan => ({
          id: plan._id,
          name: plan.name,
          price: plan.price,
          details: plan.details,
          validity: plan.validity,
          status: plan.status,
          createdBy: plan.createdBy,
        }));
        setPlans(formattedPlans);
        toast.success('Plans fetched successfully');
      } else {
        throw new Error(response.data.message || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error(error.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchClinicianPlans = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (adminPortal === 'true' && token) {
        const response = await axios.get(
          `${BaseUrl}/api/clinicistPlan`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'success') {
          setClinicianPlans(response.data.body);
          toast.success('Clinician plans fetched successfully');
        } else {
          throw new Error(response.data.message || 'Failed to fetch clinician plans');
        }
      }
    } catch (error) {
      console.error('Error fetching clinician plans:', error);
      toast.error(error.message || 'Failed to fetch clinician plans');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanDetails = async (planId) => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      if (!token) {
        throw new Error('No authorization token found');
      }

      let url;
      if (role === 'organization') {
        url = `${BaseUrl}/api/organization/plan/${planId}`;
      }
      else if (role === 'Admin' || role === 'assistant') {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = `${BaseUrl}/api/${baseUrl}/portal-plans/${planId}`;
      }

      const response = await axios.get(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        const planDetails = response.data.body;
        return {
          id: planDetails._id,
          name: planDetails.name,
          price: planDetails.price,
          details: planDetails.details,
          validity: planDetails.validity,
          status: planDetails.status,
          createdBy: planDetails.createdBy,
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch plan details');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
      toast.error(error.message || 'Failed to fetch plan details');
    }
  };

  const handleOpenModal = async (plan = null) => {
    if (plan) {
      const planDetails = await fetchPlanDetails(plan.id);
      setSelectedPlan(planDetails);
    } else {
      setSelectedPlan(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setOpenModal(false);
  };

  const handleMenuOpen = (event, plan) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  const handleStatusChange = async (planId, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      if (!token) {
        throw new Error('No authorization token found');
      }

      let url;
      if (role === 'organization') {
        url = `${BaseUrl}/api/organization/plan/${planId}`
      }
      else if (role === 'Admin' || role === 'assistant') {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = `${BaseUrl}/api/${baseUrl}/portal-plans/${planId}`;
      }

      const response = await axios.put(
        url,
        { status: newStatus ? 'Active' : 'Inactive' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setPlans(plans.map(plan =>
          plan.id === planId ? { ...plan, status: newStatus ? 'Active' : 'Inactive' } : plan
        ));
        toast.success(`Plan status updated successfully`);
      } else {
        throw new Error(response.data.message || 'Failed to update plan status');
      }
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error('Failed to update plan status');
    }
  };

  const handleSavePlan = async (planData) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (!token) {
        throw new Error('No authorization token found');
      }

      // Format the data according to API requirements
      const formattedData = {
        name: planData.name,
        price: parseFloat(planData.price),
        details: planData.details,
        validity: parseInt(planData.validity)
      };

      console.log('Plan data to be sent:', formattedData);

      if (adminPortal === 'true') {
        const response = await axios({
          method: 'post',
          url: `${BaseUrl}/api/admin/create-plan`,
          data: formattedData,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Check if the response contains the created plan
        if (response.data && response.data._id) {
          // Format the response to match your plans state structure
          const newPlan = {
            id: response.data._id,
            name: response.data.name,
            price: response.data.price,
            details: response.data.details,
            validity: response.data.validity,
            status: response.data.status,
            createdBy: response.data.createdBy,
            planType: response.data.planType
          };

          setPlans(prevPlans => [...prevPlans, newPlan]);
          toast.success('Plan created successfully');
          handleCloseModal();
        } else {
          throw new Error('Invalid response format from server');
        }
      } else {
        throw new Error('Unauthorized to create plans');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(error.message || 'Failed to save plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async (planId) => {
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
        setActionLoading(true);
        const token = sessionStorage.getItem('token');
        const adminPortal = sessionStorage.getItem('adminPortal');

        if (!token || adminPortal !== 'true') {
          throw new Error('Unauthorized to delete plans');
        }

        // Optimistically update the UI
        setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));

        const response = await axios({
          method: 'delete',
          url: `${BaseUrl}/api/admin/portal-plans/${planId}`,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          Swal.fire(
            'Deleted!',
            response.data.message || 'The plan has been deleted.',
            'success'
          );
        } else {
          // If the server request fails, revert the optimistic update
          await fetchPlans();
          throw new Error(response.data.message || 'Failed to delete plan');
        }
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      Swal.fire(
        'Error!',
        error.message || 'Failed to delete plan',
        'error'
      );
      // Refresh plans in case of error
      await fetchPlans();
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveClinicianPlan = async (planData) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (adminPortal !== 'true' || !token) {
        throw new Error('Unauthorized to create clinician plans');
      }

      // Log the incoming planData to verify the active status
      console.log('Incoming planData:', planData);

      const formattedData = {
        name: planData.name,
        price: Number(planData.price),
        details: planData.details || 'No description provided',
        validity: Number(planData.validity),
        active: Boolean(planData.active) // Explicitly convert to boolean
      };

      // Log the formatted data before sending to API
      console.log('Formatted data being sent:', formattedData);

      const response = await axios.post(
        `${BaseUrl}/api/clinicistPlan`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Log the API response
      console.log('API Response:', response.data);

      if (response.data.status === 'success') {
        // Ensure we're using the correct active status from the response
        const newPlan = {
          ...response.data.body,
          active: formattedData.active // Use the status we sent
        };

        setClinicianPlans(prevPlans => [...prevPlans, newPlan]);
        toast.success('Clinician plan created successfully');
        handleCloseClinicianModal();
      } else {
        throw new Error(response.data.message || 'Failed to create clinician plan');
      }
    } catch (error) {
      console.error('Error creating clinician plan:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create clinician plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePlanTypeChange = (event, newType) => {
    if (newType !== null) {
      setPlanType(newType);
    }
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleOpenEditModal = async (plan) => {
    const planDetails = await fetchPlanDetails(plan.id);
    setSelectedPlan(planDetails);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedPlan(null);
    setOpenEditModal(false);
  };

  const handleAddPlan = async (planData) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (!token || adminPortal !== 'true') {
        throw new Error('Unauthorized to create plans');
      }

      const formattedData = {
        name: planData.name,
        price: parseFloat(planData.price),
        details: planData.details,
        validity: parseInt(planData.validity)
      };

      const response = await axios({
        method: 'post',
        url: `${BaseUrl}/api/admin/create-plan`,
        data: formattedData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data._id) {
        const newPlan = {
          id: response.data._id,
          name: response.data.name,
          price: response.data.price,
          details: response.data.details,
          validity: response.data.validity,
          status: response.data.status,
          createdBy: response.data.createdBy,
          planType: response.data.planType
        };

        setPlans(prevPlans => [...prevPlans, newPlan]);
        toast.success('Plan created successfully');
        handleCloseAddModal();
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error(error.message || 'Failed to create plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePlan = async (planData) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (!token || adminPortal !== 'true') {
        throw new Error('Unauthorized to update plans');
      }

      const formattedData = {
        name: planData.name,
        price: parseFloat(planData.price),
        details: planData.details,
        validity: parseInt(planData.validity),
        status: planData.status
      };

      const response = await axios({
        method: 'put',
        url: `${BaseUrl}/api/admin/portal-plans/${planData.id}`,
        data: formattedData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        setPlans(prevPlans =>
          prevPlans.map(plan =>
            plan.id === planData.id ? { ...plan, ...formattedData } : plan
          )
        );
        toast.success('Plan updated successfully');
        handleCloseEditModal();
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error(error.message || 'Failed to update plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenClinicianModal = () => {
    setOpenClinicianModal(true);
  };

  const handleCloseClinicianModal = () => {
    setOpenClinicianModal(false);
  };

  const fetchClinicianPlanDetails = async (planId) => {
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (!token || adminPortal !== 'true') {
        throw new Error('Unauthorized to fetch clinician plan details');
      }

      const response = await axios.get(
        `${BaseUrl}/api/clinicistPlan/${planId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        return response.data.body;
      } else {
        throw new Error(response.data.message || 'Failed to fetch clinician plan details');
      }
    } catch (error) {
      console.error('Error fetching clinician plan details:', error);
      toast.error(error.message || 'Failed to fetch clinician plan details');
      return null;
    }
  };

  const handleOpenEditClinicianModal = async (plan) => {
    const planDetails = await fetchClinicianPlanDetails(plan._id);
    if (planDetails) {
      setSelectedClinicianPlan(planDetails);
      setOpenEditClinicianModal(true);
    }
  };

  const handleCloseEditClinicianModal = () => {
    setSelectedClinicianPlan(null);
    setOpenEditClinicianModal(false);
  };

  const handleUpdateClinicianPlan = async (planData) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (!token || adminPortal !== 'true') {
        throw new Error('Unauthorized to update clinician plan');
      }

      const formattedData = {
        name: planData.name,
        price: Number(planData.price),
        details: planData.details,
        validity: Number(planData.validity),
        active: Boolean(planData.active)
      };

      const response = await axios.put(
        `${BaseUrl}/api/clinicistPlan/${planData._id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.data.status === 'success') {
        setClinicianPlans(prevPlans =>
          prevPlans.map(plan =>
            plan._id === planData._id ? { ...plan, ...response.data.body } : plan
          )
        );
        toast.success('Clinician plan updated successfully');
        handleCloseEditClinicianModal();
      } else {
        throw new Error(response.data.message || 'Failed to update clinician plan');
      }
    } catch (error) {
      console.error('Error updating clinician plan:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update clinician plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClinicianPlan = async (planId) => {
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
        setActionLoading(true);
        const token = sessionStorage.getItem('token');
        const adminPortal = sessionStorage.getItem('adminPortal');

        if (!token || adminPortal !== 'true') {
          throw new Error('Unauthorized to delete clinician plan');
        }

        const response = await axios.delete(
          `${BaseUrl}/api/clinicistPlan/${planId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'success') {
          setClinicianPlans(prevPlans => prevPlans.filter(plan => plan._id !== planId));
          Swal.fire(
            'Deleted!',
            'Clinician plan has been deleted.',
            'success'
          );
        } else {
          throw new Error(response.data.message || 'Failed to delete clinician plan');
        }
      }
    } catch (error) {
      console.error('Error deleting clinician plan:', error);
      Swal.fire(
        'Error!',
        error.message || 'Failed to delete clinician plan',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const EditClinicianPlanModal = ({ open, onClose, plan, onSave }) => {
    const [formData, setFormData] = useState({
      _id: '',
      name: '',
      price: '',
      details: '',
      validity: '',
      active: true
    });

    useEffect(() => {
      if (plan) {
        setFormData({
          _id: plan._id,
          name: plan.name,
          price: plan.price,
          details: plan.details,
          validity: plan.validity,
          active: plan.active
        });
      }
    }, [plan]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleActiveToggle = (e) => {
      setFormData(prev => ({
        ...prev,
        active: e.target.checked
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <StyledDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle>
          <div className="icon-container">
            <Icon
              path={mdiPencil}
              size={1.2}
              color="#fff"
            />
          </div>
          Edit Clinician Plan
        </StyledDialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Plan Name"
              name="planName"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Description"
              name="description"
              value={formData.details}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <StyledTextField
              fullWidth
              label="Validity (days)"
              name="validity"
              type="number"
              value={formData.validity}
              onChange={handleChange}
              margin="normal"
              required
            />
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                backgroundColor: 'rgba(59, 130, 246, 0.04)',
                borderRadius: '12px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: formData.active ? '#10b981' : '#ef4444',
                }}
              >
                {formData.active ? 'Active' : 'Inactive'}
              </Typography>
              <StatusSwitch
                checked={formData.active}
                onChange={handleActiveToggle}
                inputProps={{ 'aria-label': 'plan status' }}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                onClick={onClose}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  padding: '10px 28px',
                  color: '#64748b',
                  border: '2px solid #e2e8f0',
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  padding: '10px 28px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  fontWeight: 600,
                }}
              >
                Update Plan
              </Button>
            </Box>
          </form>
        </StyledDialogContent>
      </StyledDialog>
    );
  };

  return (
    <StyledDashboard>
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
            Subscription Plans
          </span>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Subscription Plans Management
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  <li>Manage both Patient and Clinician subscription plans</li>
                  <li>Create, edit, and delete subscription plans</li>
                  <li>Set plan pricing, validity periods, and features</li>
                  <li>Toggle plan status between active and inactive</li>
                  <li>Monitor plan creation and update history</li>
                  <li>View detailed plan descriptions and terms</li>
                  <li>Control access to different platform features</li>
                  <li>Manage subscription renewals and expirations</li>
                </ul>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                  Tip: Use the toggle buttons to switch between Patient and Clinician plans
                </Typography>
              </Box>
            }
            arrow
            placement="bottom-end"
            sx={{
              '& .MuiTooltip-tooltip': {
                bgcolor: 'rgba(255, 255, 255, 0.95)',
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
        </Box>
        {/* <StyledToggleButtonGroup
        value={planType}
        exclusive
        onChange={handlePlanTypeChange}
        aria-label="plan type"
        sx={{
          minWidth: '240px',
          justifyContent: 'flex-end'
        }}
      >
        <ToggleButton value="patient" aria-label="patient plans">
          Patient Plans
        </ToggleButton>
        <ToggleButton value="clinician" aria-label="clinician plans">
          Clinician Plans
        </ToggleButton>
      </StyledToggleButtonGroup> */}
      </StyledPageHeader>
      <Box sx={{
        display: 'flex',
        justifyContent: 'end'
      }}>

        <StyledToggleButtonGroup
          value={planType}
          exclusive
          onChange={handlePlanTypeChange}
          aria-label="plan type"
          sx={{
            minWidth: '240px',
            justifyContent: 'flex-end'
          }}
        >
          <ToggleButton value="patient" aria-label="patient plans">
            Patient Plans
          </ToggleButton>
          <ToggleButton value="clinician" aria-label="clinician plans">
            Clinician Plans
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        {planType === 'patient' ? (
          <Box mb={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="contained"
                onClick={handleOpenAddModal}
                startIcon={<Icon path={mdiPlus} size={1} />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                  }
                }}
              >
                Add Plan
              </Button>
            </Box>
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan._id}>
                  <StyledCard>
                    <StyledCardContent>
                      <ActionButtons className="action-buttons">
                        <IconButton
                          onClick={() => handleOpenEditModal(plan)}
                          sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Icon path={mdiPencil} size={0.7} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeletePlan(plan.id)}
                          sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Icon path={mdiDelete} size={0.7} />
                        </IconButton>
                      </ActionButtons>
                      <CardHeader>
                        <Typography className="plan-name">
                          {plan.name}
                        </Typography>



                        <Typography className="plan-price">
                          ${plan.price}
                          <span className="price-period">/{plan.validity} days</span>
                        </Typography>
                      </CardHeader>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            color: '#475569',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            marginBottom: '1rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {plan.details}
                        </Typography>
                      </Box>

                      <Box sx={{
                        marginTop: 'auto',
                        background: 'rgba(59, 130, 246, 0.04)',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography sx={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: plan.status === 'Active' ? '#10b981' : '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          '&::before': {
                            content: '""',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: plan.status === 'Active' ? '#10b981' : '#ef4444',
                          }
                        }}>
                          {plan.status}
                        </Typography>
                        <StatusSwitch
                          checked={plan.status === 'Active'}
                          onChange={(e) => handleStatusChange(plan.id, e.target.checked)}
                          inputProps={{ 'aria-label': 'plan status' }}
                        />
                      </Box>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box mb={4}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="contained"
                onClick={handleOpenClinicianModal}
                startIcon={<Icon path={mdiPlus} size={1} />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.3)',
                  }
                }}
              >
                Add Clinician Plan
              </Button>
            </Box>
            <Grid container spacing={3}>
              {clinicianPlans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan._id}>
                  <ClinicianPlanCard
                    plan={plan}
                    onEdit={() => handleOpenEditClinicianModal(plan)}
                    onDelete={() => handleDeleteClinicianPlan(plan._id)}
                    getTimeAgo={getTimeAgo}
                    formatDate={formatDate}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>

      <StyledDialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#fff',
          background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
          borderBottom: '2px solid #e0e0e0'
        }}>
          {selectedPlan ? 'Edit Plan' : 'Add New Plan'}
        </DialogTitle>
        <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
          <PlanForm
            plan={selectedPlan}
            onSave={handleSavePlan}
            onCancel={handleCloseModal}
            isAdmin={isAdmin}
            isAdminPortal={isAdminPortal}
          />
        </DialogContent>
      </StyledDialog>

      <StyledDialog
        open={openAddModal}
        onClose={handleCloseAddModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle>
          <div className="icon-container">
            <Icon
              path={mdiPlus}
              size={1.2}
              color="#fff"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          Add New Plan
        </StyledDialogTitle>
        <StyledDialogContent>
          <PlanForm
            onSave={handleAddPlan}
            onCancel={handleCloseAddModal}
            isAdmin={isAdmin}
            isAdminPortal={isAdminPortal}
          />
        </StyledDialogContent>
      </StyledDialog>

      <StyledDialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle>
          <div className="icon-container">
            <Icon
              path={mdiPencil}
              size={1.2}
              color="#fff"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          Edit Plan
        </StyledDialogTitle>
        <StyledDialogContent>
          <PlanForm
            plan={selectedPlan}
            onSave={handleUpdatePlan}
            onCancel={handleCloseEditModal}
            isAdmin={isAdmin}
            isAdminPortal={isAdminPortal}
          />
        </StyledDialogContent>
      </StyledDialog>

      <StyledDialog
        open={openClinicianModal}
        onClose={handleCloseClinicianModal}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle>
          <div className="icon-container">
            <Icon
              path={mdiDoctor}
              size={1.2}
              color="#fff"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          Add Clinician Plan
        </StyledDialogTitle>
        <StyledDialogContent>
          <ClinicianPlanForm
            onSave={handleSaveClinicianPlan}
            onCancel={handleCloseClinicianModal}
          />
        </StyledDialogContent>
      </StyledDialog>

      <EditClinicianPlanModal
        open={openEditClinicianModal}
        onClose={handleCloseEditClinicianModal}
        plan={selectedClinicianPlan}
        onSave={handleUpdateClinicianPlan}
      />
    </StyledDashboard>
  );
};

const StatusSwitch = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#10b981',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 16,
    height: 16,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    backgroundColor: '#ef4444',
    opacity: 1,
  },
}));

const PlanForm = ({ plan, onSave, onCancel, isAdmin, isAdminPortal }) => {
  const calculateEndDate = (startDate, validityDays) => {
    if (!startDate || !validityDays) return '';

    const date = new Date(startDate);
    date.setDate(date.getDate() + parseInt(validityDays));
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState(() => {
    if (plan) {
      return {
        id: plan.id,
        name: plan.planName || plan.name,
        price: plan.price,
        startDate: plan.startDate ? new Date(plan.startDate).toISOString().split('T')[0] : '',
        endDate: plan.endDate ? new Date(plan.endDate).toISOString().split('T')[0] : '',
        validity: plan.validity,
        status: plan.status || 'Active',
        planType: plan.planType || 'portal-plan'
      };
    }

    return {
      name: '',
      price: '',
      startDate: '',
      endDate: '',
      validity: '',
      status: 'Active',
      planType: 'portal-plan'
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };

      if (name === 'validity' && value) {
        newData.endDate = calculateEndDate(newData.startDate, value);
      }
      else if (name === 'startDate' && newData.validity) {
        newData.endDate = calculateEndDate(value, newData.validity);
      }

      return newData;
    });
  };

  const handleStatusChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      status: e.target.checked ? 'Active' : 'Inactive'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledTextField
        fullWidth
        label="Plan Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      <StyledTextField
        fullWidth
        label="Price (in USD)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        margin="normal"
        required
      />
      <StyledTextField
        fullWidth
        label="Details"
        name="details"
        value={formData.details}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
        required
      />
      <StyledTextField
        fullWidth
        label="Validity (in days)"
        name="validity"
        type="number"
        value={formData.validity}
        onChange={handleChange}
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal">
        <FormControlLabel
          control={
            <Switch
              checked={formData.status === 'Active'}
              onChange={handleStatusChange}
              name="status"
              color="primary"
            />
          }
          label={formData.status}
        />
      </FormControl>

      {isAdmin && isAdminPortal && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="plan-type-label">Plan Type</InputLabel>
          <Select
            labelId="plan-type-label"
            id="plan-type"
            name="planType"
            value={formData.planType}
            onChange={handleChange}
            required
          >
            <MenuItem value="portal-plan">Portal Plan</MenuItem>
            <MenuItem value="doctor-plan">Doctor Plan</MenuItem>
          </Select>
        </FormControl>
      )}

      {formData.planType === 'doctor-plan' && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              disabled
            />
          </Grid>
        </Grid>
      )}

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        mt: 4
      }}>
        <Button
          onClick={onCancel}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            padding: '10px 28px',
            color: '#64748b',
            border: '2px solid #e2e8f0',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            padding: '10px 28px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            fontWeight: 600,
          }}
        >
          {plan ? 'Update Plan' : 'Add Plan'}
        </Button>
      </Box>
    </form>
  );
};

const ClinicianPlanCard = ({ plan, onEdit, onDelete, getTimeAgo, formatDate }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        {/* Action Buttons */}
        <ActionButtons className="action-buttons">
          <IconButton
            onClick={onEdit}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              width: '32px',
              height: '32px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Icon path={mdiPencil} size={0.7} />
          </IconButton>
          <IconButton
            onClick={onDelete}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              width: '32px',
              height: '32px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Icon path={mdiDelete} size={0.7} />
          </IconButton>
        </ActionButtons>

        {/* Status Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: plan.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: plan.active ? '#10b981' : '#ef4444',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${plan.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            zIndex: 1,
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: plan.active ? '#10b981' : '#ef4444',
          }} />
          {plan.active ? 'Active' : 'Inactive'}
        </Box>

        {/* Plan Header */}
        <Box sx={{ mb: 3, mt: 4 }}> {/* Added top margin to account for status badge */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 1,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {plan.name}
          </Typography>

          <Typography
            sx={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              mb: 2,
            }}
          >
            ${plan.price}
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#64748b'
            }}>
              /{plan.validity} days
            </span>
          </Typography>
        </Box>

        {/* Plan Details */}
        <Box
          sx={{
            backgroundColor: 'rgba(59, 130, 246, 0.04)',
            borderRadius: '16px',
            padding: '1.25rem',
            mb: 3,
          }}
        >
          <Typography
            sx={{
              color: '#475569',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            {plan.details}
          </Typography>
        </Box>

        {/* Timeline Info */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            mt: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#64748b',
              fontSize: '0.813rem',
            }}
          >
            <Icon path={mdiClockOutline} size={0.7} />
            Created {getTimeAgo(plan.createdAt)}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#64748b',
              fontSize: '0.813rem',
            }}
          >
            <Icon path={mdiCalendarOutline} size={0.7} />
            Last updated: {formatDate(plan.updatedAt)}
          </Box>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
};

const ClinicianPlanForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    details: '',
    validity: '',
    active: true
  });

  const calculateEndDate = (startDate, validityDays) => {
    if (!startDate || !validityDays) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + parseInt(validityDays));
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };

      // Automatically calculate end date when start date or validity changes
      if ((name === 'validity' && newData.startDate) ||
        (name === 'startDate' && newData.validity)) {
        newData.endDate = calculateEndDate(
          newData.startDate || prevData.startDate,
          newData.validity || prevData.validity
        );
      }

      return newData;
    });
  };

  // Add handler for toggle switch
  const handleActiveToggle = (e) => {
    const newActiveStatus = e.target.checked;
    console.log('Toggle switched to:', newActiveStatus); // Debug log
    setFormData(prevData => ({
      ...prevData,
      active: newActiveStatus
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the form data before submission
    console.log('Form data being submitted:', formData);

    // Validate required fields
    if (!formData.name || !formData.price || !formData.validity) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate numeric fields
    if (isNaN(Number(formData.price)) || isNaN(Number(formData.validity))) {
      toast.error('Price and validity must be valid numbers');
      return;
    }

    onSave({
      ...formData,
      active: Boolean(formData.active) // Ensure it's a boolean
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledTextField
        fullWidth
        label="Plan Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      <StyledTextField
        fullWidth
        label="Price (in USD)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        margin="normal"
        required
      />
      <StyledTextField
        fullWidth
        label="Description"
        name="details"
        value={formData.details}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />
      <StyledTextField
        fullWidth
        label="Validity (in days)"
        name="validity"
        type="number"
        value={formData.validity}
        onChange={handleChange}
        margin="normal"
        required
      />

      {/* Added Status Toggle Switch */}
      <FormControl
        fullWidth
        margin="normal"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          backgroundColor: 'rgba(59, 130, 246, 0.04)',
          borderRadius: '12px',
        }}
      >
        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: formData.active ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            '&::before': {
              content: '""',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: formData.active ? '#10b981' : '#ef4444',
            }
          }}
        >
          {formData.active ? 'Active' : 'Inactive'}
        </Typography>
        <StatusSwitch
          checked={formData.active}
          onChange={handleActiveToggle}
          inputProps={{ 'aria-label': 'plan status' }}
        />
      </FormControl>

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        mt: 4
      }}>
        <Button
          onClick={onCancel}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            padding: '10px 28px',
            color: '#64748b',
            border: '2px solid #e2e8f0',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            padding: '10px 28px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            fontWeight: 600,
          }}
        >
          Create Clinician Plan
        </Button>
      </Box>
    </form>
  );
};

export default PlansManagement;
