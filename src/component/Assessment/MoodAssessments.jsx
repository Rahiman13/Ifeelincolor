import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button,
  IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Backdrop, CircularProgress, Collapse, Divider, Select,
  Checkbox, FormControlLabel, ToggleButton, ToggleButtonGroup, Chip, LinearProgress, Tooltip, Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, MoreVert, Visibility, Edit, Delete, ExpandMore, ExpandLess, Assessment, DeleteOutline, Upload } from '@mui/icons-material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Icon from '@mdi/react';
import {
  mdiEmoticon,
  mdiAlertCircleOutline,  // Add this import
  mdiClipboardText,
  mdiStar,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiFormatListBulleted,
  mdiClockOutline,
  mdiImage,
  mdiCloudUpload
} from '@mdi/js';
import { ChromePicker } from 'react-color';
import Swal from 'sweetalert2';
import { lighten, darken } from '@mui/material/styles';
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
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

const GradientCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(145deg, ${color || '#ffffff'}, ${lightenColor(color) || '#f3f4f6'})`,
  borderRadius: '24px',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
  }
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

const FancyCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  borderRadius: 15,
  transition: '0.3s',
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
  },
}));

const FancyCardContent = styled(CardContent)({
  padding: '1.5rem',
});

const FancyTypography = styled(Typography)({
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#ffffff',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
});

const FancyAssessmentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
  borderRadius: 16,
  transition: 'all 0.3s',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const Tag = styled(Box)(({ theme, color }) => ({
  background: color,
  color: theme.palette.getContrastText(color),
  padding: '4px 8px',
  borderRadius: 12,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  display: 'inline-block',
  marginRight: theme.spacing(1),
}));

const MoodAssessmentCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  borderRadius: 16,
  transition: 'all 0.3s',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  },
}));

const MoodAssessmentButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(135deg, #FF8E53 0%, #FF6B6B 100%)',
  },
}));

const MoodAssessmentDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
}));

const MoodAssessmentDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
  color: 'white',
  fontWeight: 'bold',
}));

function lightenColor(color) {
  if (!color) return '#ffffff';
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r},${g},${b},0.8)`;
}

function getContrastColor(hexColor) {
  // If hexColor is undefined or null, return black
  if (!hexColor) return '#000000';

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Rename these styled components to avoid conflicts
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

const AssessmentGrid = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
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

// Add this near the top of your file, after the imports
const styles = `
  .swal2-custom-popup {
    font-family: 'Poppins', sans-serif;
    border-radius: 24px;
    padding: 2rem;
  }

  .swal2-custom-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
  }

  .swal2-custom-content {
    font-size: 1rem;
    color: #64748b;
  }

  .swal2-custom-confirm {
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    text-transform: none;
    font-size: 0.95rem;
  }

  .swal2-custom-cancel {
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    text-transform: none;
    font-size: 0.95rem;
    color: #6b7280;
    background: #f1f5f9;
  }
`;

export default function MoodAssessments() {
  const [moods, setMoods] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMoodModal, setOpenMoodModal] = useState(false);
  const [openAssessmentModal, setOpenAssessmentModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [moodSectionExpanded, setMoodSectionExpanded] = useState(true);
  const [moodLevelAssessmentSectionExpanded, setMoodLevelAssessmentSectionExpanded] = useState(true);
  const [moodAssessmentSectionExpanded, setMoodAssessmentSectionExpanded] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [newAssessment, setNewAssessment] = useState({
    question: '',
    answer: [{ option: '', moodLevel: 'low' }],
    type: ''
  });
  const [openMoodLevelAssessmentModal, setOpenMoodLevelAssessmentModal] = useState(false);
  const [selectedMoodLevelAssessment, setSelectedMoodLevelAssessment] = useState(null);
  const [openAddMoodLevelAssessmentModal, setOpenAddMoodLevelAssessmentModal] = useState(false);
  const [newMoodLevelAssessment, setNewMoodLevelAssessment] = useState({
    question: '',
    answer: [
      { option: '', moodLevel: 'low' },
      { option: '', moodLevel: 'medium' },
      { option: '', moodLevel: 'extreme' }
    ],
    type: ''
  });
  const [moodAssessments, setMoodAssessments] = useState([]);
  const [selectedMoodAssessment, setSelectedMoodAssessment] = useState({
    question: '',
    type: '',
    score: 0,
    category: '',
    answer: '',
    mcqOptions: [],
    media: null,
    video: null
  });
  const [openMoodAssessmentModal, setOpenMoodAssessmentModal] = useState(false);
  const [openCreateMoodAssessmentModal, setOpenCreateMoodAssessmentModal] = useState(false);
  const [newMoodAssessment, setNewMoodAssessment] = useState({
    question: '',
    type: 'mcq',
    score: 0,
    category: '',
    answer: '',
    mcqOptions: [{ text: '', isCorrect: false }],
    video: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [moodAssessmentAnchorEl, setMoodAssessmentAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState('moods'); // 'moods', 'moodLevels', 'moodAssessments'

  useEffect(() => {
    fetchMoods();
    fetchMoodLevelAssessments();
    fetchMoodAssessments();
  }, []);

  useEffect(() => {
    // Add custom styles for SweetAlert
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      if (selectedFile) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

  const fetchMoods = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/admin/moods`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setMoods(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching moods:', error);
        toast.error('Error fetching moods');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchMoodLevelAssessments = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/sub`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setAssessments(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching mood level assessments:', error);
        toast.error('Error fetching mood level assessments');
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchMoodAssessments = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/api/test`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setMoodAssessments(response.data.body);
        }
      } catch (error) {
        console.error('Error fetching mood assessments:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMoodMenuOpen = (event, mood) => {
    setAnchorEl(event.currentTarget);
    setSelectedMood(mood);
  };

  const handleAssessmentMenuOpen = (event, assessment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssessment(assessment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoodModalOpen = (mode) => {
    setModalMode(mode);
    setOpenMoodModal(true);
    handleMenuClose();
  };

  const handleAssessmentModalOpen = (mode) => {
    setModalMode(mode);
    setOpenAssessmentModal(true);
    handleMenuClose();
  };

  const handleMoodModalClose = () => {
    setOpenMoodModal(false);
    setSelectedMood(null);
    setShowColorPicker(false);
  };

  const handleAssessmentModalClose = () => {
    setOpenAssessmentModal(false);
    setSelectedAssessment(null);
  };

  const handleAddMood = () => {
    setSelectedMood({ mood: '', description: '', hexColor: '#ffffff' });
    handleMoodModalOpen('add');
  };

  const handleColorChange = (color) => {
    setSelectedMood({ ...selectedMood, hexColor: color.hex });
  };

  const handleSaveMood = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        let response;
        if (modalMode === 'add') {
          response = await axios.post(`${BaseUrl}/api/admin/add-mood`, selectedMood, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else if (modalMode === 'edit') {
          response = await axios.put(`${BaseUrl}/api/admin/moods/${selectedMood._id}`, selectedMood, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (response.data.status === 'success') {
          fetchMoods();
          handleMoodModalClose();
          Swal.fire({
            icon: 'success',
            title: `Mood ${modalMode === 'add' ? 'added' : 'updated'} successfully`,
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} mood:`, error);
        toast.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} mood`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteMood = async (mood) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && mood) {
      try {
        const result = await Swal.fire({
          title: 'Delete Mood',
          text: `Are you sure you want to delete "${mood.mood}"?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc2626',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          customClass: {
            popup: 'swal2-custom-popup',
            title: 'swal2-custom-title',
            content: 'swal2-custom-content',
            confirmButton: 'swal2-custom-confirm',
            cancelButton: 'swal2-custom-cancel'
          }
        });

        if (result.isConfirmed) {
          try {
            setActionLoading(true); // Start loading
            const response = await axios.delete(
              `${BaseUrl}/api/admin/moods/${mood._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (response.data.status === 'success') {
              await Swal.fire({
                title: 'Deleted!',
                text: `${mood.mood} has been deleted successfully.`,
                icon: 'success',
                confirmButtonColor: '#3b82f6',
                customClass: {
                  popup: 'swal2-custom-popup',
                  title: 'swal2-custom-title',
                  content: 'swal2-custom-content',
                  confirmButton: 'swal2-custom-confirm'
                }
              });
              await fetchMoods(); // Fetch updated moods list
            }
          } catch (error) {
            console.error('Error deleting mood:', error);
            Swal.fire({
              title: 'Error!',
              text: error.response?.data?.message || 'Failed to delete mood',
              icon: 'error',
              confirmButtonColor: '#3b82f6',
              customClass: {
                popup: 'swal2-custom-popup',
                title: 'swal2-custom-title',
                content: 'swal2-custom-content',
                confirmButton: 'swal2-custom-confirm'
              }
            });
          } finally {
            setActionLoading(false); // Stop loading regardless of success or failure
          }
        }
      } catch (error) {
        console.error('Error with SweetAlert:', error);
        setActionLoading(false); // Ensure loading is stopped if SweetAlert fails
      }
    }
  };

  const toggleSection = (section) => {
    if (section === 'moods') {
      setMoodSectionExpanded(!moodSectionExpanded);
    } else if (section === 'moodLevelAssessments') {
      setMoodLevelAssessmentSectionExpanded(!moodLevelAssessmentSectionExpanded);
    } else if (section === 'moodAssessments') {
      setMoodAssessmentSectionExpanded(!moodAssessmentSectionExpanded);
    }
  };

  const handleAddAssessment = () => {
    setSelectedMoodLevelAssessment({
      question: '',
      answer: [
        { option: '', moodLevel: 'low' },
        { option: '', moodLevel: 'medium' },
        { option: '', moodLevel: 'extreme' }
      ],
      type: ''
    });
    setModalMode('add');
    setOpenMoodLevelAssessmentModal(true);
  };

  const handleAssessmentChange = (e) => {
    setNewAssessment({ ...newAssessment, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedAnswers = [...newAssessment.answer];
    updatedAnswers[index][field] = value;
    setNewAssessment({ ...newAssessment, answer: updatedAnswers });
  };

  const addOption = () => {
    setNewAssessment({
      ...newAssessment,
      answer: [...newAssessment.answer, { option: '', moodLevel: 'low' }]
    });
  };

  const removeOption = (index) => {
    const updatedAnswers = newAssessment.answer.filter((_, i) => i !== index);
    setNewAssessment({ ...newAssessment, answer: updatedAnswers });
  };

  const handleSaveAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        // Validate required fields
        if (!selectedMoodLevelAssessment.question || !selectedMoodLevelAssessment.type) {
          toast.error('Please fill in all required fields');
          return;
        }

        // Validate answers
        if (!selectedMoodLevelAssessment.answer.every(ans => ans.option)) {
          toast.error('Please fill in all answer options');
          return;
        }

        const assessmentData = {
          question: selectedMoodLevelAssessment.question,
          type: selectedMoodLevelAssessment.type,
          answer: selectedMoodLevelAssessment.answer
        };

        let response;
        if (modalMode === 'edit' && selectedMoodLevelAssessment._id) {
          response = await axios.put(
            `${BaseUrl}/api/sub/${selectedMoodLevelAssessment._id}`,
            assessmentData,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        } else {
          response = await axios.post(
            `${BaseUrl}/api/sub`,
            assessmentData,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        }

        if (response.data.status === 'success') {
          await fetchMoodLevelAssessments();
          handleMoodLevelAssessmentModalClose();
          toast.success(`Assessment ${modalMode === 'edit' ? 'updated' : 'created'} successfully`);
        }
      } catch (error) {
        console.error('Error saving assessment:', error);
        toast.error(error.response?.data?.message || `Error ${modalMode === 'edit' ? 'updating' : 'creating'} assessment`);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (adminPortal === 'true' && token && selectedAssessment) {
        const response = await axios.put(`${BaseUrl}/api/sub/${selectedAssessment._id}`, selectedAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          setAssessments(prevAssessments =>
            prevAssessments.map(a => a._id === selectedAssessment._id ? response.data.body : a)
          );
          toast.success('Assessment updated successfully');
          handleAssessmentModalClose();
        }
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error('Failed to update assessment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedAssessment) {
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
          const response = await axios.delete(`${BaseUrl}/api/sub/${selectedAssessment._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.status === 'success') {
            setAssessments(prevAssessments => prevAssessments.filter(a => a._id !== selectedAssessment._id));
            handleMenuClose();
            Swal.fire(
              'Deleted!',
              'The assessment has been deleted.',
              'success'
            );
          }
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
        toast.error('Error deleting assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'question') {
      setSelectedAssessment({ ...selectedAssessment, question: value });
    } else if (name.startsWith('option') || name.startsWith('moodLevel')) {
      const updatedAnswers = [...selectedAssessment.answer];
      updatedAnswers[index][name.split('-')[0]] = value;
      setSelectedAssessment({ ...selectedAssessment, answer: updatedAnswers });
    }
  };

  const handleMoodLevelAssessmentMenuOpen = (event, assessment) => {
    setAnchorEl(event.currentTarget);
    setSelectedMoodLevelAssessment(assessment);
  };

  const handleMoodLevelAssessmentModalOpen = (mode) => {
    setModalMode(mode);
    setOpenMoodLevelAssessmentModal(true);
    handleMenuClose();
  };

  const handleMoodLevelAssessmentModalClose = () => {
    setOpenMoodLevelAssessmentModal(false);
    setSelectedMoodLevelAssessment(null);
  };

  const handleSaveMoodLevelAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token && selectedMoodLevelAssessment) {
      try {
        setActionLoading(true);
        const response = await axios.put(`${BaseUrl}/api/sub/${selectedMoodLevelAssessment._id}`, selectedMoodLevelAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          fetchMoodLevelAssessments();
          handleMoodLevelAssessmentModalClose();
          Swal.fire({
            icon: 'success',
            title: 'Mood level assessment updated successfully',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error('Error updating mood level assessment:', error);
        toast.error('Error updating mood level assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteMoodLevelAssessment = async (assessmentId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        const result = await Swal.fire({
          title: 'Delete Assessment',
          text: 'Are you sure you want to delete this assessment?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#dc2626',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel',
          customClass: {
            popup: 'swal2-custom-popup',
            title: 'swal2-custom-title',
            content: 'swal2-custom-content',
            confirmButton: 'swal2-custom-confirm',
            cancelButton: 'swal2-custom-cancel'
          }
        });

        if (result.isConfirmed) {
          setActionLoading(true);
          const response = await axios.delete(
            `${BaseUrl}/api/sub/${assessmentId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (response.data.status === 'success') {
            await fetchMoodLevelAssessments();
            toast.success('Assessment deleted successfully');
            handleMenuClose();
          }
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
        toast.error('Error deleting assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleAddMoodLevelAssessmentModalOpen = () => {
    setOpenAddMoodLevelAssessmentModal(true);
  };

  const handleAddMoodLevelAssessmentModalClose = () => {
    setOpenAddMoodLevelAssessmentModal(false);
    setNewMoodLevelAssessment({
      question: '',
      answer: [
        { option: '', moodLevel: 'low' },
        { option: '', moodLevel: 'medium' },
        { option: '', moodLevel: 'extreme' }
      ],
      type: ''
    });
  };

  const handleNewMoodLevelAssessmentChange = (e) => {
    setNewMoodLevelAssessment({ ...newMoodLevelAssessment, [e.target.name]: e.target.value });
  };

  const handleNewMoodLevelAssessmentOptionChange = (index, field, value) => {
    const updatedAnswers = [...newMoodLevelAssessment.answer];
    updatedAnswers[index][field] = value;
    setNewMoodLevelAssessment({ ...newMoodLevelAssessment, answer: updatedAnswers });
  };

  const handleAddNewMoodLevelAssessmentOption = () => {
    setNewMoodLevelAssessment({
      ...newMoodLevelAssessment,
      answer: [...newMoodLevelAssessment.answer, { option: '', moodLevel: 'low' }]
    });
  };

  const handleRemoveNewMoodLevelAssessmentOption = (index) => {
    const updatedAnswers = newMoodLevelAssessment.answer.filter((_, i) => i !== index);
    setNewMoodLevelAssessment({ ...newMoodLevelAssessment, answer: updatedAnswers });
  };

  const handleSaveNewMoodLevelAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);
        const response = await axios.post(`${BaseUrl}/api/sub`, newMoodLevelAssessment, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.status === 'success') {
          fetchMoodLevelAssessments();
          handleAddMoodLevelAssessmentModalClose();
          Swal.fire({
            icon: 'success',
            title: 'Mood level assessment created successfully',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (error) {
        console.error('Error creating mood level assessment:', error);
        toast.error('Error creating mood level assessment');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleMoodAssessmentModalOpen = async (mode, assessment) => {
    try {
      setModalMode(mode);
      if (mode === 'edit' && assessment) {
        const token = sessionStorage.getItem('token');
        const adminPortal = sessionStorage.getItem('adminPortal');

        if (adminPortal === 'true' && token) {
          setActionLoading(true);

          const response = await axios.get(
            `${BaseUrl}/api/test/${assessment._id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (response.data.status === 'success') {
            const assessmentData = response.data.body;

            // Set the state based on assessment type
            if (assessmentData.type === 'mcq') {
              setSelectedMoodAssessment({
                _id: assessmentData._id,
                question: assessmentData.question,
                type: 'mcq',
                score: assessmentData.score,
                category: assessmentData.category._id || assessmentData.category,
                answer: assessmentData.answer,
                mcqOptions: assessmentData.mcqOptions.map(opt => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  _id: opt._id
                })),
                media: assessmentData.media,
                video: assessmentData.video
              });
            } else {
              // For blanks type
              setSelectedMoodAssessment({
                _id: assessmentData._id,
                question: assessmentData.question,
                type: 'blanks',
                score: assessmentData.score,
                category: assessmentData.category._id || assessmentData.category,
                answer: assessmentData.answer,
                mcqOptions: [],
                media: assessmentData.media,
                video: assessmentData.video

              });
            }
          }
        }
      }
      setOpenMoodAssessmentModal(true);
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      toast.error('Error loading assessment details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoodAssessmentModalClose = () => {
    setOpenMoodAssessmentModal(false);
    setSelectedMoodAssessment(null);
    setModalMode('');
  };

  const handleCreateMoodAssessmentModalOpen = () => {
    setOpenCreateMoodAssessmentModal(true);
  };

  const handleCreateMoodAssessmentModalClose = () => {
    setOpenCreateMoodAssessmentModal(false);
    setNewMoodAssessment({
      question: '',
      type: 'mcq',
      score: 0,
      category: '',
      answer: '',
      mcqOptions: [{ text: '', isCorrect: false }],
      video: ''
    });
  };

  const handleMoodAssessmentChange = (e) => {
    const { name, value } = e.target;

    if (name === 'type') {
      // Reset relevant fields when changing type
      setSelectedMoodAssessment(prev => ({
        ...prev,
        [name]: value,
        answer: '', // Reset answer
        mcqOptions: value === 'mcq' ? [{ text: '', isCorrect: false }] : [], // Initialize MCQ options if needed
        media: value === 'mcq' ? null : prev.media, // Clear media if switching to MCQ
        video: value === 'mcq' ? null : prev.video // Clear media if switching to MCQ
      }));
    } else {
      setSelectedMoodAssessment(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewMoodAssessmentChange = (e) => {
    const { name, value } = e.target;
    setNewMoodAssessment(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'blanks' ? { mcqOptions: [] } : {}),
      ...(name === 'type' && value === 'mcq' ? { answer: '' } : {})
    }));
  };

  const handleNewMoodAssessmentOptionChange = (index, field, value) => {
    setNewMoodAssessment(prev => {
      const updatedOptions = [...prev.mcqOptions];

      if (field === 'isCorrect' && value === true) {
        updatedOptions.forEach((opt, i) => {
          if (i !== index) opt.isCorrect = false;
        });
      }

      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value
      };

      if (field === 'isCorrect' && value === true) {
        return {
          ...prev,
          mcqOptions: updatedOptions,
          answer: updatedOptions[index].text
        };
      }

      return {
        ...prev,
        mcqOptions: updatedOptions
      };
    });
  };

  const handleAddNewMoodAssessmentOption = () => {
    setNewMoodAssessment(prev => ({
      ...prev,
      mcqOptions: [
        ...prev.mcqOptions,
        { text: '', isCorrect: false }
      ]
    }));
  };

  const handleRemoveNewMoodAssessmentOption = (index) => {
    setNewMoodAssessment(prev => ({
      ...prev,
      mcqOptions: prev.mcqOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveNewMoodAssessment = async () => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
      try {
        setActionLoading(true);

        // Validate required fields
        if (!newMoodAssessment.question || !newMoodAssessment.type || !newMoodAssessment.category) {
          toast.error('Please fill in all required fields 🚫', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        // Prepare the request data based on assessment type
        const requestData = {
          question: newMoodAssessment.question,
          type: newMoodAssessment.type,
          score: parseInt(newMoodAssessment.score),
          category: newMoodAssessment.category,
          mcqOptions: [],
          video: newMoodAssessment.video
        };

        if (newMoodAssessment.type === 'mcq') {
          // Validate MCQ options
          if (!newMoodAssessment.mcqOptions.length || !newMoodAssessment.mcqOptions.some(opt => opt.isCorrect)) {
            toast.error('Please add at least one option and mark a correct answer 🚫', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            return;
          }

          // Set MCQ specific data
          const correctOption = newMoodAssessment.mcqOptions.find(opt => opt.isCorrect);
          requestData.answer = correctOption.text;
          requestData.mcqOptions = newMoodAssessment.mcqOptions;
        } else {
          // Set blanks specific data
          requestData.answer = newMoodAssessment.answer;
        }

        // Handle file upload if present
        let finalData = requestData;
        if (selectedFile) {
          const formData = new FormData();
          Object.keys(requestData).forEach(key => {
            if (key === 'mcqOptions') {
              formData.append(key, JSON.stringify(requestData[key]));
            } else {
              formData.append(key, requestData[key]);
            }
          });
          formData.append('media', selectedFile);
          finalData = formData;
        }

        const response = await axios({
          method: 'POST',
          url: `${BaseUrl}/api/test/create`,
          data: finalData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': selectedFile ? 'multipart/form-data' : 'application/json'
          }
        });

        if (response.data.status === 'success') {
          toast.success('Assessment created successfully! 🎉', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          await fetchMoodAssessments();
          handleCreateMoodAssessmentModalClose();
        }
      } catch (error) {
        console.error('Error creating assessment:', error);
        toast.error(error.response?.data?.message || 'Failed to create assessment 😟', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEditMoodAssessment = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const adminPortal = sessionStorage.getItem('adminPortal');

      if (adminPortal === 'true' && token) {
        setActionLoading(true);

        // Validate required fields
        if (!selectedMoodAssessment.question || !selectedMoodAssessment.type) {
          toast.error('Please fill in all required fields 🚫', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        // Validate MCQ options if type is MCQ
        if (selectedMoodAssessment.type === 'mcq') {
          if (!selectedMoodAssessment.mcqOptions.length || !selectedMoodAssessment.mcqOptions.some(opt => opt.isCorrect)) {
            toast.error('Please add at least one option and mark a correct answer 🚫', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            return;
          }
        }

        // Create FormData if there's a file to upload
        let finalData;
        if (selectedFile) {
          const formData = new FormData();
          formData.append('question', selectedMoodAssessment.question);
          formData.append('type', selectedMoodAssessment.type);
          formData.append('score', selectedMoodAssessment.score);
          formData.append('category', selectedMoodAssessment.category);
          formData.append('answer', selectedMoodAssessment.answer);

          if (selectedMoodAssessment.type === 'mcq') {
            formData.append('mcqOptions', JSON.stringify(selectedMoodAssessment.mcqOptions));
          }

          formData.append('media', selectedFile);
          finalData = formData;
        } else {
          finalData = {
            ...selectedMoodAssessment,
            score: parseInt(selectedMoodAssessment.score)
          };
        }

        const response = await axios({
          method: 'PUT',
          url: `${BaseUrl}/api/test/${selectedMoodAssessment._id}`,
          data: finalData,
          headers: {
            Authorization: `Bearer ${token}`,
            ...(selectedFile
              ? { 'Content-Type': 'multipart/form-data' }
              : { 'Content-Type': 'application/json' }
            )
          }
        });
        console.log(response.data.status)

        if (response.data.status === 'success') {
          toast.success('Assessment updated successfully! 🔄', {
            position: "top-right",
            autoClose: 3000,
            // hideProgressBar: false,
            // closeOnClick: true,
            // pauseOnHover: true,
            // draggable: true,
          });
          await fetchMoodAssessments();
          handleMoodAssessmentModalClose();
        }
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error(error.response?.data?.message || 'Failed to update assessment 😟', {
        position: "top-right",
        autoClose: 3000,
        // hideProgressBar: false,
        // closeOnClick: true,
        // pauseOnHover: true,
        // draggable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMoodAssessment = async (assessmentId) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (adminPortal === 'true' && token) {
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
            `${BaseUrl}/api/test/${assessmentId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (response.data.status === 'success') {
            setMoodAssessments(prevAssessments =>
              prevAssessments.filter(assessment => assessment._id !== assessmentId)
            );
            toast.success('Assessment deleted successfully! 🗑️', {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }
      } catch (error) {
        console.error('Error deleting assessment:', error);
        toast.error(error.response?.data?.message || 'Failed to delete assessment 😟', {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderMediaUpload = (isEditMode = false) => {
    const assessment = isEditMode ? selectedMoodAssessment : newMoodAssessment;

    if (assessment.type !== 'blanks') {
      return null;
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Media Upload (Optional)
        </Typography>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
          accept="image/*,video/*"
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current.click()}
          startIcon={<Upload />}
          sx={{ mt: 2, mb: 2 }}
        >
          {selectedFile ? 'Change Media File' : 'Upload Media File'}
        </Button>

        {(selectedFile || assessment.media) && (
          <Box display="flex" alignItems="center" mt={1}>
            <Typography variant="body2" mr={2}>
              {selectedFile ? selectedFile.name : 'Current media file'}
            </Typography>
            <IconButton onClick={handleDeleteFile} size="small">
              <Delete />
            </IconButton>
          </Box>
        )}

        {!selectedFile && assessment.media && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>Current Media:</Typography>
            <img
              src={assessment.media}
              alt="Assessment media"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
        {selectedFile && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>Preview:</Typography>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Media preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  const handleMoodAssessmentMenuOpen = (event, assessment) => {
    setMoodAssessmentAnchorEl(event.currentTarget);
    setSelectedMoodAssessment(assessment);
  };

  const handleMoodAssessmentMenuClose = () => {
    setMoodAssessmentAnchorEl(null);
    setSelectedMoodAssessment(null);
  };

  const handleTabChange = (event, newValue) => {
    if (newValue !== null) {
      setActiveTab(newValue);
    }
  };

  const handleEditMoodLevelAssessment = (assessment) => {
    setSelectedMoodLevelAssessment(assessment);
    setModalMode('edit');
    setOpenMoodLevelAssessmentModal(true);
    handleMenuClose();
  };

  const handleMcqOptionChange = (index, field, value) => {
    const updatedOptions = [...selectedMoodAssessment.mcqOptions];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };

    // If marking this option as correct, unmark others and set it as the answer
    if (field === 'isCorrect' && value === true) {
      updatedOptions.forEach((opt, i) => {
        if (i !== index) {
          opt.isCorrect = false;
        }
      });

      setSelectedMoodAssessment({
        ...selectedMoodAssessment,
        mcqOptions: updatedOptions,
        answer: updatedOptions[index].text // Set the correct option as the answer
      });
    } else {
      setSelectedMoodAssessment({
        ...selectedMoodAssessment,
        mcqOptions: updatedOptions
      });
    }
  };

  const handleAddMcqOption = () => {
    setSelectedMoodAssessment({
      ...selectedMoodAssessment,
      mcqOptions: [
        ...selectedMoodAssessment.mcqOptions,
        { text: '', isCorrect: false }
      ]
    });
  };

  const handleRemoveMcqOption = (index) => {
    const updatedOptions = selectedMoodAssessment.mcqOptions.filter((_, i) => i !== index);
    setSelectedMoodAssessment({
      ...selectedMoodAssessment,
      mcqOptions: updatedOptions
    });
  };

  const renderEditMoodAssessmentForm = () => {
    return (
      <DialogContent>
        <TextField
          fullWidth
          label="Question"
          name="question"
          value={selectedMoodAssessment?.question || ''}
          onChange={handleMoodAssessmentChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Answer"
          name="answer"
          value={selectedMoodAssessment?.answer || ''}
          onChange={handleMoodAssessmentChange}
          margin="normal"
        />

        <TextField
          fullWidth
          type="number"
          label="Score"
          name="score"
          value={selectedMoodAssessment?.score || ''}
          onChange={handleMoodAssessmentChange}
          margin="normal"
        />

        {/* Only show media upload for blanks type */}
        {selectedMoodAssessment?.type === 'blanks' && (
          <Box sx={{ mt: 3 }}>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
              accept="image/*,video/*"
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              startIcon={<Upload />}
            >
              {selectedFile ? 'Change Media File' : 'Upload Media File'}
            </Button>

            {/* Show current media preview */}
            {selectedMoodAssessment.media && !selectedFile && (
              <Box mt={2}>
                <img
                  src={selectedMoodAssessment.media}
                  alt="Current media"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}

            {/* Show new file preview */}
            {selectedFile && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="New media"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}
            <Box>
              <TextField
                fullWidth
                type="text"
                label="video link"
                name="video"
                value={selectedMoodAssessment?.video || ''}
                onChange={handleMoodAssessmentChange}
                margin="normal"
              />
            </Box>

          </Box>

        )}
      </DialogContent>
    );
  };

  const renderEditModal = () => {
    if (!selectedMoodAssessment) return null;

    return (
      <StyledDialog
        open={openMoodAssessmentModal}
        onClose={handleMoodAssessmentModalClose}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <div className="icon-wrapper">
            <Icon path={mdiFormatListBulleted} size={1.2} color="#ffffff" />
          </div>
          <span className="title-text">Edit Mood Assessment</span>
        </StyledDialogTitle>

        <StyledDialogContent>
          <div className="form-section">
            <Typography className="section-title" gutterBottom>
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Question"
              name="question"
              value={selectedMoodAssessment.question}
              onChange={handleMoodAssessmentChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Score"
              name="score"
              value={selectedMoodAssessment.score}
              onChange={handleMoodAssessmentChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={selectedMoodAssessment.category}
              onChange={handleMoodAssessmentChange}
              sx={{ mb: 2 }}
            >
              {moods.map((mood) => (
                <MenuItem key={mood._id} value={mood._id}>
                  {mood.mood}
                </MenuItem>
              ))}
            </TextField>

            {selectedMoodAssessment.type === 'mcq' && (
              <div className="form-section">
                <Typography className="section-title" gutterBottom>
                  MCQ Options
                </Typography>
                {selectedMoodAssessment.mcqOptions.map((option, index) => (
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
                      onClick={() => handleRemoveMcqOption(index)}
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
                  onClick={handleAddMcqOption}
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
            )}
          </div>
        </StyledDialogContent>

        <StyledDialogActions>
          <Button
            variant="outlined"
            onClick={handleMoodAssessmentModalClose}
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
            onClick={handleEditMoodAssessment}
            disabled={actionLoading}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }
            }}
          >
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    );
  };

  if (loading) {
    return (
      <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <StyledDashboard>
        <StyledPageHeader>
          <div className="page-title">
            <div className="page-title-icon">
              <Icon
                path={mdiEmoticon}
                size={1.5}
                color="#ffffff"
                style={{
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </div>
            <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
              Mood Assessments
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
                <Box sx={{
                  p: 1,
                  maxHeight: '400px', // Set maximum height
                  overflowY: 'auto', // Enable vertical scrolling
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255,255,255,0.4)',
                    borderRadius: '4px',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.5)',
                    },
                  },
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Mood Assessments Management
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    This comprehensive dashboard allows you to manage all aspects of mood assessments in the system:
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    1. Moods Section:
                  </Typography>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: '1.2rem' }}>
                    <li>Create and manage different mood categories</li>
                    <li>Customize mood colors and descriptions</li>
                    <li>Delete or edit existing moods</li>
                    <li>Associate moods with assessment questions</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    2. Mood Levels Section:
                  </Typography>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: '1.2rem' }}>
                    <li>Define different levels of mood intensity (low, medium, extreme)</li>
                    <li>Create assessment questions for each mood level</li>
                    <li>Manage multiple-choice options for assessments</li>
                    <li>Set scoring criteria for different responses</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    3. Mood Assessments Section:
                  </Typography>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: '1.2rem' }}>
                    <li>Create comprehensive mood assessment questionnaires</li>
                    <li>Choose between MCQ and fill-in-the-blank formats</li>
                    <li>Add media attachments to questions</li>
                    <li>Set scores and categories for each assessment</li>
                    <li>Manage correct answers and options</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Key Features:
                  </Typography>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: '1.2rem' }}>
                    <li>Real-time updates and modifications</li>
                    <li>Bulk management capabilities</li>
                    <li>Media upload support</li>
                    <li>Advanced scoring system</li>
                    <li>Category-based organization</li>
                  </ul>

                  <Typography variant="body2" sx={{
                    mt: 1,
                    fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.7)',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    paddingTop: '8px'
                  }}>
                    Tip: Use the toggle buttons above to switch between different sections of the assessment management system
                  </Typography>
                </Box>
              }
              arrow
              placement="bottom-end"
              sx={{
                '& .MuiTooltip-tooltip': {
                  bgcolor: 'rgba(23, 25, 35, 0.95)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxWidth: 400,
                },
                '& .MuiTooltip-arrow': {
                  color: 'rgba(23, 25, 35, 0.95)',
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
            <ToggleButton value="moods" aria-label="moods">
              <Icon path={mdiEmoticon} size={0.8} style={{ marginRight: '8px' }} />
              Moods
            </ToggleButton>
            <ToggleButton value="moodLevels" aria-label="mood levels">
              <Icon path={mdiClipboardText} size={0.8} style={{ marginRight: '8px' }} />
              Mood Levels
            </ToggleButton>
            <ToggleButton value="moodAssessments" aria-label="mood assessments">
              <Icon path={mdiFormatListBulleted} size={0.8} style={{ marginRight: '8px' }} />
              Mood Assessments
            </ToggleButton>
          </StyledToggleButtonGroup>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, mt: 9 }}>
          {activeTab === 'moods' && (
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
                  <Icon path={mdiEmoticon} size={1} color="#3b82f6" />
                  Moods
                </Typography>
                <StyledButton
                  variant="contained"
                  startIcon={<Icon path={mdiPlus} size={1} />}
                  onClick={handleAddMood}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white'
                  }}
                >
                  Add Mood
                </StyledButton>
              </Box>

              <AssessmentGrid>
                {moods.map((mood) => (
                  <AssessmentCard key={mood._id}>
                    <AssessmentCardHeader>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            background: mood.hexColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon path={mdiEmoticon} size={1} color={getContrastColor(mood.hexColor)} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {mood.mood}
                        </Typography>
                      </Box>
                      <ActionButtons className="action-buttons">
                        <IconButton
                          onClick={() => {
                            setSelectedMood(mood);
                            handleMoodModalOpen('edit');
                          }}
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
                          onClick={() => handleDeleteMood(mood)}
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
                        {mood.description}
                      </Typography>
                    </AssessmentCardContent>
                  </AssessmentCard>
                ))}
              </AssessmentGrid>
            </Box>
          )}

          {activeTab === 'moodLevels' && (
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
                  <Icon path={mdiClipboardText} size={1} color="#3b82f6" />
                  Mood Level Assessments
                </Typography>
                <StyledButton
                  variant="contained"
                  startIcon={<Icon path={mdiPlus} size={1} />}
                  onClick={handleAddAssessment}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white'
                  }}
                >
                  Add Assessment
                </StyledButton>
              </Box>

              <AssessmentGrid>
                {assessments.map((assessment) => (
                  <AssessmentCard key={assessment._id}>
                    <AssessmentCardHeader>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {assessment.question}
                      </Typography>
                      <ActionButtons className="action-buttons">
                        <IconButton
                          onClick={() => handleEditMoodLevelAssessment(assessment)}
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
                          onClick={() => handleDeleteMoodLevelAssessment(assessment._id)}
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
                      {assessment.answer.map((ans, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Option {index + 1}: {ans.option}
                          </Typography>
                          <Typography variant="caption" color="primary">
                            Mood Level: {ans.moodLevel}
                          </Typography>
                        </Box>
                      ))}
                    </AssessmentCardContent>
                  </AssessmentCard>
                ))}
              </AssessmentGrid>
            </Box>
          )}

          {activeTab === 'moodAssessments' && (
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
                  <Icon path={mdiFormatListBulleted} size={1} color="#3b82f6" />
                  Mood Assessments
                </Typography>
                <StyledButton
                  variant="contained"
                  startIcon={<Icon path={mdiPlus} size={1} />}
                  onClick={() => setOpenCreateMoodAssessmentModal(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white'
                  }}
                >
                  Add Mood Assessment
                </StyledButton>
              </Box>

              <AssessmentGrid>
                {moodAssessments.map((assessment) => (
                  <AssessmentCard key={assessment._id}>
                    <AssessmentCardHeader>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {assessment.question}
                      </Typography>
                      <ActionButtons className="action-buttons">
                        <IconButton
                          onClick={() => {
                            setSelectedMoodAssessment(assessment);
                            handleMoodAssessmentModalOpen('edit', assessment);
                          }}
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
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteMoodAssessment(assessment._id)}
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
                          <Delete />
                        </IconButton>
                      </ActionButtons>
                    </AssessmentCardHeader>
                    <AssessmentCardContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          Category: {assessment.category?.mood || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Type: {assessment.type?.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Score: {assessment.score}
                        </Typography>
                      </Box>

                      {assessment.type === 'blanks' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                            Answer
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {assessment.answer}
                          </Typography>
                        </Box>
                      )}

                      {assessment.type === 'mcq' && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                            Options
                          </Typography>
                          {assessment.mcqOptions.map((option, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {index + 1}. {option.text}
                                {option.isCorrect && (
                                  <Chip
                                    label="Correct"
                                    size="small"
                                    color="success"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {assessment.media && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={assessment.media}
                            alt="Assessment media"
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: '8px'
                            }}
                          />
                        </Box>
                      )}

                      {assessment.video && (
                        // <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        //   Video link:
                        //   <Link href={assessment.video}> {assessment.video}</Link> 
                        //   {/* {assessment.video} */}
                        // </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Video link:
                          <Link
                            href={assessment.video}
                            sx={{
                              wordBreak: "break-word",
                              display: "inline-block",
                              maxWidth: "100%"
                            }}
                          >
                            {assessment.video}
                          </Link>
                        </Typography>
                      )}


                    </AssessmentCardContent>
                  </AssessmentCard>
                ))}
              </AssessmentGrid>
            </Box>
          )}
        </Box>

        <StyledDialog
          open={openMoodModal}
          onClose={handleMoodModalClose}
          maxWidth="sm"
          fullWidth
        >
          <StyledDialogTitle>
            <div className="icon-wrapper">
              <Icon path={mdiEmoticon} size={1.2} color="#ffffff" />
            </div>
            <span className="title-text">
              {modalMode === "edit" ? "Edit Mood" : modalMode === "add" ? "Add New Mood" : "View Mood"}
            </span>
          </StyledDialogTitle>
          <StyledDialogContent>
            <div className="form-section mt-1">
              <div className="section-title">Basic Information</div>
              <TextField
                fullWidth
                label="Mood"
                name="mood"
                className="mt-3"
                value={selectedMood?.mood || ''}
                onChange={(e) => setSelectedMood({ ...selectedMood, mood: e.target.value })}
                disabled={modalMode === 'view'}
                placeholder="Enter mood name"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={selectedMood?.description || ''}
                onChange={(e) => setSelectedMood({ ...selectedMood, description: e.target.value })}
                disabled={modalMode === 'view'}
                placeholder="Enter mood description"
              />
            </div>

            {modalMode !== 'view' && (
              <div className="form-section">
                <div className="section-title">Color Settings</div>
                <div className="color-picker-section">
                  <Button
                    variant="outlined"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    sx={{ marginBottom: 2, width: '100%' }}
                  >
                    {showColorPicker ? 'Close Color Picker' : 'Open Color Picker'}
                  </Button>
                  {showColorPicker && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ChromePicker
                        color={selectedMood?.hexColor || '#ffffff'}
                        onChange={handleColorChange}
                        disableAlpha={true}
                      />
                    </Box>
                  )}
                </div>
              </div>
            )}

            {modalMode === 'view' && (
              <div className="form-section">
                <div className="section-title">Color Preview</div>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                    Selected Color:
                  </Typography>
                  <Box
                    width={40}
                    height={40}
                    bgcolor={selectedMood?.hexColor || '#ffffff'}
                    border="1px solid #e2e8f0"
                    borderRadius="8px"
                    boxShadow="0 2px 4px rgba(0,0,0,0.05)"
                  />
                </Box>
              </div>
            )}
          </StyledDialogContent>
          <StyledDialogActions>
            <Button variant="outlined" onClick={handleMoodModalClose}>
              Cancel
            </Button>
            {modalMode !== 'view' && (
              <Button variant="contained" onClick={handleSaveMood}>
                Save Changes
              </Button>
            )}
          </StyledDialogActions>
        </StyledDialog>

        <Dialog
          open={openAssessmentModal}
          onClose={handleAssessmentModalClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {modalMode === "edit" ? "Edit Assessment" : modalMode === "add" ? "Add New Assessment" : "View Assessment"}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Question"
              name="question"
              value={selectedAssessment?.question || ''}
              onChange={(e) => setSelectedAssessment({ ...selectedAssessment, question: e.target.value })}
              disabled={modalMode === 'view'}
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              margin="normal"
              label="Type"
              name="type"
              value={selectedAssessment?.type || ''}
              onChange={(e) => setSelectedAssessment({ ...selectedAssessment, type: e.target.value })}
              disabled={modalMode === 'view'}
              sx={{ mb: 2 }}
            >
              <MenuItem value='' disabled>Select Mood</MenuItem>
              {moods.map((mood) => (
                <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
              ))}
            </Select>

            <TextField
              fullWidth
              margin="normal"
              label="Video link"
              name="video"
              value={selectedAssessment?.video || ''}
              onChange={(e) => setSelectedAssessment({ ...selectedAssessment, video: e.target.value })}
              disabled={modalMode === 'view'}
              sx={{ mb: 2 }}
            />

            {selectedAssessment?.answer.map((answer, index) => (
              <Box key={index} display="flex" alignItems="center" mt={2}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={answer.option}
                  onChange={(e) => handleOptionChange(index, 'option', e.target.value)}
                  disabled={modalMode === 'view'}
                />
                <Select
                  value={answer.moodLevel}
                  onChange={(e) => handleOptionChange(index, 'moodLevel', e.target.value)}
                  disabled={modalMode === 'view'}
                  sx={{ ml: 2, minWidth: 120 }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="extreme">Extreme</MenuItem>
                </Select>
                {modalMode !== 'view' && (
                  <IconButton onClick={() => removeOption(index)}>
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
            {modalMode !== 'view' && (
              <Button onClick={addOption} startIcon={<Add />} sx={{ mt: 2, backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0056b3' } }}>
                Add Option
              </Button>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAssessmentModalClose}>Cancel</Button>
            {modalMode !== 'view' && (
              <Button onClick={handleSaveAssessment} variant="contained" color="primary">
                Save
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <StyledDialog
          open={openMoodLevelAssessmentModal}
          onClose={handleMoodLevelAssessmentModalClose}
          maxWidth="md"
          fullWidth
        >
          <StyledDialogTitle>
            <div className="icon-wrapper">
              <Icon path={mdiClipboardText} size={1.2} color="#ffffff" />
            </div>
            <span className="title-text">
              {modalMode === 'edit' ? 'Edit Mood Level Assessment' : 'Add New Mood Level Assessment'}
            </span>
          </StyledDialogTitle>
          <StyledDialogContent>
            <div className="form-section">
              <Typography className="section-title" gutterBottom>
                Assessment Details
              </Typography>
              <TextField
                fullWidth
                select
                label="Assessment Type"
                value={selectedMoodLevelAssessment?.type || ''}
                onChange={(e) => setSelectedMoodLevelAssessment({
                  ...selectedMoodLevelAssessment,
                  type: e.target.value
                })}
                sx={{ mt: 2 }}
                required
              >
                {moods.map((mood) => (
                  <MenuItem key={mood._id} value={mood._id}>
                    {mood.mood}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Question"
                value={selectedMoodLevelAssessment?.question || ''}
                onChange={(e) => setSelectedMoodLevelAssessment({
                  ...selectedMoodLevelAssessment,
                  question: e.target.value
                })}
                variant="outlined"
                sx={{ mb: 3 }}
                InputLabelProps={{
                  sx: {
                    color: '#64748b',
                    '&.Mui-focused': {
                      color: '#3b82f6'
                    }
                  }
                }}
                InputProps={{
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(203, 213, 225, 0.8)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#94a3b8',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6',
                    }
                  }
                }}
              />



              <Typography variant="h6" sx={{ mb: 2 }}>Answer Options</Typography>

              {['low', 'medium', 'extreme'].map((level, index) => (
                <Box key={level} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`${level.charAt(0).toUpperCase() + level.slice(1)} Level Option`}
                    value={selectedMoodLevelAssessment?.answer[index]?.option || ''}
                    onChange={(e) => {
                      const newAnswers = [...(selectedMoodLevelAssessment?.answer || [])];
                      newAnswers[index] = { option: e.target.value, moodLevel: level };
                      setSelectedMoodLevelAssessment({
                        ...selectedMoodLevelAssessment,
                        answer: newAnswers
                      });
                    }}
                    sx={{ mb: 1 }}
                    required
                  />
                </Box>
              ))}

            </div>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              variant="outlined"
              onClick={handleMoodLevelAssessmentModalClose}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveAssessment}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                modalMode === 'edit' ? 'Update Assessment' : 'Create Assessment'
              )}
            </Button>
          </StyledDialogActions>
        </StyledDialog>

        <Dialog
          open={openAddMoodLevelAssessmentModal}
          onClose={handleAddMoodLevelAssessmentModalClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Mood Level Assessment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Question"
              name="question"
              value={newMoodLevelAssessment.question}
              onChange={handleNewMoodLevelAssessmentChange}
              sx={{ mb: 2 }}
            />
            <Select
              fullWidth
              margin="normal"
              label="Type"
              name="type"
              value={newMoodLevelAssessment.type}
              onChange={handleNewMoodLevelAssessmentChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value='' disabled>Select Mood</MenuItem>
              {moods.map((mood) => (
                <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
              ))}
            </Select>

            {newMoodLevelAssessment.answer.map((answer, index) => (
              <Box key={index} display="flex" alignItems="center" mt={2}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={answer.option}
                  onChange={(e) => handleNewMoodLevelAssessmentOptionChange(index, 'option', e.target.value)}
                />
                <Select
                  value={answer.moodLevel}
                  onChange={(e) => handleNewMoodLevelAssessmentOptionChange(index, 'moodLevel', e.target.value)}
                  sx={{ ml: 2, minWidth: 120 }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="extreme">Extreme</MenuItem>
                </Select>
                <IconButton onClick={() => handleRemoveNewMoodLevelAssessmentOption(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={handleAddNewMoodLevelAssessmentOption}
              startIcon={<Add />}
              sx={{ mt: 2, backgroundColor: '#007bff', color: 'white', '&:hover': { backgroundColor: '#0056b3' } }}
            >
              Add Option
            </Button>
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
              Note: You can add up to 3 options.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddMoodLevelAssessmentModalClose}>Cancel</Button>
            <Button onClick={handleSaveNewMoodLevelAssessment} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <StyledDialog
          open={openMoodAssessmentModal}
          onClose={handleMoodAssessmentModalClose}
          maxWidth="md"
          fullWidth
        >
          <StyledDialogTitle>
            <div className="icon-wrapper">
              <Icon path={mdiClipboardText} size={1.5} color="#ffffff" />
            </div>
            <span className="title-text">
              {modalMode === 'edit' ? 'Edit Assessment' : 'View Assessment'}
            </span>
          </StyledDialogTitle>

          <StyledDialogContent>
            <div className="form-section">
              <Typography className="section-title" gutterBottom>
                Assessment Details
              </Typography>

              <TextField
                fullWidth
                label="Question"
                name="question"
                value={selectedMoodAssessment?.question || ''}
                onChange={handleMoodAssessmentChange}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={selectedMoodAssessment?.type || ''}
                onChange={handleMoodAssessmentChange}
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <MenuItem value="mcq">Multiple Choice</MenuItem>
                <MenuItem value="blanks">Fill in the Blanks</MenuItem>
              </TextField>

              {/* Only show answer field for blanks type */}
              {selectedMoodAssessment?.type === 'blanks' && (
                <TextField
                  fullWidth
                  label="Answer"
                  name="answer"
                  value={selectedMoodAssessment?.answer || ''}
                  onChange={handleMoodAssessmentChange}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
              )}

              <TextField
                fullWidth
                type="number"
                label="Score"
                name="score"
                value={selectedMoodAssessment?.score || ''}
                onChange={handleMoodAssessmentChange}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                type="text"
                label="Video link"
                name="video"
                value={selectedMoodAssessment?.video || ''}
                onChange={handleMoodAssessmentChange}
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {/* MCQ Options section */}
              {selectedMoodAssessment?.type === 'mcq' && (
                <div className="form-section">
                  <Typography className="section-title" gutterBottom>
                    MCQ Options
                  </Typography>
                  {selectedMoodAssessment.mcqOptions.map((option, index) => (
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
                        onClick={() => handleRemoveMcqOption(index)}
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
                    onClick={handleAddMcqOption}
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
              )}

              {/* Media upload section for blanks type */}
              {selectedMoodAssessment?.type === 'blanks' && (
                <Box sx={{ mt: 3 }}>
                  <Typography className="section-title" gutterBottom>
                    Media Upload
                  </Typography>

                  <Box sx={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    p: 3,
                    mt: 2
                  }}>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      accept="image/*,video/*"
                    />

                    <StyledButton
                      variant="outlined"
                      onClick={() => fileInputRef.current.click()}
                      startIcon={<Icon path={mdiCloudUpload} size={1} />}
                      sx={{ mb: 2 }}
                    >
                      {selectedFile ? 'Change Media File' : 'Upload Media File'}
                    </StyledButton>

                    {/* Current media preview */}
                    {selectedMoodAssessment.media && !selectedFile && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#64748b' }}>
                          Current Media:
                        </Typography>
                        <Box sx={{
                          position: 'relative',
                          width: 'fit-content'
                        }}>
                          <img
                            src={selectedMoodAssessment.media}
                            alt="Current media"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              objectFit: 'contain',
                              borderRadius: '8px'
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              setSelectedMoodAssessment(prev => ({
                                ...prev,
                                media: null
                              }));
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)'
                              }
                            }}
                            size="small"
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Box>
                      </Box>
                    )}

                    {/* New file preview */}
                    {selectedFile && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#64748b' }}>
                          New Media Preview:
                        </Typography>
                        <Box sx={{
                          position: 'relative',
                          width: 'fit-content'
                        }}>
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="New media"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              objectFit: 'contain',
                              borderRadius: '8px'
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              setSelectedFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)'
                              }
                            }}
                            size="small"
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </div>
          </StyledDialogContent>

          <StyledDialogActions>
            <Button
              onClick={handleMoodAssessmentModalClose}
              variant="outlined"
            >
              Cancel
            </Button>
            {modalMode === 'edit' && (
              <Button
                onClick={handleEditMoodAssessment}
                variant="contained"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}
          </StyledDialogActions>
        </StyledDialog>

        <StyledDialog
          open={openCreateMoodAssessmentModal}
          onClose={handleCreateMoodAssessmentModalClose}
          maxWidth="md"
          fullWidth
        >
          <StyledDialogTitle>
            <div className="icon-wrapper">
              <Icon path={mdiFormatListBulleted} size={1.2} color="#ffffff" />
            </div>
            <span className="title-text">
              Create New Mood Assessment
            </span>
          </StyledDialogTitle>
          <StyledDialogContent>
            <div className="form-section">
              <Typography className="section-title" gutterBottom>
                Basic Information
              </Typography>
              <TextField
                fullWidth
                label="Question"
                name="question"
                value={newMoodAssessment.question}
                onChange={handleNewMoodAssessmentChange}
                sx={{ mb: 2 }}
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
                select
                label="Type"
                name="type"
                value={newMoodAssessment.type}
                onChange={handleNewMoodAssessmentChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="mcq">Multiple Choice</MenuItem>
                <MenuItem value="blanks">Fill in the Blanks</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Score"
                name="score"
                type="number"
                value={newMoodAssessment.score}
                onChange={handleNewMoodAssessmentChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                select
                label="Category (Mood)"
                name="category"
                value={newMoodAssessment.category}
                onChange={handleNewMoodAssessmentChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>Select Mood</MenuItem>
                {moods.map((mood) => (
                  <MenuItem key={mood._id} value={mood._id}>{mood.mood}</MenuItem>
                ))}
              </TextField>



              {newMoodAssessment.type === 'blanks' && (
                <div className="form-section">
                  {/* <Typography className="section-title" gutterBottom>
                    Answer Details
                  </Typography> */}
                  <TextField
                    fullWidth
                    label="Answer"
                    name="answer"
                    value={newMoodAssessment.answer}
                    onChange={handleNewMoodAssessmentChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Video link"
                    name="video"
                    type="text"
                    value={newMoodAssessment.video}
                    onChange={handleNewMoodAssessmentChange}
                    sx={{ mb: 2 }}
                  />

                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      borderRadius: '16px',
                      background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
                      border: '2px dashed #cbd5e1',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)'
                      }
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        color: '#1e293b',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Icon path={mdiImage} size={1} color="#3b82f6" />
                      Media Upload
                    </Typography>

                    <input
                      type="file"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      accept="image/*,video/*"
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      {(selectedFile || newMoodAssessment.media) && (
                        <Box
                          sx={{
                            width: '100%',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            position: 'relative',
                            mb: 2
                          }}
                        >
                          <img
                            src={selectedFile ? URL.createObjectURL(selectedFile) : newMoodAssessment.media}
                            alt="Assessment media"
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '200px',
                              objectFit: 'cover',
                              borderRadius: '12px'
                            }}
                          />
                          <IconButton
                            onClick={handleDeleteFile}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(239, 68, 68, 0.9)',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#dc2626'
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      )}

                      {!selectedFile && !newMoodAssessment.media && (
                        <Box
                          sx={{
                            width: '100%',
                            height: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.02)'
                            }
                          }}
                          onClick={() => fileInputRef.current.click()}
                        >
                          <Icon
                            path={mdiCloudUpload}
                            size={2}
                            color="#64748b"
                            style={{ marginBottom: '12px' }}
                          />
                          <Typography variant="body1" color="text.secondary" align="center">
                            Drag and drop your media here or
                          </Typography>
                          <Button
                            variant="outlined"
                            sx={{
                              mt: 1,
                              borderRadius: '8px',
                              textTransform: 'none',
                              borderColor: '#3b82f6',
                              color: '#3b82f6',
                              '&:hover': {
                                borderColor: '#2563eb',
                                backgroundColor: 'rgba(59, 130, 246, 0.04)'
                              }
                            }}
                          >
                            Browse Files
                          </Button>
                        </Box>
                      )}

                      {selectedFile && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Selected file: {selectedFile.name}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                              mt: 1,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#3b82f6'
                              }
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </div>

              )}

              {newMoodAssessment.type === 'mcq' && (
                <div className="form-section">
                  <Typography className="section-title" gutterBottom>
                    MCQ Options
                  </Typography>
                  {newMoodAssessment.mcqOptions.map((option, index) => (
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
                        onChange={(e) => handleNewMoodAssessmentOptionChange(index, 'text', e.target.value)}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={option.isCorrect || false}
                            onChange={(e) => handleNewMoodAssessmentOptionChange(index, 'isCorrect', e.target.checked)}
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
                        onClick={() => handleRemoveNewMoodAssessmentOption(index)}
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
                    onClick={handleAddNewMoodAssessmentOption}
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
              )}
            </div>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              variant="outlined"
              onClick={handleCreateMoodAssessmentModalClose}
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
              onClick={handleSaveNewMoodAssessment}
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

        {actionLoading && (
          <Backdrop
            sx={{
              color: '#fff',
              zIndex: (theme) => theme.zIndex.drawer + 1,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)'
            }}
            open={actionLoading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}
      </StyledDashboard>
    </>
  );
}