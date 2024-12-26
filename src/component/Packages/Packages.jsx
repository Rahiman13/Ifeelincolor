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
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { toast } from 'react-toastify';
import axios from 'axios';
import Swal from 'sweetalert2';
import Icon from '@mdi/react';
import { mdiClipboardListOutline, mdiDoctor, mdiPencil, mdiDelete, mdiAlertCircleOutline } from '@mdi/js';
import { motion } from 'framer-motion';
import BaseUrl from '../../api';


const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [clinicianPlans, setClinicianPlans] = useState([]);

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

  const handleSavePlan = async (updatedPlan) => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      const organizationId = sessionStorage.getItem('OrganizationId');

      if (!token) {
        throw new Error('No authorization token found');
      }

      const planData = {
        name: updatedPlan.name,
        price: parseFloat(updatedPlan.price),
        details: updatedPlan.details,
        validity: parseInt(updatedPlan.validity),
        status: updatedPlan.status,
        organizationId: organizationId
      };

      if (isAdmin && isAdminPortal) {
        planData.planType = updatedPlan.planType;
      }

      console.log('Plan data to be sent:', planData);

      let url;
      if (role === 'organization') {
        url = updatedPlan.id
          ? `${BaseUrl}/api/organization/plan/${updatedPlan.id}`
          : `${BaseUrl}/api/organization/create-plan`;
      } else {
        const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
        url = updatedPlan.id
          ? `${BaseUrl}/api/${baseUrl}/portal-plans/${updatedPlan.id}`
          : `${BaseUrl}/api/${baseUrl}/create-plan`;
      }

      const method = updatedPlan.id ? 'put' : 'post';
      const response = await axios({
        method,
        url,
        data: planData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', response.data);

      if (response.data.status === 'success') {
        if (updatedPlan.id) {
          setPlans(plans.map(plan =>
            plan.id === updatedPlan.id
              ? {
                ...plan,
                ...response.data.body,
                id: response.data.body._id || response.data.body.id
              }
              : plan
          ));
          toast.success('Plan updated successfully');
        } else {
          const newPlan = {
            ...response.data.body,
            id: response.data.body._id || response.data.body.id
          };
          setPlans([...plans, newPlan]);
          toast.success('Plan created successfully');
        }
        handleCloseModal();
      } else {
        throw new Error(response.data.message || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to save plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlan = async () => {
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
        const role = sessionStorage.getItem('role');
        const organizationId = sessionStorage.getItem('OrganizationId');
        // if (!token || !organizationId) {
        //   throw new Error('No authorization token or organization ID found');
        // }

        let url;
        if (role === 'organization') {
          if (!token || !organizationId) {
            throw new Error('No authorization token or organization ID found');
          }
          else {
            url = `${BaseUrl}/api/organization/plan/${selectedPlan.id}`
          }
        }
        else if (role === 'Admin' || role === 'assistant') {
          const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
          url = `${BaseUrl}/api/${baseUrl}/portal-plans/${selectedPlan.id}`;
        }

        // Optimistically update the UI
        setPlans(plans.filter((p) => p.id !== selectedPlan.id));
        handleMenuClose();

        // Send delete request to the server
        const response = await axios.delete(
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
          Swal.fire(
            'Deleted!',
            'The plan has been deleted.',
            'success'
          );
        } else {
          // If the server request fails, revert the optimistic update
          fetchPlans();
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
      handleMenuClose();
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

      const response = await axios.post(
        `${BaseUrl}/api/clinicistPlan`,
        planData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setClinicianPlans([...clinicianPlans, response.data.body]);
        toast.success('Clinician plan created successfully');
        handleCloseModal();
      } else {
        throw new Error(response.data.message || 'Failed to create clinician plan');
      }
    } catch (error) {
      console.error('Error creating clinician plan:', error);
      toast.error(error.message || 'Failed to create clinician plan');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {loading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <Icon path={mdiClipboardListOutline} size={1.3} />
              </span> Subscription Plan Management
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
                    Plans Management System
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                    A comprehensive system for managing subscription plans for both organizations and clinicians.
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Key Features:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Create and manage multiple subscription plans</li>
                    <li>Set custom pricing and validity periods</li>
                    <li>Toggle plan status (Active/Inactive)</li>
                    <li>Separate management for organization and clinician plans</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Plan Types:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Organization Plans: For healthcare facilities and institutions</li>
                    <li>Clinician Plans: Specifically designed for individual healthcare providers</li>
                    <li>Portal Plans: For managing platform access and features</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Plan Management Tools:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Quick edit and update plan details</li>
                    <li>Real-time status updates</li>
                    <li>Bulk plan management capabilities</li>
                    <li>Plan deletion with confirmation</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Access Control:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Role-based access management</li>
                    <li>Admin-specific features and controls</li>
                    <li>Organization-specific plan visibility</li>
                    <li>Secure plan modification controls</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Plan Details Include:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Plan name and description</li>
                    <li>Pricing structure and validity period</li>
                    <li>Feature inclusions and limitations</li>
                    <li>Status indicators and controls</li>
                  </ul>

                  <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon path={mdiAlertCircleOutline} size={0.6} />
                      Note: Changes to plans may affect active subscriptions. Please review carefully before making modifications.
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

          <Box mb={4}>
            {/* <Typography variant="h6" sx={{ mb: 2, color: '#7a990a' }}>Patient Plans</Typography> */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'end', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
              <StyledButton
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenModal()}
                sx={{ alignSelf: { xs: 'flex-start', sm: 'auto', md: 'flex-end', lg: 'flex-end' } }}
              >
                Add Plan
              </StyledButton>
            </Box>

            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={plan.id}>
                  <StyledCard>
                    <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                          {plan.name}
                        </Typography>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, plan)}
                          sx={{ color: '#fff' }}
                          aria-controls="plan-menu"
                          aria-haspopup="true"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="h4" component="p" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#fff' }}>
                        ${plan.price}
                        <Typography component="span" variant="body2" sx={{ verticalAlign: 'super', ml: 0.5, color: 'rgba(255, 255, 255, 0.8)' }}>
                          /{plan.validity} days
                        </Typography>
                      </Typography>
                      <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
                        {plan.details}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {plan.status}
                        </Typography>
                        <StatusSwitch
                          checked={plan.status === 'Active'}
                          onChange={(e) => handleStatusChange(plan.id, e.target.checked)}
                          inputProps={{ 'aria-label': 'plan status' }}
                        />
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {isAdminPortal && (
            <Box mb={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#4a148c' }}>Clinician Plans</Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'end', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3 }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModal(null, 'clinician')}
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'auto', md: 'flex-end', lg: 'flex-end' } }}
                >
                  Add Clinician Plan
                </StyledButton>
              </Box>
              <Grid container spacing={3}>
                {clinicianPlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={plan._id}>
                    <ClinicianPlanCard
                      plan={plan}
                      onEdit={() => handleOpenModal(plan, 'clinician')}
                      onDelete={() => handleDeletePlan(plan._id, 'clinician')}
                      onStatusChange={(e) => handleStatusChange(plan._id, e.target.checked, 'clinician')}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
            <DialogTitle sx={{
              fontWeight: 'bold',
              fontSize: '1.5rem',
              color: '#fff', // Change text color to white for better contrast
              // backgroundColor: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', // Match navbar background
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
          </Dialog>

          <Menu
            id="plan-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleOpenModal(selectedPlan); handleMenuClose(); }}>
              <Icon path={mdiPencil} size={1} style={{ marginRight: '8px' }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => { handleDeletePlan(); handleMenuClose(); }}>
              <Icon path={mdiDelete} size={1} style={{ marginRight: '8px' }} />
              Delete
            </MenuItem>
          </Menu>
        </>
      )}
      <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: theme.palette.primary.contrastText,
  borderRadius: '16px',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    bottom: '-50%',
    left: '-50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
    transform: 'rotate(30deg)',
  },
}));

const StatusSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#4CAF50',
    '&:hover': {
      backgroundColor: 'rgba(76, 175, 80, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#4CAF50',
  },
}));

const StyledButton = styled(Button)({
  borderRadius: '25px',
  padding: '10px 20px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  color: 'white',
  height: 48,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
  },
});

const PlanForm = ({ plan, onSave, onCancel, isAdmin, isAdminPortal }) => {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    price: plan?.price || '',
    details: plan?.details || '',
    validity: plan?.validity || '',
    status: plan?.status || 'Active',
    planType: plan?.planType || 'portal-plan',
    id: plan?.id || null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    if (!formData.name || !formData.price || !formData.details || !formData.validity) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate numeric fields
    if (isNaN(formData.price) || isNaN(formData.validity)) {
      toast.error('Price and validity must be valid numbers');
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Plan Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
        error={!formData.name}
        helperText={!formData.name ? 'Plan name is required' : ''}
      />
      <TextField
        fullWidth
        label="Price (in USD)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        margin="normal"
        required
        error={!formData.price || isNaN(formData.price)}
        helperText={!formData.price ? 'Price is required' : isNaN(formData.price) ? 'Must be a valid number' : ''}
      />
      <TextField
        fullWidth
        label="Details"
        name="details"
        value={formData.details}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
        required
        error={!formData.details}
        helperText={!formData.details ? 'Details are required' : ''}
      />
      <TextField
        fullWidth
        label="Validity (in days)"
        name="validity"
        type="number"
        value={formData.validity}
        onChange={handleChange}
        margin="normal"
        required
        error={!formData.validity || isNaN(formData.validity)}
        helperText={!formData.validity ? 'Validity is required' : isNaN(formData.validity) ? 'Must be a valid number' : ''}
      />
      <FormControl fullWidth margin="normal">
        <FormControlLabel
          control={
            <Switch
              checked={formData.status === 'Active'}
              onChange={(e) => handleStatusChange(e.target.checked)}
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
      {isAdmin && isAdminPortal && formData.planType === 'doctor-plan' && (
        <>
          <TextField
            fullWidth
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
        </>
      )}
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!formData.name || !formData.price || !formData.details || !formData.validity}
        >
          {plan ? 'Update Plan' : 'Add Plan'}
        </Button>
      </DialogActions>
    </form>
  );
};

const ClinicianPlanCard = ({ plan, onEdit, onDelete, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledCard>
      <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#fff' }}>
            {plan.planName}
          </Typography>
          <IconButton onClick={handleMenuOpen} sx={{ color: '#fff' }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Typography variant="h4" component="p" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#fff' }}>
          ${plan.price}
          <Typography component="span" variant="body2" sx={{ verticalAlign: 'super', ml: 0.5, color: 'rgba(255, 255, 255, 0.8)' }}>
            /{plan.validity} days
          </Typography>
        </Typography>
        <Typography sx={{ mb: 1, color: 'rgba(255, 255, 255, 0.8)' }}>
          {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {plan.status || 'Active'}
          </Typography>
          <StatusSwitch
            checked={plan.status === 'Active'}
            onChange={onStatusChange}
            inputProps={{ 'aria-label': 'plan status' }}
          />
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { onDelete(); handleMenuClose(); }}>Delete</MenuItem>
      </Menu>
    </StyledCard>
  );
};

export default PlansManagement;
