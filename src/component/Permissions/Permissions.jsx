import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { Backdrop, CircularProgress } from '@mui/material';
import '@mdi/font/css/materialdesignicons.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Card as MuiCard,
  IconButton,
  Switch as MuiSwitch,
  Fade, Tooltip
} from '@mui/material';
import Icon from '@mdi/react';
import { mdiShieldAccount, mdiPencil, mdiDelete, mdiAlertCircleOutline } from '@mdi/js';
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

const StyledCard = styled(MuiCard)(({ theme }) => ({
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
  }
}));

const Permissions = () => {
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [initialPermissions, setInitialPermissions] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Get authentication details from sessionStorage
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');
  const adminPortal = sessionStorage.getItem('adminPortal');

  const availablePermissions = [
    { id: 'dashboard', name: 'Dashboard', icon: 'mdi-view-dashboard' },
    { id: 'earnings', name: 'Earnings', icon: 'mdi-chart-line' },
    { id: 'patientManagement', name: 'Patient Management', icon: 'mdi-account-multiple' },
    { id: 'clinicianManagement', name: 'Clinician Management', icon: 'mdi-doctor' },
    { id: 'organizationManagement', name: 'Organization Management', icon: 'mdi-office-building' },
    { id: 'assistantManagement', name: 'Assistant Management', icon: 'mdi-account-tie' },
    { id: 'planManagement', name: 'Plan Management', icon: 'mdi-clipboard-list-outline' },
    { id: 'recommendation', name: 'Recommendations', icon: 'mdi-lightbulb-on' },
    { id: 'patientSubscription', name: 'Patient Subscription', icon: 'mdi-card-account-details' },
    { id: 'clinicianSubscription', name: 'Clinician Subscription', icon: 'mdi-card-account-details-outline' },
    { id: 'organizationSubscription', name: 'Organization Subscription', icon: 'mdi-office-building-outline' },
    { id: 'assessments', name: 'Assessments', icon: 'mdi-clipboard-text' },
    { id: 'announcements', name: 'Announcements', icon: 'mdi-bullhorn' },
    { id: 'payments', name: 'Payment Setup', icon: 'mdi-cash-register' }
  ];

  useEffect(() => {
    if (role === 'Admin' && adminPortal === 'true' && token) {
      fetchAssistants();
    } else {
      toast.error('Unauthorized access');
    }
  }, [role, adminPortal, token]);

  const fetchAssistants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/api/admin/assistants`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        const assistantOptions = response.data.body.map(assistant => ({
          value: assistant._id,
          label: assistant.name,
          email: assistant.email,
          isActive: assistant.isActive
        }));
        setAssistants(assistantOptions);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch assistants');
      console.error('Error fetching assistants:', error);
    }
    setLoading(false);
  };

  const handleAssistantChange = async (selected) => {
    setSelectedAssistant(selected);
    setHasChanges(false);

    if (selected) {
      setActionLoading(true);
      try {
        const response = await axios.get(
          `${BaseUrl}/api/admin/assistants/permissions/${selected.value}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === 'success') {
          const receivedPermissions = response.data.body.permissions || createDefaultPermissions();
          setPermissions(receivedPermissions);
          setInitialPermissions(receivedPermissions);
        }
      } catch (error) {
        toast.error('Failed to fetch assistant permissions');
        console.error('Error fetching permissions:', error);
        const defaultPerms = createDefaultPermissions();
        setPermissions(defaultPerms);
        setInitialPermissions(defaultPerms);
      } finally {
        setActionLoading(false);
      }
    } else {
      // Reset to default permissions when no assistant is selected
      const defaultPerms = createDefaultPermissions();
      setPermissions(defaultPerms);
      setInitialPermissions(defaultPerms);
    }
  };

  const handlePermissionChange = (permissionId) => {
    if (!selectedAssistant) return;

    const newPermissions = {
      ...permissions,
      [permissionId]: !permissions[permissionId]
    };
    setPermissions(newPermissions);

    // Compare new permissions with initial permissions to detect changes
    const hasAnyChange = Object.keys(newPermissions).some(
      key => newPermissions[key] !== initialPermissions[key]
    );

    console.log('Initial Permissions:', initialPermissions);
    console.log('New Permissions:', newPermissions);
    console.log('Has Changes:', hasAnyChange);

    setHasChanges(hasAnyChange);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssistant) {
      toast.warning('Please select an assistant');
      return;
    }

    Swal.fire({
      title: 'Update Permissions?',
      text: "Are you sure you want to update the permissions for this assistant?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#26d0ce',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(true);
        try {
          const response = await axios.put(
            `${BaseUrl}/api/admin/assistants/permissions/${selectedAssistant.value}`,
            { permissions },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.status === 'success') {
            Swal.fire(
              'Updated!',
              'Permissions have been updated successfully.',
              'success'
            );
          }
        } catch (error) {
          Swal.fire(
            'Error!',
            error.response?.data?.message || 'Failed to update permissions',
            'error'
          );
          console.error('Error updating permissions:', error);
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  // Enhanced custom styles
  const customStyles = {
    pageContainer: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(38, 208, 206, 0.05) 0%, transparent 50%)',
        zIndex: 0,
      }
    },
    headerContainer: {
      marginBottom: '2.5rem',
      position: 'relative',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'slideDown 0.5s ease-out',
    },
    mainCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '25px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      },
    },
    selectContainer: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '20px',
      padding: '2rem',
      margin: '1rem',
      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(38, 208, 206, 0.1)',
    },
    permissionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1.5rem',
    },
    permissionCard: {
      base: {
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '2px solid #e0e0e0',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(38, 208, 206, 0.1), transparent)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        },
      },
      active: {
        borderColor: '#26d0ce',
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 30px rgba(38, 208, 206, 0.15)',
        background: 'linear-gradient(135deg, rgba(38, 208, 206, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)',
      }
    },
    saveButton: {
      background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
      padding: '1rem 3rem',
      borderRadius: '50px',
      border: 'none',
      color: 'white',
      fontWeight: '600',
      letterSpacing: '1px',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 20px rgba(38, 208, 206, 0.2)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 15px 30px rgba(38, 208, 206, 0.3)',
      }
    }
  };

  // Create default permissions object
  const createDefaultPermissions = () => {
    const defaultPerms = {};
    availablePermissions.forEach(permission => {
      defaultPerms[permission.id] = false;
    });
    return defaultPerms;
  };

  // Set default permissions when component mounts
  useEffect(() => {
    const defaultPerms = createDefaultPermissions();
    setPermissions(defaultPerms);
    setInitialPermissions(defaultPerms);
  }, []); // This will run once when component mounts

  return (
    <StyledDashboard>
      <StyledPageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            <Icon
              path={mdiShieldAccount}
              size={1.5}
              color="#ffffff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>
          <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
            Assistant Permissions
          </span>
        </div>
        <Tooltip
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
                Assistant Permissions Management System
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                A comprehensive dashboard for managing and controlling access levels for assistants within the healthcare platform.
              </Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                System Overview:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Granular permission control for each assistant</li>
                <li>Real-time permission updates</li>
                <li>Role-based access management</li>
                <li>Audit trail for permission changes</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Available Permissions:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Dashboard Access: Overview of system metrics and analytics</li>
                <li>Earnings Management: Financial tracking and reporting</li>
                <li>Patient Management: Patient records and care coordination</li>
                <li>Clinician Management: Healthcare provider administration</li>
                <li>Organization Management: Healthcare facility oversight</li>
                <li>Assistant Management: Support staff coordination</li>
                <li>Plan Management: Treatment and care plan administration</li>
                <li>Recommendations: Clinical guidance and suggestions</li>
                <li>Subscription Management: Membership and billing control</li>
                <li>Assessment Tools: Clinical evaluation systems</li>
                <li>Announcements: System-wide communication tools</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Security Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Role-based authentication</li>
                <li>Secure permission updates</li>
                <li>Activity logging and monitoring</li>
                <li>Access control validation</li>
                <li>Permission inheritance rules</li>
              </ul>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                Administrative Controls:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                <li>Bulk permission management</li>
                <li>Permission templates</li>
                <li>Emergency access protocols</li>
                <li>Compliance monitoring</li>
                <li>Audit reporting</li>
              </ul>

              <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon path={mdiAlertCircleOutline} size={0.6} />
                  Note: Changes to permissions require administrative approval and are logged for security purposes
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
              maxWidth: 400,
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

      <Box sx={{ p: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1 }}>
        <StyledCard>
          <Box sx={{ p: 3 }}>
            <Form.Group>
              <Typography variant="h6" sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#2c3e50',
                mb: 2
              }}>
                Select Assistant
              </Typography>
              <Select
                options={assistants}
                value={selectedAssistant}
                onChange={handleAssistantChange}
                isSearchable
                placeholder="Choose an assistant..."
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    minHeight: '50px',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
                    '&:hover': {
                      borderColor: '#3b82f6'
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    padding: '12px 15px',
                    backgroundColor: state.isSelected ? '#26d0ce' :
                      state.isFocused ? 'rgba(38, 208, 206, 0.1)' : 'white',
                    color: state.isSelected ? 'white' : '#333',
                    '&:hover': {
                      backgroundColor: 'rgba(38, 208, 206, 0.1)'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden'
                  })
                }}
                formatOptionLabel={option => (
                  <div className="d-flex flex-column">
                    <span style={{ fontWeight: '500' }}>{option.label}</span>
                    <small style={{ color: '#6c757d' }}>{option.email}</small>
                    {!option.isActive && (
                      <span className="badge bg-warning"
                        style={{
                          alignSelf: 'flex-start',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '20px',
                          marginTop: '0.25rem'
                        }}>
                        Inactive
                      </span>
                    )}
                  </div>
                )}
              />
            </Form.Group>
          </Box>

          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 2
            }}>
              <Icon path={mdiShieldAccount} size={1} color="#3b82f6" />
              <Typography variant="h6" sx={{
                fontWeight: 600,
                color: '#2c3e50',
                m: 0
              }}>
                Permission Settings
              </Typography>
            </Box>
            {!selectedAssistant && (
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Select an assistant to manage permissions
              </Typography>
            )}
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 3,
            p: 3
          }}>
            {availablePermissions.map(permission => (
              <div
                key={permission.id}
                style={{
                  ...customStyles.permissionCard.base,
                  ...(permissions[permission.id] ? customStyles.permissionCard.active : {}),
                  opacity: !selectedAssistant ? 0.7 : 1,
                  cursor: !selectedAssistant ? 'not-allowed' : 'pointer'
                }}
                onClick={() => handlePermissionChange(permission.id)}
                className={`permission-card ${!selectedAssistant ? 'disabled' : ''}`}
              >
                <Form.Check
                  type="switch"
                  id={`permission-${permission.id}`}
                  label={
                    <div className="d-flex align-items-center gap-3">
                      <i className={`mdi ${permission.icon}`}
                        style={{
                          fontSize: '1.5rem',
                          color: permissions[permission.id] ? '#26d0ce' : '#6c757d'
                        }}></i>
                      <div>
                        <div style={{
                          fontWeight: '500',
                          color: permissions[permission.id] ? '#26d0ce' : '#2c3e50'
                        }}>{permission.name}</div>
                        <small style={{ color: '#6c757d' }}>
                          Access to {permission.name.toLowerCase()} features
                        </small>
                      </div>
                    </div>
                  }
                  checked={permissions[permission.id] || false}
                  onChange={() => handlePermissionChange(permission.id)}
                  disabled={!selectedAssistant}
                />
              </div>
            ))}
          </Box>

          {hasChanges && (
            <div className="p-4 text-end">
              <Button
                onClick={handleSubmit}
                disabled={saving || !selectedAssistant}
                style={customStyles.saveButton}
                className="save-button"
              >
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-content-save me-2"></i>
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </StyledCard>
      </Box>

      <style jsx>{`
        .permission-card.disabled {
          opacity: 0.7;
        }

        .permission-card.disabled:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        .form-switch .form-check-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wow-header {
          position: relative;
          overflow: hidden;
        }

        .wow-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #26d0ce, transparent);
        }

        .header-icon-container {
          position: relative;
          padding: 1rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 10px 20px rgba(38, 208, 206, 0.1);
          animation: pulse 2s infinite;
        }

        .wow-title {
          margin: 0;
          color: #2c3e50;
          font-weight: 700;
          font-size: 2.5rem;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: slideRight 0.5s ease-out;
        }

        .wow-subtitle {
          margin: 0.5rem 0 0;
          color: #6c757d;
          font-size: 1.2rem;
          opacity: 0.9;
          animation: slideRight 0.5s ease-out 0.1s;
        }

        .permission-card {
          transform-origin: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .permission-card:hover {
          transform: scale(1.02);
        }

        .form-switch .form-check-input {
          height: 1.5rem;
          width: 3rem;
          transition: all 0.3s ease;
        }

        .form-switch .form-check-input:checked {
          background-color: #26d0ce;
          border-color: #26d0ce;
          box-shadow: 0 0 10px rgba(38, 208, 206, 0.3);
        }

        .save-button {
          transform-origin: center;
          transition: all 0.3s ease;
        }

        .save-button:hover {
          transform: translateY(-2px) scale(1.05);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .permission-hover-effect {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
                    rgba(38, 208, 206, 0.1) 0%, 
                    rgba(38, 208, 206, 0) 50%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .permission-card:hover .permission-hover-effect {
          opacity: 1;
        }
      `}</style>

      <script jsx>{`
        document.querySelectorAll('.permission-card').forEach(card => {
          card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.querySelector('.permission-hover-effect').style.setProperty('--x', x + '%');
            card.querySelector('.permission-hover-effect').style.setProperty('--y', y + '%');
          });
        });
      `}</script>

      <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ToastContainer position="top-right" autoClose={3000} />
    </StyledDashboard>
  );
};

export default Permissions;
