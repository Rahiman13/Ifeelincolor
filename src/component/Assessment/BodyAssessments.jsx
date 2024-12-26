import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, Button, Grid, Card, CardContent, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  Backdrop, CircularProgress, Collapse, Checkbox, FormControlLabel, Input,
  ToggleButtonGroup, ToggleButton, Chip, Divider, Tooltip
} from '@mui/material';
import Icon from '@mdi/react';
import { mdiHumanHandsup, mdiChevronDown, mdiPlus, mdiDotsVertical, mdiEye, mdiPencil, mdiDelete, mdiChevronUp, mdiCloudUpload, mdiFormatListBulleted, mdiStar, mdiAlertCircleOutline, mdiCheckCircle } from '@mdi/js';
import { Add, MoreVert, Visibility, Edit, Delete, ExpandMore, ExpandLess, CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { lighten, darken } from '@mui/material/styles';
import BaseUrl from '../../api';


// Styled components
// const StyledButton = styled(Button)(({ theme }) => ({
//   borderRadius: '10px',
//   textTransform: 'none',
//   fontFamily: 'Poppins, sans-serif',
//   fontSize: '14px',
//   fontWeight: 600,
//   padding: '10px 20px',
//   boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
//   transition: 'all 0.15s ease',
//   '&:hover': {
//     transform: 'translateY(-1px)',
//     boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
//   },
// }));

// Helper function to calculate luminance
const getLuminance = (hexColor) => {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

// Updated GradientCard component
const GradientCard = styled(motion.div)(({ theme, gradientIndex }) => {
  const gradients = [
    { start: '#667eea', end: '#764ba2' },
    { start: '#ff9a9e', end: '#fad0c4' },
    { start: '#a1c4fd', end: '#c2e9fb' },
    { start: '#fbc2eb', end: '#a6c1ee' },
    { start: '#fad0c4', end: '#ffd1ff' },
    { start: '#fa709a', end: '#fee140' },
  ];

  const { start, end } = gradients[gradientIndex % gradients.length];
  const isLightBackground = getLuminance(start) > 0.5 || getLuminance(end) > 0.5;
  const textColor = isLightBackground ? '#000000' : '#ffffff';
  const textShadow = isLightBackground ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)';

  return {
    background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
    color: textColor,
    borderRadius: 20,
    padding: '25px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
      transform: 'rotate(30deg)',
      transition: 'all 0.5s ease-in-out',
    },
    '&:hover::before': {
      transform: 'rotate(0deg)',
    },
    '& .MuiTypography-root': {
      color: textColor,
      textShadow: textShadow,
    },
    '& .MuiIconButton-root': {
      color: textColor,
      backgroundColor: isLightBackground ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
      '&:hover': {
        backgroundColor: isLightBackground ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
      },
    },
  };
});

const AssessmentCard = styled(motion.div)(({ theme }) => ({
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

const AssessmentCardHeader = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '16px',
  position: 'relative',
});

const AssessmentCardContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

const QuestionTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  fontSize: '1.2rem',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  marginBottom: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
  },
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

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
  opacity: 0,
  transform: 'translateX(10px)',
  transition: 'all 0.3s ease-in-out',
});

const AssessmentGrid = styled(Grid)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
  padding: '24px 0',
});

// Add this new styled component for MCQ options
const McqOptionChip = styled(Box)(({ theme, isCorrect }) => ({
  padding: '8px 12px',
  borderRadius: '16px',
  backgroundColor: isCorrect ? 'rgba(46, 125, 50, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  border: `1px solid ${isCorrect ? '#2e7d32' : 'rgba(0, 0, 0, 0.12)'}`,
  color: isCorrect ? '#2e7d32' : 'rgba(0, 0, 0, 0.87)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  margin: '4px 0',
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

const FileUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #cbd5e1',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: '#f8fafc',
  '&:hover': {
    borderColor: '#3b82f6',
    backgroundColor: '#f1f5f9',
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
    objectFit: 'contain',
  },
  '& .upload-icon': {
    color: '#64748b',
    marginBottom: '12px',
  },
  '& .upload-text': {
    color: '#64748b',
    marginBottom: '4px',
    fontWeight: 500,
  },
  '& .upload-subtext': {
    color: '#94a3b8',
    fontSize: '0.875rem',
  },
  '& .remove-button': {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
  }
}));

// Add this styled component for the media upload section
const MediaUploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed #e2e8f0',
  borderRadius: '16px',
  padding: '24px',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  marginBottom: '24px',
  '&:hover': {
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  }
}));

const BodyAssessments = () => {
  // Body Parts state
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [openBodyPartModal, setOpenBodyPartModal] = useState(false);
  const [bodyPartModalMode, setBodyPartModalMode] = useState('view');
  const [bodyPartSectionExpanded, setBodyPartSectionExpanded] = useState(true);
  const [bodyPartAnchorEl, setBodyPartAnchorEl] = useState(null);

  // Body Assessments state
  const [bodyAssessments, setBodyAssessments] = useState([]);
  const [selectedBodyAssessment, setSelectedBodyAssessment] = useState(null);
  const [openBodyAssessmentModal, setOpenBodyAssessmentModal] = useState(false);
  const [bodyAssessmentModalMode, setBodyAssessmentModalMode] = useState('view');
  const [bodyAssessmentSectionExpanded, setBodyAssessmentSectionExpanded] = useState(true);
  const [bodyAssessmentAnchorEl, setBodyAssessmentAnchorEl] = useState(null);
  const [newBodyAssessment, setNewBodyAssessment] = useState({
    question: '',
    answer: '',
    type: 'mcq',
    score: 0,
    part: '',
    mcqOptions: [{ text: '', color: '', isCorrect: false }, { text: '', color: '', isCorrect: false }],
  });

  // Separate modals for view, edit, and add
  const [viewBodyAssessmentModal, setViewBodyAssessmentModal] = useState(false);
  const [editBodyAssessmentModal, setEditBodyAssessmentModal] = useState(false);
  const [addBodyAssessmentModal, setAddBodyAssessmentModal] = useState(false);

  // Shared state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [moods, setMoods] = useState([]);
  const [newBodyPart, setNewBodyPart] = useState({ partName: '', description: '' });

  // Add new state for active tab
  const [activeTab, setActiveTab] = useState('bodyParts');

  // Add tab change handler
  const handleTabChange = (event, newValue) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  useEffect(() => {
    fetchBodyParts();
    fetchBodyAssessments();
    fetchMoods();
  }, []);

  // Body Parts functions
  const fetchBodyParts = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/admin/body`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setBodyParts(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching body parts:', error);
        toast.error('Error fetching body parts');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBodyPartMenuOpen = (event, bodyPart) => {
    setBodyPartAnchorEl(event.currentTarget);
    setSelectedBodyPart(bodyPart);
  };

  const handleBodyPartMenuClose = () => {
    setBodyPartAnchorEl(null);
  };

  const handleBodyPartModalOpen = async (mode, bodyPart = null) => {
    setBodyPartModalMode(mode);

    if (mode === 'edit' || mode === 'view') {
      const bodyPartData = await fetchBodyPartById(bodyPart._id);
      if (bodyPartData) {
        setSelectedBodyPart(bodyPartData);
        setOpenBodyPartModal(true);
      }
    } else {
      setNewBodyPart({ partName: '', description: '' });
      setOpenBodyPartModal(true);
    }
    handleBodyPartMenuClose();
  };

  const handleBodyPartModalClose = () => {
    setOpenBodyPartModal(false);
    setSelectedBodyPart(null);
  };

  const handleAddBodyPart = () => {
    setNewBodyPart({ partName: '', description: '' });
    setOpenBodyPartModal(true);
    setBodyPartModalMode('add');
  };

  const handleBodyPartInputChange = (e) => {
    const { name, value } = e.target;
    if (bodyPartModalMode === 'add') {
      setNewBodyPart(prev => ({ ...prev, [name]: value }));
    } else {
      setSelectedBodyPart(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveBodyPart = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        // Validation
        const bodyPartData = bodyPartModalMode === 'add' ? newBodyPart : selectedBodyPart;
        if (!bodyPartData.partName || !bodyPartData.description) {
          toast.error('Please fill all required fields');
          setActionLoading(false);
          return;
        }

        let response;
        if (bodyPartModalMode === 'add') {
          response = await axios.post(`${BaseUrl}/api/admin/body`, bodyPartData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (bodyPartModalMode === 'edit') {
          response = await axios.put(`${BaseUrl}/api/admin/body/${selectedBodyPart._id}`, bodyPartData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (response.data.status === 'success') {
          // Update the local state immediately for better UX
          if (bodyPartModalMode === 'edit') {
            setBodyParts(prevParts =>
              prevParts.map(part =>
                part._id === selectedBodyPart._id ? response.data.body : part
              )
            );
          } else {
            setBodyParts(prevParts => [...prevParts, response.data.body]);
          }

          handleBodyPartModalClose();
          toast.success(`Body part ${bodyPartModalMode === 'add' ? 'added' : 'updated'} successfully`);

          // Refresh the list to ensure synchronization
          fetchBodyParts();
        }
      } catch (error) {
        console.error(`Error ${bodyPartModalMode} body part:`, error);
        toast.error(`Error ${bodyPartModalMode} body part: ${error.response?.data?.message || error.message}`);
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const handleDeleteBodyPart = async (bodyPartId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && bodyPartId) {
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

          const response = await axios.delete(
            `${BaseUrl}/api/admin/body/${bodyPartId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.status === 'success') {
            // Update local state
            setBodyParts(prevParts => prevParts.filter(part => part._id !== bodyPartId));

            // Close any open menus
            handleBodyPartMenuClose();

            // Show success message
            toast.success('Body part deleted successfully');

            // Refresh the list
            await fetchBodyParts();
          }
        }
      } catch (error) {
        console.error('Error deleting body part:', error);
        toast.error(`Error deleting body part: ${error.response?.data?.message || error.message}`);
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access or invalid body part');
    }
  };
  // Body Assessments functions
  const fetchBodyAssessments = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/bodytest`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          // Map through the assessments and process media URLs if needed
          const processedAssessments = response.data.body.map(assessment => ({
            ...assessment,
            media: assessment.media ? `${BaseUrl}media/${assessment.media}` : null
          }));
          setBodyAssessments(processedAssessments);
        }
      } catch (error) {
        console.error('Error fetching body assessments:', error);
        toast.error('Error fetching body assessments');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBodyAssessmentMenuOpen = (event, assessment) => {
    setBodyAssessmentAnchorEl(event.currentTarget);
    setSelectedBodyAssessment(assessment);
  };

  const handleBodyAssessmentMenuClose = () => {
    setBodyAssessmentAnchorEl(null);
  };

  const handleBodyAssessmentModalOpen = (mode, assessment = null) => {
    if (mode === 'view') {
      setSelectedBodyAssessment(assessment);
      setViewBodyAssessmentModal(true);
    } else if (mode === 'edit') {
      setNewBodyAssessment({
        ...assessment,
        mcqOptions: assessment.mcqOptions.map(option => ({
          ...option,
          isCorrect: option.text === assessment.answer
        }))
      });
      setEditBodyAssessmentModal(true);
    } else if (mode === 'add') {
      setNewBodyAssessment({
        question: '',
        answer: '',
        type: 'mcq',
        score: 0,
        part: '',
        mcqOptions: [{ text: '', color: '', isCorrect: false }, { text: '', color: '', isCorrect: false }],
      });
      setAddBodyAssessmentModal(true);
    }
    handleBodyAssessmentMenuClose();
  };

  const handleBodyAssessmentModalClose = () => {
    setViewBodyAssessmentModal(false);
    setEditBodyAssessmentModal(false);
    setAddBodyAssessmentModal(false);
    setSelectedBodyAssessment(null);
  };

  const handleBodyAssessmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewBodyAssessment(prev => ({ ...prev, [name]: value }));
  };

  const handleMcqOptionChange = (index, field, value) => {
    setNewBodyAssessment(prev => {
      const updatedOptions = [...prev.mcqOptions];
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
      if (field === 'isCorrect' && value) {
        updatedOptions.forEach((option, i) => {
          if (i !== index) option.isCorrect = false;
        });
      }
      return { ...prev, mcqOptions: updatedOptions };
    });
  };

  const handleCreateBodyAssessment = async () => {
    try {
      setActionLoading(true);
      const token = sessionStorage.getItem('token');

      // Find the correct answer from mcqOptions
      const correctOption = newBodyAssessment.mcqOptions.find(option => option.isCorrect);
      const answer = correctOption ? correctOption.text : '';

      const assessmentData = {
        question: newBodyAssessment.question,
        answer,
        type: 'mcq',
        score: newBodyAssessment.score,
        part: newBodyAssessment.part,
        mcqOptions: newBodyAssessment.mcqOptions.map(option => ({
          text: option.text,
          color: option.color
        }))
      };

      const response = await axios.post(
        `${BaseUrl}/api/bodytest`,
        assessmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Assessment created successfully');
        handleBodyAssessmentModalClose();
        fetchBodyAssessments(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchMoods = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/admin/moods`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setMoods(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        toast.error('Error fetching moods');
      }
    }
  };

  const handleAddOption = () => {
    setNewBodyAssessment(prev => ({
      ...prev,
      mcqOptions: [...prev.mcqOptions, { text: '', color: '', isCorrect: false }]
    }));
  };

  const handleRemoveOption = (index) => {
    setNewBodyAssessment(prev => ({
      ...prev,
      mcqOptions: prev.mcqOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveBodyAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        // Validation
        if (!newBodyAssessment.question || !newBodyAssessment.part || newBodyAssessment.score === 0 || !newBodyAssessment.mcqOptions.some(option => option.isCorrect)) {
          toast.error('Please fill all required fields');
          setActionLoading(false);
          return;
        }

        const bodyAssessmentData = {
          question: newBodyAssessment.question,
          answer: newBodyAssessment.mcqOptions.find(option => option.isCorrect)?.text || '',
          type: 'mcq', // Always set type to 'mcq'
          score: parseInt(newBodyAssessment.score),
          part: newBodyAssessment.part,
          mcqOptions: newBodyAssessment.mcqOptions.map(({ text, color }) => ({ text, color }))
        };

        let response;
        if (bodyAssessmentModalMode === 'edit') {
          response = await axios.put(`${BaseUrl}/api/bodytest/${newBodyAssessment._id}`, bodyAssessmentData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          response = await axios.post(`${BaseUrl}/api/bodytest`, bodyAssessmentData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }

        if (response.data.status === 'success') {
          if (bodyAssessmentModalMode === 'edit') {
            setBodyAssessments(prevAssessments =>
              prevAssessments.map(assessment =>
                assessment._id === response.data.body._id ? response.data.body : assessment
              )
            );
            toast.success('Body assessment updated successfully');
          } else {
            setBodyAssessments(prevAssessments => [...prevAssessments, response.data.body]);
            toast.success('Body assessment created successfully');
          }
          handleBodyAssessmentModalClose();
        }
      } catch (error) {
        console.error('Error saving body assessment:', error);
        toast.error('Error saving body assessment: ' + (error.response?.data?.message || error.message));
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const editBodyAssessment = async (id, updatedData) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.put(`${BaseUrl}/api/bodytest/${id}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Body assessment updated successfully');
          return response.data.body;
        }
      } catch (error) {
        console.error('Error updating body assessment:', error);
        toast.error('Error updating body assessment');
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  const fetchBodyAssessmentById = async (id) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/bodytest/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          return response.data.body;
        } else {
          throw new Error(response.data.message || 'Failed to fetch body assessment');
        }
      } catch (error) {
        console.error('Error fetching body assessment:', error);
        toast.error('Error fetching body assessment: ' + (error.response?.data?.message || error.message));
        return null;
      }
    } else {
      toast.error('Unauthorized access');
      return null;
    }
  };

  const deleteBodyAssessment = async (id) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const response = await axios.delete(`${BaseUrl}/api/bodytest/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Body assessment deleted successfully');
          return true;
        } else {
          throw new Error(response.data.message || 'Failed to delete body assessment');
        }
      } catch (error) {
        console.error('Error deleting body assessment:', error);
        toast.error('Error deleting body assessment: ' + (error.response?.data?.message || error.message));
        return false;
      }
    } else {
      toast.error('Unauthorized access');
      return false;
    }
  };

  const handleDeleteBodyAssessment = async (id) => {
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
      const success = await deleteBodyAssessment(id);
      if (success) {
        setBodyAssessments(prevAssessments => prevAssessments.filter(assessment => assessment._id !== id));
        handleBodyAssessmentMenuClose();
      }
    }
  };

  const handleEditBodyAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        // Prepare the data to be sent
        const bodyAssessmentData = {
          question: newBodyAssessment.question,
          answer: newBodyAssessment.mcqOptions.find(option => option.isCorrect)?.text || '',
          type: 'mcq', // Always set type to 'mcq'
          score: parseInt(newBodyAssessment.score),
          part: newBodyAssessment.part,
          mcqOptions: newBodyAssessment.mcqOptions.map(({ text, color }) => ({ text, color }))
        };

        const response = await axios.put(`${BaseUrl}/api/bodytest/${newBodyAssessment._id}`, bodyAssessmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          setBodyAssessments(prevAssessments =>
            prevAssessments.map(assessment =>
              assessment._id === response.data.body._id ? response.data.body : assessment
            )
          );
          handleBodyAssessmentModalClose();
          toast.success('Body assessment updated successfully');
        }
      } catch (error) {
        console.error('Error updating body assessment:', error);
        toast.error('Error updating body assessment: ' + (error.response?.data?.message || error.message));
      } finally {
        setActionLoading(false);
      }
    } else {
      toast.error('Unauthorized access');
    }
  };

  // Add this new function to fetch body part by ID
  const fetchBodyPartById = async (id) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        const response = await axios.get(`${BaseUrl}/api/admin/body/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          setSelectedBodyPart(response.data.body);
          return response.data.body;
        } else {
          throw new Error(response.data.message || 'Failed to fetch body part');
        }
      } catch (error) {
        console.error('Error fetching body part:', error);
        toast.error('Error fetching body part: ' + (error.response?.data?.message || error.message));
        return null;
      } finally {
        setActionLoading(false);
      }
    }
    return null;
  };

  // Add this function definition
  const handleDeleteIconClick = (event, bodyPart) => {
    event.stopPropagation(); // Prevent event bubbling
    handleDeleteBodyPart(bodyPart._id);
  };

  // Render functions
  const renderBodyPartsSection = () => (
    <Box mb={4}>
      <StyledButton
        variant="contained"
        color="primary"
        endIcon={bodyPartSectionExpanded ? <Icon path={mdiChevronUp} size={1} /> : <Icon path={mdiChevronDown} size={1} />}
        onClick={() => setBodyPartSectionExpanded(!bodyPartSectionExpanded)}
        fullWidth
        sx={{
          backgroundColor: '#7a990a',
          '&:hover': { backgroundColor: '#218838' },
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">Body Parts</Typography>
      </StyledButton>
      <Collapse in={bodyPartSectionExpanded}>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <StyledButton
            variant="contained"
            color="secondary"
            startIcon={<Icon path={mdiPlus} size={1} />}
            onClick={handleAddBodyPart}
            sx={{ backgroundColor: '#6c757d', '&:hover': { backgroundColor: '#5a6268' } }}
          >
            Add Body Part
          </StyledButton>
        </Box>
        <Grid container spacing={3}>
          {bodyParts.map((part, index) => (
            <Grid item xs={12} sm={6} md={4} key={part._id}>
              <GradientCard
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                gradientIndex={index}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {part.partName}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBodyPartMenuOpen(e, part);
                    }}
                  >
                    <Icon path={mdiDotsVertical} size={1} />
                  </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {part.description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 70,
                    height: 70,
                    margin: '0 auto',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'rotate(15deg)',
                      boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <Icon path={mdiHumanHandsup} size={1.8} />
                </Box>
              </GradientCard>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );

  const renderBodyAssessmentsSection = () => (
    <Box mb={4}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 600,
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Icon path={mdiFormatListBulleted} size={1} color="#3b82f6" />
          Body Assessments
        </Typography>
        <StyledButton
          variant="contained"
          startIcon={<Icon path={mdiPlus} size={1} />}
          onClick={() => handleBodyAssessmentModalOpen('add')}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white'
          }}
        >
          Add Assessment
        </StyledButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AssessmentGrid>
          {bodyAssessments.map((assessment) => (
            <AssessmentCard
              key={assessment._id}
              component={motion.div}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <AssessmentCardHeader>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                    {assessment.question}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      icon={<Icon path={mdiFormatListBulleted} size={0.7} />}
                      label={assessment.type.toUpperCase()}
                      size="small"
                      sx={{ backgroundColor: '#e2e8f0' }}
                    />
                    <Chip
                      icon={<Icon path={mdiStar} size={0.7} />}
                      label={`Score: ${assessment.score}`}
                      size="small"
                      sx={{ backgroundColor: '#e2e8f0' }}
                    />
                  </Box>
                </Box>
                <ActionButtons className="action-buttons">
                  <IconButton
                    onClick={() => handleBodyAssessmentModalOpen('edit', assessment)}
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
                    }}
                  >
                    <Icon path={mdiPencil} size={0.7} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteBodyAssessment(assessment._id)}
                    sx={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      '&:hover': { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }
                    }}
                  >
                    <Icon path={mdiDelete} size={0.7} />
                  </IconButton>
                </ActionButtons>
              </AssessmentCardHeader>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                  MCQ Options:
                </Typography>
                {assessment.mcqOptions.map((option, index) => (
                  <McqOptionChip
                    key={index}
                    isCorrect={option.text === assessment.answer}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {option.text}
                    </Typography>
                    {option.text === assessment.answer && (
                      <Icon path={mdiCheckCircle} size={0.7} color="#2e7d32" />
                    )}
                  </McqOptionChip>
                ))}
              </Box>
            </AssessmentCard>
          ))}
        </AssessmentGrid>
      )}
    </Box>
  );

  const renderViewBodyAssessmentModal = () => (
    <StyledDialog
      open={viewBodyAssessmentModal}
      onClose={handleBodyAssessmentModalClose}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>
        <div className="dialog-icon">
          <Icon path={mdiFormatListBulleted} size={1.2} color="#ffffff" />
        </div>
        View Body Assessment
      </StyledDialogTitle>
      <StyledDialogContent>
        {selectedBodyAssessment?.media && (
          <div className="form-section">
            <div className="section-title">Media</div>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 2
              }}
            >
              <img
                src={selectedBodyAssessment.media}
                alt="Assessment media"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </Box>
          </div>
        )}
        {selectedBodyAssessment && (
          <>
            <TextField
              fullWidth
              label="Question"
              value={selectedBodyAssessment.question || ''}
              disabled
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              label="Body Part"
              value={bodyParts.find(part => part._id === selectedBodyAssessment.part)?.partName || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Score"
              value={selectedBodyAssessment.score || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Type"
              value={selectedBodyAssessment.type || ''}
              disabled
              sx={{ mb: 2 }}
            />
            {selectedBodyAssessment.type === 'mcq' && (
              <>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Options:</Typography>
                {selectedBodyAssessment.mcqOptions.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option.text}
                      disabled
                      sx={{ mr: 1 }}
                    />
                    <Checkbox
                      checked={option.text === selectedBodyAssessment.answer}
                      disabled
                    />
                  </Box>
                ))}
              </>
            )}
          </>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <Button
          onClick={handleBodyAssessmentModalClose}
          sx={{
            color: '#64748b',
            borderRadius: '10px',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
          }}
        >
          Close
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );

  const renderEditBodyAssessmentModal = () => (
    <StyledDialog
      open={editBodyAssessmentModal}
      onClose={handleBodyAssessmentModalClose}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>
        <div className="icon-wrapper">
          <Icon path={mdiPencil} size={1.2} color="#ffffff" />
        </div>
        <span className="title-text">Edit Body Assessment</span>
      </StyledDialogTitle>
      <StyledDialogContent>
        <div className="form-section">
          <div className="section-title">Basic Information</div>
          <TextField
            fullWidth
            label="Question"
            name="question"
            value={newBodyAssessment.question}
            onChange={handleBodyAssessmentInputChange}
          />
          <TextField
            fullWidth
            label="Score"
            name="score"
            type="number"
            value={newBodyAssessment.score}
            onChange={handleBodyAssessmentInputChange}
          />
          <TextField
            fullWidth
            select
            label="Body Part"
            name="part"
            value={newBodyAssessment.part}
            onChange={handleBodyAssessmentInputChange}
          >
            {bodyParts.map((part) => (
              <MenuItem key={part._id} value={part._id}>
                {part.partName}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="form-section">
          <div className="section-title">MCQ Options</div>
          {newBodyAssessment.mcqOptions.map((option, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleMcqOptionChange(index, 'text', e.target.value)}
              />
              <TextField
                fullWidth
                select
                label="Mood"
                value={option.color}
                onChange={(e) => handleMcqOptionChange(index, 'color', e.target.value)}
              >
                {moods.map((mood) => (
                  <MenuItem key={mood._id} value={mood._id}>
                    {mood.mood}
                  </MenuItem>
                ))}
              </TextField>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={(e) => handleMcqOptionChange(index, 'isCorrect', e.target.checked)}
                    sx={{
                      color: '#3b82f6',
                      '&.Mui-checked': {
                        color: '#3b82f6',
                      },
                    }}
                  />
                }
                label="Correct"
              />
              <IconButton
                onClick={() => handleRemoveOption(index)}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            onClick={handleAddOption}
            startIcon={<Add />}
            variant="outlined"
            sx={{
              mt: 2,
              borderColor: '#3b82f6',
              color: '#3b82f6',
              '&:hover': {
                borderColor: '#2563eb',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
            }}
          >
            Add Option
          </Button>
        </div>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button
          variant="outlined"
          onClick={handleBodyAssessmentModalClose}
          sx={{
            color: '#64748b',
            borderColor: '#e2e8f0',
            '&:hover': {
              borderColor: '#cbd5e1',
              background: '#f8fafc'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleEditBodyAssessment}
          disabled={actionLoading}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }
          }}
        >
          {actionLoading ? 'Updating...' : 'Update Assessment'}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );

  const renderBodyPartModal = () => (
    <StyledDialog
      open={openBodyPartModal}
      onClose={handleBodyPartModalClose}
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle>
        <div className="icon-wrapper">
          <Icon path={mdiHumanHandsup} size={1.2} color="#ffffff" />
        </div>
        <span className="title-text">
          {bodyPartModalMode === "edit" ? "Edit Body Part" : bodyPartModalMode === "add" ? "Add New Body Part" : "View Body Part"}
        </span>
      </StyledDialogTitle>
      <StyledDialogContent>
        <div className="form-section mt-4">
          <TextField
            fullWidth
            label="Part Name"
            name="partName"
            value={bodyPartModalMode === 'add' ? newBodyPart.partName : selectedBodyPart?.partName || ''}
            onChange={handleBodyPartInputChange}
            disabled={bodyPartModalMode === 'view'}
            InputLabelProps={{
              sx: {
                color: '#64748b',
                '&.Mui-focused': {
                  color: '#3b82f6'
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={bodyPartModalMode === 'add' ? newBodyPart.description : selectedBodyPart?.description || ''}
            onChange={handleBodyPartInputChange}
            disabled={bodyPartModalMode === 'view'}
            InputLabelProps={{
              sx: {
                color: '#64748b',
                '&.Mui-focused': {
                  color: '#3b82f6'
                }
              }
            }}
          />
        </div>
      </StyledDialogContent>
      <StyledDialogActions>
        <Button
          variant="outlined"
          onClick={handleBodyPartModalClose}
        >
          {bodyPartModalMode === 'view' ? 'Close' : 'Cancel'}
        </Button>
        {bodyPartModalMode !== 'view' && (
          <Button
            variant="contained"
            onClick={handleSaveBodyPart}
            disabled={actionLoading}
          >
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );

  const renderBodyPartMenu = () => (
    <Menu
      anchorEl={bodyPartAnchorEl}
      open={Boolean(bodyPartAnchorEl)}
      onClose={handleBodyPartMenuClose}
    >
      <MenuItem onClick={() => handleBodyPartModalOpen('view', selectedBodyPart)}>
        <Visibility sx={{ mr: 1 }} /> View
      </MenuItem>
      <MenuItem onClick={() => handleBodyPartModalOpen('edit', selectedBodyPart)}>
        <Edit sx={{ mr: 1 }} /> Edit
      </MenuItem>
      <MenuItem
        onClick={() => selectedBodyPart && handleDeleteBodyPart(selectedBodyPart._id)}
        sx={{
          color: 'error.main',
          '&:hover': {
            backgroundColor: 'error.light',
          }
        }}
      >
        <Delete sx={{ mr: 1 }} /> Delete
      </MenuItem>
    </Menu>
  );

  if (loading) {
    return (
      <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    // <Container maxWidth="lg" className='p-3'>
    <StyledDashboard>
      <StyledPageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            <Icon
              path={mdiHumanHandsup}
              size={1.5}
              color="#ffffff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>
          <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
            Body Assessments
          </span>
        </div>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2
        }}>
          <Tooltip
            title={
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: '#1e293b',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  pb: 1
                }}>
                  Body Assessments Management
                </Typography>

                <Box sx={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '3px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                    },
                  },
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: 'rgba(255,255,255,0.9)'
                    }}>
                      Key Features:
                    </Typography>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: 'rgba(255,255,255,0.7)',
                      listStyle: 'none'
                    }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Body Parts Management
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Multiple Choice Questions (MCQ)
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Scoring System
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Assessment Categories
                      </li>
                    </ul>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: 'rgba(255,255,255,0.9)'
                    }}>
                      Management Tools:
                    </Typography>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: 'rgba(255,255,255,0.7)',
                      listStyle: 'none'
                    }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Create and edit body parts
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Design MCQ assessments
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Set correct answers and scores
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Manage assessment categories
                      </li>
                    </ul>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: 'rgba(255,255,255,0.9)'
                    }}>
                      Additional Features:
                    </Typography>
                    <ul style={{
                      margin: 0,
                      paddingLeft: '1.2rem',
                      color: 'rgba(255,255,255,0.7)',
                      listStyle: 'none'
                    }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Bulk actions support
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Search and filter options
                      </li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                        Data export capabilities
                      </li>
                    </ul>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{
                  mt: 2,
                  pt: 1,
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.5)',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.75rem'
                }}>
                  Tip: Use the toggle buttons to switch between Body Parts and Assessments views
                </Typography>
              </Box>
            }
            arrow
            placement="bottom-end"
            sx={{
              '& .MuiTooltip-tooltip': {
                bgcolor: 'rgba(15, 23, 42, 0.95)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: 400,
              },
              '& .MuiTooltip-arrow': {
                color: 'rgba(15, 23, 42, 0.95)',
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
          value={activeTab}
          exclusive
          onChange={handleTabChange}
          aria-label="assessment sections"
        >
          <ToggleButton value="bodyParts" aria-label="body parts">
            <Icon path={mdiHumanHandsup} size={0.8} style={{ marginRight: '8px' }} />
            Body Parts
          </ToggleButton>
          <ToggleButton value="bodyAssessments" aria-label="body assessments">
            <Icon path={mdiFormatListBulleted} size={0.8} style={{ marginRight: '8px' }} />
            Body Assessments
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1, mt: 9 }}>
        {/* Body Parts Section */}
        {activeTab === 'bodyParts' && (
          <Box mb={4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="h5" sx={{
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Icon path={mdiHumanHandsup} size={1} color="#3b82f6" />
                Body Parts
              </Typography>
              <StyledButton
                variant="contained"
                startIcon={<Icon path={mdiPlus} size={1} />}
                onClick={handleAddBodyPart}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white'
                }}
              >
                Add Body Part
              </StyledButton>
            </Box>
            <AssessmentGrid>
              {bodyParts.map((bodyPart, index) => (
                <AssessmentCard key={bodyPart._id}>
                  <AssessmentCardHeader>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {bodyPart.partName}
                    </Typography>
                    <ActionButtons className="action-buttons">
                      <IconButton
                        onClick={() => handleBodyPartModalOpen('edit', bodyPart)}
                        sx={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          color: 'white',
                          width: '32px',
                          height: '32px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          }
                        }}
                      >
                        <Icon path={mdiPencil} size={0.7} />
                      </IconButton>
                      <IconButton
                        onClick={(e) => handleDeleteIconClick(e, bodyPart)}
                        sx={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          width: '32px',
                          height: '32px',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          }
                        }}
                      >
                        <Icon path={mdiDelete} size={0.7} />
                      </IconButton>
                    </ActionButtons>
                  </AssessmentCardHeader>
                  <AssessmentCardContent>
                    <Typography variant="body1" color="text.secondary">
                      {bodyPart.description}
                    </Typography>
                  </AssessmentCardContent>
                </AssessmentCard>
              ))}
            </AssessmentGrid>
          </Box>
        )}

        {/* Body Assessments Section */}
        {activeTab === 'bodyAssessments' && (
          <Box mb={4}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5" sx={{
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Icon path={mdiFormatListBulleted} size={1} color="#3b82f6" />
                Body Assessments
              </Typography>
              <StyledButton
                variant="contained"
                startIcon={<Icon path={mdiPlus} size={1} />}
                onClick={() => handleBodyAssessmentModalOpen('add')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white'
                }}
              >
                Add Assessment
              </StyledButton>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <AssessmentGrid>
                {bodyAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment._id}
                    component={motion.div}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AssessmentCardHeader>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                          {assessment.question}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          <Chip
                            icon={<Icon path={mdiFormatListBulleted} size={0.7} />}
                            label={assessment.type.toUpperCase()}
                            size="small"
                            sx={{ backgroundColor: '#e2e8f0' }}
                          />
                          <Chip
                            icon={<Icon path={mdiStar} size={0.7} />}
                            label={`Score: ${assessment.score}`}
                            size="small"
                            sx={{ backgroundColor: '#e2e8f0' }}
                          />
                        </Box>
                      </Box>
                      <ActionButtons className="action-buttons">
                        <IconButton
                          onClick={() => handleBodyAssessmentModalOpen('edit', assessment)}
                          sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
                          }}
                        >
                          <Icon path={mdiPencil} size={0.7} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteBodyAssessment(assessment._id)}
                          sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            '&:hover': { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }
                          }}
                        >
                          <Icon path={mdiDelete} size={0.7} />
                        </IconButton>
                      </ActionButtons>
                    </AssessmentCardHeader>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                        MCQ Options:
                      </Typography>
                      {assessment.mcqOptions.map((option, index) => (
                        <McqOptionChip
                          key={index}
                          isCorrect={option.text === assessment.answer}
                        >
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {option.text}
                          </Typography>
                          {option.text === assessment.answer && (
                            <Icon path={mdiCheckCircle} size={0.7} color="#2e7d32" />
                          )}
                        </McqOptionChip>
                      ))}
                    </Box>
                  </AssessmentCard>
                ))}
              </AssessmentGrid>
            )}
          </Box>
        )}
      </Box>

      {/* Keep existing modals and menus */}
      {renderBodyPartModal()}
      {renderViewBodyAssessmentModal()}
      {renderEditBodyAssessmentModal()}

      {/* ... rest of the existing code ... */}
      <StyledDialog
        open={addBodyAssessmentModal}
        onClose={handleBodyAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <div className="icon-wrapper">
            <Icon path={mdiFormatListBulleted} size={1.2} color="#ffffff" />
          </div>
          <span className="title-text">Add New Body Assessment</span>
        </StyledDialogTitle>
        <StyledDialogContent>
          <div className="form-section">
            <div className="section-title">Basic Information</div>
            <TextField
              fullWidth
              label="Question"
              name="question"
              value={newBodyAssessment.question}
              onChange={handleBodyAssessmentInputChange}
            />
            <TextField
              fullWidth
              label="Score"
              name="score"
              type="number"
              value={newBodyAssessment.score}
              onChange={handleBodyAssessmentInputChange}
            />
            <TextField
              fullWidth
              select
              label="Body Part"
              name="part"
              value={newBodyAssessment.part}
              onChange={handleBodyAssessmentInputChange}
            >
              {bodyParts.map((part) => (
                <MenuItem key={part._id} value={part._id}>
                  {part.partName}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="form-section">
            <div className="section-title">MCQ Options</div>
            {newBodyAssessment.mcqOptions.map((option, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  backgroundColor: '#f8fafc',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleMcqOptionChange(index, 'text', e.target.value)}
                />
                <TextField
                  fullWidth
                  select
                  label="Mood"
                  value={option.color}
                  onChange={(e) => handleMcqOptionChange(index, 'color', e.target.value)}
                >
                  {moods.map((mood) => (
                    <MenuItem key={mood._id} value={mood._id}>
                      {mood.mood}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={(e) => handleMcqOptionChange(index, 'isCorrect', e.target.checked)}
                      sx={{
                        color: '#3b82f6',
                        '&.Mui-checked': {
                          color: '#3b82f6',
                        },
                      }}
                    />
                  }
                  label="Correct"
                />
                <IconButton
                  onClick={() => handleRemoveOption(index)}
                  sx={{
                    color: '#ef4444',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={handleAddOption}
              startIcon={<Add />}
              variant="outlined"
              sx={{
                mt: 2,
                borderColor: '#3b82f6',
                color: '#3b82f6',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              Add Option
            </Button>
          </div>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            variant="outlined"
            onClick={handleBodyAssessmentModalClose}
            sx={{
              color: '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                borderColor: '#cbd5e1',
                background: '#f8fafc'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateBodyAssessment}
            disabled={actionLoading}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }
            }}
          >
            {actionLoading ? 'Creating...' : 'Create Assessment'}
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      {/* Body Part Menu */}
      {renderBodyPartMenu()}

      <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ToastContainer position="top-right" autoClose={3000} />
    </StyledDashboard>

  );
};

export default BodyAssessments;
