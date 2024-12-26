import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grow, Grid, Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Input, Modal, Fade, Backdrop, Menu, MenuItem, Tabs, Tab, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import Icon from '@mdi/react';
import { mdiLightbulbOn, mdiAccountGroup, mdiDoctor, mdiPlus, mdiDelete, mdiCloudUpload, mdiFormatListBulleted, mdiStar, mdiDotsVertical, mdiPencil, mdiClipboardText, mdiAlertCircleOutline, mdiClipboardListOutline, mdiClockOutline, mdiImage, mdiMagnify, mdiFileDocument, mdiVideo } from '@mdi/js';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
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

const PatientCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
  borderRadius: '24px',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    opacity: 0.05,
    borderRadius: '24px 24px 0 0',
  }
}));

const RecommendationModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
  borderRadius: '24px',
  padding: theme.spacing(4),
  maxWidth: '800px',
  width: '90%',
  maxHeight: '90vh',
  overflow: 'auto',
  position: 'relative',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
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

const RecommendationCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
  borderRadius: '24px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    '& .action-buttons': {
      opacity: 1,
      transform: 'translateX(0)',
    }
  }
}));

const CardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '16px',
  position: 'relative',
});

const CardContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const RecommendationText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#1e293b',
  lineHeight: 1.6,
  fontWeight: 500,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  '& .icon-wrapper': {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
  }
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: '#64748b',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  '& .icon-wrapper': {
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

const MediaPreview = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const MediaItem = styled('img')({
  width: '70px',
  height: '70px',
  objectFit: 'cover',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '25px',
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
  },
}));

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


const ActionButtons = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  gap: '0.5rem',
  opacity: 0,
  transform: 'translateX(10px)',
  transition: 'all 0.3s ease',
});

const InfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s ease',
  marginBottom: theme.spacing(3),
  zIndex: 1000,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.9)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3b82f6',
      },
    },
    '&.Mui-focused': {
      background: '#ffffff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3b82f6',
        borderWidth: '2px',
      },
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(148, 163, 184, 0.2)',
    transition: 'all 0.2s ease',
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    '&::placeholder': {
      color: '#94a3b8',
      opacity: 1,
    },
  },
}));

const RecommendationsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  gap: '24px',
  padding: theme.spacing(3),
  position: 'relative',
  zIndex: 1,
}));

const MediaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '16px',
}));

const ImagePreview = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  width: '100px',
  height: '100px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    '& .image-overlay': {
      opacity: 1,
    }
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  '& .image-overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  }
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
  width: '100%'
});

const Recommendations = () => {
  const [filterPortalPatients, setFilterPortalPatients] = useState(true);
  const [patients, setPatients] = useState([]);
  const [clinicianPatients, setClinicianPatients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState({
    recommendation: '',
    type: 'portal',
    relatedMedia: {
      images: [],
      documents: [],
      videos: []
    }
  });
  const [openRecommendationsModal, setOpenRecommendationsModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingRecommendation, setEditingRecommendation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchClinicianPatients();
  }, []);

  const getApiBaseUrl = () => {
    const role = sessionStorage.getItem('role');
    return role === 'assistant' ? 'assistant' : 'admin';
  };

  const fetchPatients = async () => {
    setIsLoadingPatients(true);
    const token = sessionStorage.getItem('token');
    const baseUrl = getApiBaseUrl();

    if (token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/${baseUrl}/subscriptions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setPatients(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoadingPatients(false);
      }
    }
  };

  const fetchClinicianPatients = async () => {
    const token = sessionStorage.getItem('token');
    const baseUrl = getApiBaseUrl();

    if (token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/${baseUrl}/doctor-plan-subscriptions-with-details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setClinicianPatients(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching clinician patients:', error);
      }
    }
  };

  const fetchRecommendations = async (patientId) => {
    setIsLoadingRecommendations(true);
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/rec/recommendations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          const patientRecommendations = response.data.body.filter(rec => rec.recommendedTo === patientId);
          setRecommendations(patientRecommendations);
        }
      } catch (error) {
        toast.error('Error fetching recommendations. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }
  };

  const fetchAssessments = async (patientId) => {
    setIsLoadingAssessments(true);
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (token && adminPortal === 'true') {
      try {
        const baseUrl = role === 'assistant' ?
          `${BaseUrl}/api/assistant/patient-assessments` :
          `${BaseUrl}/api/admin/patient-assessments`;

        const response = await axios.get(baseUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          const patientData = response.data.body.find(p => p.patient.id === patientId);
          if (patientData) {
            const sortedAssessments = patientData.assessments.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setAssessments(sortedAssessments);
          } else {
            setAssessments([]);
          }
        }
      } catch (error) {
        toast.error('Error fetching assessments. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
        console.error('Error fetching assessments:', error);
      } finally {
        setIsLoadingAssessments(false);
      }
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    fetchRecommendations(patient.patient._id);
    fetchAssessments(patient.patient._id);
    setOpenRecommendationsModal(true);
    toast.info(`Viewing recommendations for ${patient.patient.userName}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const handleCloseRecommendationsModal = () => {
    setOpenRecommendationsModal(false);
    setSelectedPatient(null);
    setRecommendations([]);
  };

  const handleAddRecommendation = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedPatient && newRecommendation.recommendation) {
      try {
        const formData = new FormData();
        formData.append('recommendation', newRecommendation.recommendation);
        formData.append('type', newRecommendation.type);
        formData.append('recommendedTo', selectedPatient.patient._id);

        // Append media files
        newRecommendation.relatedMedia.images.forEach((file) => {
          formData.append(`images`, file);
        });
        newRecommendation.relatedMedia.documents.forEach((file) => {
          formData.append(`documents`, file);
        });
        newRecommendation.relatedMedia.videos.forEach((file) => {
          formData.append(`videos`, file);
        });

        const response = await axios.post(`${BaseUrl}/api/rec/create-rec`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Recommendation added successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchRecommendations(selectedPatient.patient._id);
          resetForm();
        }
      } catch (error) {
        toast.error('Error adding recommendation. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
        console.error('Error adding recommendation:', error);
      }
    }
  };

  const handleFileChange = (event, mediaType) => {
    const files = Array.from(event.target.files);
    setNewRecommendation(prev => ({
      ...prev,
      relatedMedia: {
        ...prev.relatedMedia,
        [mediaType]: files
      }
    }));
  };

  const handleDeleteRecommendation = async (recommendationId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "This recommendation will be permanently deleted.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3b82f6',
          cancelButtonColor: '#ef4444',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          background: '#ffffff',
          backdrop: `
            rgba(15, 23, 42, 0.4)
            left top
            no-repeat
          `,
          customClass: {
            popup: 'rounded-lg shadow-xl border border-gray-200',
            title: 'text-xl font-bold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'rounded-lg text-sm font-medium px-5 py-2.5',
            cancelButton: 'rounded-lg text-sm font-medium px-5 py-2.5'
          }
        });

        if (result.isConfirmed) {
          await axios.delete(`${BaseUrl}/api/rec/recommendations/${recommendationId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          toast.success('Recommendation deleted successfully!', {
            position: "top-right",
            autoClose: 3000,
            icon: '🗑️'
          });

          fetchRecommendations(selectedPatient.patient._id);
        }
      } catch (error) {
        toast.error('Error deleting recommendation. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
        console.error('Error deleting recommendation:', error);
      }
    }
  };

  const handleMenuOpen = (event, recommendation) => {
    setAnchorEl(event.currentTarget);
    setEditingRecommendation(recommendation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditingRecommendation(null);
  };

  const handleEditRecommendation = (recommendation) => {
    setIsEditing(true);
    setNewRecommendation({
      ...recommendation,
      relatedMedia: {
        images: [],
        documents: [],
        videos: []
      }
    });
    setOpenDialog(true);
  };

  const handleUpdateRecommendation = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && isEditing) {
      try {
        const formData = new FormData();
        formData.append('recommendation', newRecommendation.recommendation);
        formData.append('type', newRecommendation.type);

        // Append media files
        newRecommendation.relatedMedia.images.forEach((file) => {
          formData.append(`images`, file);
        });
        newRecommendation.relatedMedia.documents.forEach((file) => {
          formData.append(`documents`, file);
        });
        newRecommendation.relatedMedia.videos.forEach((file) => {
          formData.append(`videos`, file);
        });

        const response = await axios.put(`${BaseUrl}/api/rec/recommendations/${newRecommendation._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Recommendation updated successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchRecommendations(selectedPatient.patient._id);
          resetForm();
        }
      } catch (error) {
        toast.error('Error updating recommendation. Please try again.', {
          position: "top-right",
          autoClose: 4000,
        });
        console.error('Error updating recommendation:', error);
      }
    }
  };

  const resetForm = () => {
    setNewRecommendation({
      recommendation: '',
      type: 'portal',
      relatedMedia: {
        images: [],
        documents: [],
        videos: []
      }
    });
    setOpenDialog(false);
    setIsEditing(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <StyledDashboard>
      <StyledPageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            <Icon
              path={mdiClipboardListOutline}
              size={1.5}
              color="#ffffff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>
          <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
            Recommendations
          </span>
        </div>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Recommendations Management System
                </Typography>
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  <li>View and manage recommendations for both Portal and Clinician patients</li>
                  <li>Access patient profiles with detailed information including:
                    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                      <li>Patient's personal details and contact information</li>
                      <li>Subscription plan status and validity</li>
                      <li>Assigned clinician (for clinician patients)</li>
                    </ul>
                  </li>
                  <li>Create personalized recommendations with:
                    <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem' }}>
                      <li>Detailed text descriptions</li>
                      <li>Multiple media attachments (images, documents, videos)</li>
                      <li>Timestamps and tracking information</li>
                    </ul>
                  </li>
                  <li>View patient mood assessments and track progress</li>
                  <li>Edit existing recommendations to update content and media</li>
                  <li>Delete outdated or irrelevant recommendations</li>
                  <li>Toggle between Portal and Clinician patient lists</li>
                  <li>Real-time updates and notifications for changes</li>
                </ul>
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                  Tip: Click on a patient card to view their complete recommendation history and assessments
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
      </StyledPageHeader>
      <Box sx={{
        display: 'flex',
        justifyContent: 'end'
      }}>
        <StyledToggleButtonGroup
          value={filterPortalPatients ? 'portal' : 'clinician'}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setFilterPortalPatients(newValue === 'portal');
            }
          }}
          aria-label="patient type"
        >
          <ToggleButton value="portal" aria-label="portal patients">
            Portal Patients
          </ToggleButton>
          <ToggleButton value="clinician" aria-label="clinician patients">
            Clinician Patients
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Box>


      {/* <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <InfoPaper elevation={3}>
          <Typography variant="h5" component="div" gutterBottom>
            {filterPortalPatients ? "Portal Patients" : "Patients Subscribed to Clinicians"}
          </Typography>
          <Typography variant="body1">
            {filterPortalPatients
              ? "Showing recommendations for patients using the portal."
              : "Showing recommendations for patients subscribed to clinicians."}
          </Typography>
        </InfoPaper>
      </motion.div> */}

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {isLoadingPatients ? (
          <LoadingContainer>
            <CircularProgress sx={{ color: '#3b82f6' }} />
          </LoadingContainer>
        ) : (
          filterPortalPatients ? (
            patients.map((patient, index) => (
              <Grid item xs={12} sm={6} md={4} key={patient._id}>
                <PatientCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePatientClick(patient)}
                >
                  <Avatar
                    src={patient.patient.image}
                    alt={patient.patient.userName}
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>{patient.patient.userName}</Typography>
                  <Typography variant="body2" gutterBottom>{patient.patient.email}</Typography>
                  <Typography variant="body2" gutterBottom>{patient.patient.location || 'location Not specified'}</Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Plan: {patient.plan.name}
                  </Typography>
                  <Typography variant="body2">
                    Validity: {new Date(patient.endDate).toLocaleDateString()}
                  </Typography>
                </PatientCard>
              </Grid>
            ))
          ) : (
            clinicianPatients.map((patientData, index) => (
              <Grid item xs={12} sm={6} md={4} key={patientData.patient._id}>
                <PatientCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePatientClick(patientData)}
                >
                  <Avatar
                    src={patientData.patient.image}
                    alt={patientData.patient.userName}
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>{patientData.patient.userName}</Typography>
                  <Typography variant="body2" gutterBottom>{patientData.patient.email}</Typography>
                  <Typography variant="body2" gutterBottom>{patientData.patient.location || 'Location not specified'}</Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Plan: {patientData.plan?.name || 'No plan specified'}
                  </Typography>
                  <Typography variant="body2">
                    Validity: {patientData.subscription?.endDate ? new Date(patientData.subscription.endDate).toLocaleDateString() : 'Not specified'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Clinician: {patientData.clinician?.name || 'Not assigned'}
                  </Typography>
                </PatientCard>
              </Grid>
            ))
          )
        )}
      </Grid>

      <RecommendationModal
        open={openRecommendationsModal}
        onClose={handleCloseRecommendationsModal}
        closeAfterTransition
      >
        <Fade in={openRecommendationsModal}>
          <ModalContent
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {selectedPatient && (
              <>
                <Box display="flex" alignItems="center" mb={4}>
                  <Avatar
                    src={selectedPatient.patient.image}
                    alt={selectedPatient.patient.userName}
                    sx={{ width: 100, height: 100, mr: 3, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  />
                  <Box>
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="#1a237e">
                      {selectedPatient.patient.userName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedPatient.patient.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPatient.patient.location}
                    </Typography>
                  </Box>
                </Box>
                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab label="Assessments" icon={<Icon path={mdiClipboardText} size={1} />} iconPosition="start" />
                  <Tab label="Recommendations" icon={<Icon path={mdiLightbulbOn} size={1} />} iconPosition="start" />
                </Tabs>
                {activeTab === 0 && (
                  <AnimatePresence>
                    {isLoadingAssessments ? (
                      <LoadingContainer>
                        <CircularProgress sx={{ color: '#3b82f6' }} />
                      </LoadingContainer>
                    ) : assessments.length > 0 ? (
                      assessments.map((assessment, index) => (
                        <RecommendationCard
                          key={assessment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Typography variant="h6" gutterBottom color="#1a237e">
                            <Icon path={mdiClipboardText} size={1} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Mood Assessment
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Mood: {assessment.mood}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Mood Level: {assessment.moodLevel}
                          </Typography>
                          <Typography variant="caption" display="block" mb={1} color="text.secondary">
                            <Icon path={mdiStar} size={0.8} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {new Date(assessment.createdAt).toLocaleString()}
                          </Typography>
                        </RecommendationCard>
                      ))
                    ) : (
                      <Typography variant="body1" color="text.secondary" textAlign="center">
                        No assessments found
                      </Typography>
                    )}
                  </AnimatePresence>
                )}
                {activeTab === 1 && (
                  <>
                    <ActionButton
                      variant="contained"
                      startIcon={<Icon path={mdiPlus} size={1} />}
                      onClick={() => {
                        setIsEditing(false);
                        setOpenDialog(true);
                      }}
                      sx={{ mb: 4, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}
                    >
                      Add Recommendation
                    </ActionButton>
                    <AnimatePresence>
                      <RecommendationsGrid>
                        {isLoadingRecommendations ? (
                          <LoadingContainer>
                            <CircularProgress sx={{ color: '#3b82f6' }} />
                          </LoadingContainer>
                        ) : recommendations.length > 0 ? (
                          recommendations.map((rec, index) => (
                            <RecommendationCard
                              key={rec._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <CardHeader>
                                <ActionButtons className="action-buttons">
                                  <IconButton
                                    onClick={() => handleEditRecommendation(rec)}
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
                                    onClick={() => handleDeleteRecommendation(rec._id)}
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
                              </CardHeader>

                              <CardContent>
                                <RecommendationText>
                                  <span className="icon-wrapper">
                                    <Icon path={mdiFormatListBulleted} size={0.9} color="#ffffff" />
                                  </span>
                                  {rec.recommendation}
                                </RecommendationText>

                                <TimeStamp>
                                  <span className="icon-wrapper">
                                    <Icon path={mdiClockOutline} size={0.7} color="#3b82f6" />
                                  </span>
                                  {new Date(rec.timestamp).toLocaleString()}
                                </TimeStamp>

                                {rec.relatedMedia && (
                                  <MediaContainer>
                                    {rec.relatedMedia.images?.length > 0 && rec.relatedMedia.images.map((img, i) => (
                                      <ImagePreview
                                        key={i}
                                        onClick={() => {
                                          Swal.fire({
                                            imageUrl: img.url,
                                            imageAlt: `Image ${i + 1}`,
                                            width: 'auto',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdrop: 'rgba(15, 23, 42, 0.4)',
                                            showCloseButton: true,
                                            showConfirmButton: false,
                                            borderRadius: '16px',
                                            customClass: {
                                              image: 'rounded-lg max-h-[80vh] object-contain',
                                            }
                                          });
                                        }}
                                      >
                                        <img src={img.url} alt={`Image ${i + 1}`} />
                                        <div className="image-overlay">
                                          <Icon
                                            path={mdiMagnify}
                                            size={1}
                                            color="#ffffff"
                                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                                          />
                                        </div>
                                      </ImagePreview>
                                    ))}

                                    {/* Display document icons */}
                                    {rec.relatedMedia.documents?.length > 0 && rec.relatedMedia.documents.map((doc, i) => (
                                      <Box
                                        key={i}
                                        sx={{
                                          background: 'rgba(59, 130, 246, 0.1)',
                                          borderRadius: '10px',
                                          padding: '8px 16px',
                                          color: '#3b82f6',
                                          fontSize: '0.875rem',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          '&:hover': {
                                            background: 'rgba(59, 130, 246, 0.15)',
                                            transform: 'translateY(-2px)',
                                          }
                                        }}
                                        onClick={() => window.open(doc.url, '_blank')}
                                      >
                                        <Icon path={mdiFileDocument} size={0.7} />
                                        Document {i + 1}
                                      </Box>
                                    ))}

                                    {/* Display video thumbnails */}
                                    {rec.relatedMedia.videos?.length > 0 && rec.relatedMedia.videos.map((video, i) => (
                                      <Box
                                        key={i}
                                        sx={{
                                          background: 'rgba(239, 68, 68, 0.1)',
                                          borderRadius: '10px',
                                          padding: '8px 16px',
                                          color: '#ef4444',
                                          fontSize: '0.875rem',
                                          fontWeight: 600,
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          cursor: 'pointer',
                                          transition: 'all 0.2s ease',
                                          '&:hover': {
                                            background: 'rgba(239, 68, 68, 0.15)',
                                            transform: 'translateY(-2px)',
                                          }
                                        }}
                                        onClick={() => window.open(video.url, '_blank')}
                                      >
                                        <Icon path={mdiVideo} size={0.7} />
                                        Video {i + 1}
                                      </Box>
                                    ))}
                                  </MediaContainer>
                                )}
                              </CardContent>
                            </RecommendationCard>
                          ))
                        ) : (
                          <Typography variant="body1" color="text.secondary" textAlign="center">
                            No recommendations found
                          </Typography>
                        )}
                      </RecommendationsGrid>
                    </AnimatePresence>
                  </>
                )}

              </>
            )}
          </ModalContent>
        </Fade>
      </RecommendationModal>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleEditRecommendation(editingRecommendation); handleMenuClose(); }}>
          <Icon path={mdiPencil} size={1} style={{ marginRight: '8px' }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDeleteRecommendation(editingRecommendation._id); handleMenuClose(); }}>
          <Icon path={mdiDelete} size={1} style={{ marginRight: '8px' }} /> Delete
        </MenuItem>
      </Menu>

      <StyledDialog
        open={openDialog}
        onClose={resetForm}
        fullWidth
        maxWidth="md"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <StyledDialogTitle>
          <div className="icon-container">
            <Icon
              path={isEditing ? mdiPencil : mdiPlus}
              size={1.2}
              color="#fff"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
            />
          </div>
          {isEditing ? 'Edit Recommendation' : 'Add New Recommendation'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <StyledTextField
              autoFocus
              margin="normal"
              label="Recommendation"
              type="text"
              fullWidth
              variant="outlined"
              value={newRecommendation.recommendation}
              onChange={(e) => setNewRecommendation(prev => ({ ...prev, recommendation: e.target.value }))}
              multiline
              rows={4}
            />
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>Images</Typography>
              <Input
                type="file"
                inputProps={{ multiple: true, accept: 'image/*' }}
                onChange={(e) => handleFileChange(e, 'images')}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Documents</Typography>
              <Input
                type="file"
                inputProps={{ multiple: true, accept: '.pdf,.doc,.docx' }}
                onChange={(e) => handleFileChange(e, 'documents')}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Videos</Typography>
              <Input
                type="file"
                inputProps={{ multiple: true, accept: 'video/*' }}
                onChange={(e) => handleFileChange(e, 'videos')}
              />
            </Box>
          </Box>
        </StyledDialogContent>
        <StyledDialogActions sx={{ padding: '16px 32px' }}>
          <Button
            onClick={resetForm}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              color: '#64748b'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={isEditing ? handleUpdateRecommendation : handleAddRecommendation}
            variant="contained"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.3)',
              }
            }}
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </StyledDashboard >
  );
};

export default Recommendations;
