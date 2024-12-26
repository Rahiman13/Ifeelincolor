import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Banner.scss';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  styled,
  Fade,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  keyframes,
  CircularProgress,
  Chip,
  Tooltip
} from '@mui/material';
import Icon from '@mdi/react';
import {
  mdiChartLine,
  mdiPencil,
  mdiDelete,
  mdiAlertCircleOutline,
  mdiPlus,
  mdiClose,
  mdiCalendarClock,
  mdiFullscreen,
  mdiClock,
  mdiCircle,
  mdiFormatListBulleted,
  mdiImageOff,
} from '@mdi/js';
import Card_circle from '../../assets/circle.svg';
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.css';
import { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import BaseUrl from '../../api';


// Add this animation keyframe
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

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

const StyledCard = styled(Card)({
  position: 'relative',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',

  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',

    '& .action-buttons': {
      opacity: 1,
      transform: 'translateY(0)',
    },

    '& .card-image': {
      transform: 'scale(1.05)',
    }
  },

  '& [data-active="true"]': {
    borderTop: '4px solid #16a34a'
  },

  '& [data-active="false"]': {
    borderTop: '4px solid #dc2626'
  }
});

const MediaWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '220px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 40%)',
    zIndex: 1
  }
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease-in-out',
  className: 'card-image'
});

const ContentWrapper = styled(Box)({
  padding: '24px',
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)'
  }
});

const StatusBadge = styled(Box)(({ isActive }) => ({
  position: 'absolute',
  top: '16px',
  left: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: isActive
    ? 'rgba(34, 197, 94, 0.1)'
    : 'rgba(239, 68, 68, 0.1)',
  color: isActive ? '#16a34a' : '#dc2626',
  backdropFilter: 'blur(4px)',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  zIndex: 1,

  '& svg': {
    width: '8px',
    height: '8px',
    color: 'currentColor'
  }
}));

// Add these styled components for the modals
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialog-paper': {
//     borderRadius: '12px',
//     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
//   },
// }));

// const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   gap: '12px',
//   padding: '16px 24px',
//   background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//   color: '#ffffff',

//   '& .icon-wrapper': {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: '8px',
//     padding: '8px',
//   },

//   '& .title-text': {
//     fontSize: '1.25rem',
//     fontWeight: 600,
//   },
// }));

// const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
//   padding: '24px',

//   '& .form-section': {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '20px',
//   },
// }));

// const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
//   padding: '16px 24px',
//   gap: '12px',

//   '& .MuiButton-outlined': {
//     borderColor: '#3b82f6',
//     color: '#3b82f6',
//     '&:hover': {
//       borderColor: '#2563eb',
//       backgroundColor: 'rgba(59, 130, 246, 0.1)',
//     },
//   },

//   '& .MuiButton-contained': {
//     background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//     color: 'white',
//     '&:hover': {
//       background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
//     },
//   },
// }));

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

// Add these styled components at the top with your other styled components
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3b82f6',
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3b82f6',
      borderWidth: '2px',
    },
  },

  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },

  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
  },
}));

// Add these styled components for media preview
const MediaPreviewContainer = styled(Box)({
  position: 'relative',
  marginBottom: '24px',
  borderRadius: '24px',
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
});

const MediaPreview = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '300px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  '&:hover img': {
    transform: 'scale(1.05)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  }
});

const MediaUploadZone = styled(Box)({
  padding: '24px',
  borderRadius: '24px',
  border: '2px dashed #e2e8f0',
  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  '&:hover': {
    borderColor: '#3b82f6',
    // transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(59, 130, 246, 0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
    animation: `${shimmer} 2s infinite`,
  }
});

// Update the AddBannerModal component
const AddBannerModal = ({ show, handleClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media: null,
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, media: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <StyledDialog
      open={show}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <StyledDialogTitle>
        <div className="icon-container">
          <Icon path={mdiPlus} size={1.2} color="#fff" />
        </div>
        Add New Announcement
      </StyledDialogTitle>
      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{ mb: 3, mt: 2 }}
          />
          <StyledTextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            sx={{ mb: 3 }}
          />

          {/* Media Upload Section */}
          <MediaPreviewContainer>
            {formData.media ? (
              <MediaPreview>
                {formData.media.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(formData.media)} alt="Preview" />
                ) : formData.media.type.startsWith('video/') ? (
                  <video src={URL.createObjectURL(formData.media)} controls />
                ) : null}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    onClick={() => setFormData({ ...formData, media: null })}
                    sx={{
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(220, 38, 38, 1)',
                      }
                    }}
                  >
                    <Icon path={mdiClose} size={1} />
                  </IconButton>
                </Box>
              </MediaPreview>
            ) : (
              <MediaUploadZone>
                <input
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  id="media-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="media-file" style={{ cursor: 'pointer' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <Icon path={mdiPlus} size={1.5} color="#fff" />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                      Upload Media
                    </Typography>
                    <Typography sx={{ color: '#64748b' }}>
                      Drag and drop your files here or click to browse
                    </Typography>
                  </Box>
                </label>
              </MediaUploadZone>
            )}
          </MediaPreviewContainer>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 3 }}>
              <DateTimePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <DateTimePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                sx={{ width: '100%' }}
              />
            </Box>
          </LocalizationProvider>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={handleClose}
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
              Add Announcement
            </Button>
          </Box>
        </form>
      </StyledDialogContent>
    </StyledDialog>
  );
};

// Update the EditBannerModal component
const EditBannerModal = ({ show, handleClose, announcement, onSave }) => {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
    startDate: announcement?.startDate ? new Date(announcement.startDate) : new Date(),
    endDate: announcement?.endDate ? new Date(announcement.endDate) : new Date(),
    media: announcement?.media || null,
    newMedia: null
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        newMedia: file,
        media: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!announcement?._id) {
      toast.error('Invalid announcement ID');
      return;
    }
    await onSave(announcement._id, formData);
  };

  return (
    <StyledDialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <div className="icon-container">
          <Icon path={mdiPencil} size={1.2} color="#fff" />
        </div>
        Edit Announcement
      </StyledDialogTitle>
      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          {/* Media Preview Section */}


          {/* Other form fields */}
          <StyledTextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            // sx={{ mb: 3 }}
            sx={{ mb: 3, mt: 2 }}

          />
          <StyledTextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            sx={{ mb: 3 }}
          />
          <MediaPreviewContainer>
            {formData.media ? (
              <MediaPreview>
                <img src={formData.media} alt="Preview" />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    onClick={() => setFormData({ ...formData, media: null, newMedia: null })}
                    sx={{
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(220, 38, 38, 1)',
                      }
                    }}
                  >
                    <Icon path={mdiClose} size={1} />
                  </IconButton>
                </Box>
              </MediaPreview>
            ) : (
              <MediaUploadZone>
                <input
                  accept="image/*,video/*"
                  style={{ display: 'none' }}
                  id="edit-media-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="edit-media-file" style={{ cursor: 'pointer' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <Icon path={mdiPlus} size={1.5} color="#fff" />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 1 }}>
                      Upload Media
                    </Typography>
                    <Typography sx={{ color: '#64748b' }}>
                      Drag and drop your files here or click to browse
                    </Typography>
                  </Box>
                </label>
              </MediaUploadZone>
            )}
          </MediaPreviewContainer>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 3 }}>
              <DateTimePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                sx={{ width: '100%' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <DateTimePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                sx={{ width: '100%' }}
              />
            </Box>
          </LocalizationProvider>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              onClick={handleClose}
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
              Save Changes
            </Button>
          </Box>
        </form>
      </StyledDialogContent>
    </StyledDialog>
  );
};

// Add these helper functions at the top level
const getFormattedDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const timeAgo = (date) => {
  try {
    if (!date) return 'No date provided';
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid date';
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'Invalid date';
  }
};

// Add these styled components
const ActionButtons = styled(Box)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  display: 'flex',
  gap: '8px',
  opacity: 0,
  transform: 'translateY(-10px)',
  transition: 'all 0.3s ease-in-out',
  zIndex: 2,
});


// const StyledCard = styled(Card)({
//   position: 'relative',
//   borderRadius: '16px',
//   transition: 'all 0.3s ease-in-out',
//   overflow: 'hidden',

//   '&:hover': {
//     '& .action-buttons': {
//       opacity: 1,
//       transform: 'translateY(0)',
//     }
//   },

//   '& [data-active="true"]': {
//     borderLeft: '4px solid #16a34a'
//   },

//   '& [data-active="false"]': {
//     borderLeft: '4px solid #dc2626'
//   }
// });

// Update the BannerCard component
const BannerCard = ({ announcement, onEdit, onDelete }) => {
  const isActiveStatus = new Date(announcement?.endDate) > new Date();

  return (
    <StyledCard component={motion.div} whileHover={{ y: -8 }}>
      <Box data-active={isActiveStatus}>
        <ActionButtons className="action-buttons">
          <IconButton
            onClick={() => onEdit(announcement)}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              padding: '8px',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                transform: 'translateY(-2px)',
              },
              '& svg': {
                fontSize: '1.2rem',
              }
            }}
          >
            <Icon path={mdiPencil} size={0.7} />
          </IconButton>
          <IconButton
            onClick={() => onDelete(announcement._id)}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '8px',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                transform: 'translateY(-2px)',
              },
              '& svg': {
                fontSize: '1.2rem',
              }
            }}
          >
            <Icon path={mdiDelete} size={0.7} />
          </IconButton>
        </ActionButtons>

        <MediaWrapper>
          {announcement.media ? (
            <StyledImage
              src={announcement.media}
              alt={announcement.title}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                color: '#94a3b8'
              }}
            >
              <Icon
                path={mdiImageOff}
                size={2.5}
                color="currentColor"
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'inherit',
                  fontWeight: 500
                }}
              >
                No image available
              </Typography>
            </Box>
          )}
          <StatusBadge isActive={isActiveStatus}>
            <Icon path={mdiCircle} size={0.5} />
            {isActiveStatus ? 'Active' : 'Inactive'}
          </StatusBadge>
        </MediaWrapper>

        <ContentWrapper>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
                fontSize: '1.25rem',
                background: 'linear-gradient(130deg, #1e293b 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {announcement.title}
            </Typography>

            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              {announcement.content}
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            flexWrap: 'wrap'
          }}>
            {/* <Chip
              icon={<Icon path={mdiCalendarClock} size={0.7} />}
              label={timeAgo(announcement.postedDate)}
              size="small"
              sx={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3b82f6',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: '#3b82f6',
                }
              }}
            /> */}
            <Chip
              icon={<Icon path={mdiClock} size={0.7} />}
              label={`Duration: ${getDuration(announcement.startDate, announcement.endDate)}`}
              size="small"
              sx={{
                background: 'rgba(99, 102, 241, 0.1)',
                color: '#6366f1',
                fontWeight: 500,
                '& .MuiChip-icon': {
                  color: '#6366f1',
                }
              }}
            />
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            pt: 3
          }}>
            <TimelineInfo
              startDate={announcement.startDate}
              endDate={announcement.endDate}
            />
            {/* <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => onEdit(announcement)}
                sx={{
                  background: 'linear-gradient(130deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(130deg, #2563eb 0%, #1d4ed8 100%)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Icon path={mdiPencil} size={0.7} />
              </IconButton>
              <IconButton
                onClick={() => onDelete(announcement._id)}
                sx={{
                  background: 'linear-gradient(130deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(130deg, #dc2626 0%, #b91c1c 100%)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Icon path={mdiDelete} size={0.7} />
              </IconButton>
            </Box> */}
          </Box>
        </ContentWrapper>
      </Box>
    </StyledCard>
  );
};

// Update TimelineInfo component
const TimelineInfo = ({ startDate, endDate }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        Start: {getFormattedDate(startDate)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        End: {getFormattedDate(endDate)}
      </Typography>
    </Box>
  );
};

// Add this helper function
const getDuration = (start, end) => {
  const diff = new Date(end) - new Date(start);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days} days` : 'Less than a day';
};

// Add this styled component for the spinner
const LoadingSpinner = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
  '& .MuiCircularProgress-root': {
    color: '#3b82f6',
  }
});

// Add these styles to your existing styles
const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
`;

// Update the modal design
const StyledModal = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
    overflow: 'visible',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '600px',
    width: '100%',
  },
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(8px)',
    background: 'rgba(15, 23, 42, 0.8)',
  }
}));

const ModalHeader = styled(DialogTitle)(({ theme }) => ({
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
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
    animation: `${shimmer} 2s infinite`,
  }
}));

const ModalContent = styled(DialogContent)({
  padding: '32px',
  '& .MuiTextField-root': {
    marginBottom: '24px',
  }
});

// // Update the form fields styling
// const StyledTextField = styled(TextField)({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '12px',
//     background: 'rgba(255, 255, 255, 0.8)',
//     backdropFilter: 'blur(4px)',
//     '& fieldset': {
//       borderColor: '#e2e8f0',
//     },
//     '&:hover fieldset': {
//       borderColor: '#94a3b8',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#3b82f6',
//     },
//   },
//   '& .MuiInputLabel-root': {
//     color: '#64748b',
//     '&.Mui-focused': {
//       color: '#3b82f6',
//     },
//   },
// });

// Update the DateTimePicker styling
const StyledDateTimePicker = styled(DateTimePicker)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
  }
});

// Add these styled components
const MediaContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '200px',
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },
  '&:hover': {
    '&::before': {
      opacity: 1,
    },
    '& .media-overlay': {
      transform: 'translateY(0)',
      opacity: 1,
    },
    '& img': {
      transform: 'scale(1.05)',
    }
  }
});

// const StyledImage = styled('img')({
//   width: '100%',
//   height: '100%',
//   objectFit: 'cover',
//   transition: 'transform 0.3s ease',
// });

const MediaOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '20px',
  color: 'white',
  transform: 'translateY(20px)',
  opacity: 0,
  transition: 'all 0.3s ease',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

// Update the preview section in AddBannerModal and EditBannerModal
const MediaPreviewSection = ({ media, onRemove }) => {
  return (
    <MediaPreviewContainer>
      <MediaPreview>
        {media ? (
          <>
            {typeof media === 'string' ? (
              <img src={media} alt="Preview" />
            ) : (
              <img src={URL.createObjectURL(media)} alt="Preview" />
            )}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 2,
              }}
            >
              <IconButton
                onClick={onRemove}
                sx={{
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(220, 38, 38, 1)',
                  }
                }}
              >
                <Icon path={mdiClose} size={1} />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              color: '#94a3b8'
            }}
          >
            <Icon
              path={mdiImageOff}
              size={3}
              color="currentColor"
            />
            <Typography
              variant="body1"
              sx={{
                color: 'inherit',
                fontWeight: 500
              }}
            >
              No image available
            </Typography>
          </Box>
        )}
      </MediaPreview>
    </MediaPreviewContainer>
  );
};

// Banner Management Page Component
const BannerManagementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const isAdmin = sessionStorage.getItem('adminPortal') === 'true';

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BaseUrl}/api/announcement`);
      if (response.data.status === 'success') {
        setAnnouncements(response.data.body);
      } else {
        toast.error('Failed to fetch announcements');
      }
    } catch (error) {
      toast.error('Error loading announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async (formData) => {
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('content', formData.content);
      form.append('startDate', formData.startDate.toISOString());
      form.append('endDate', formData.endDate.toISOString());
      if (formData.media) {
        form.append('media', formData.media);
      }

      const response = await axios.post(
        `${BaseUrl}/api/announcement`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        await fetchAnnouncements();
        setShowAddModal(false);
        toast.success('🎉 Announcement added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add announcement');
      console.error('Add error:', error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, delete it!',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await axios.delete(
              `${BaseUrl}/api/announcement/${id}`
            );
            return response.data.status === 'success';
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error}`);
            return false;
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (result.isConfirmed) {
        await fetchAnnouncements();
        toast.success('🗑️ Announcement deleted successfully!');
      }
    } catch (error) {
      toast.error('Error deleting announcement');
    }
  };

  const handleEditAnnouncement = async (id, formData) => {
    try {
      // Check if user is admin
      if (sessionStorage.getItem('adminPortal') !== 'true') {
        toast.error('Unauthorized: Admin access required');
        return;
      }

      const form = new FormData();
      form.append('title', formData.title);
      form.append('content', formData.content);
      form.append('startDate', formData.startDate.toISOString());
      form.append('endDate', formData.endDate.toISOString());

      // Only append media if a new file was selected
      if (formData.newMedia) {
        form.append('media', formData.newMedia);
      }

      const response = await axios.put(
        `${BaseUrl}/api/announcement/${id}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.status === 'success') {
        await fetchAnnouncements();
        setShowEditModal(false);
        setSelectedAnnouncement(null);
        toast.success('✨ Announcement updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update announcement');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Error updating announcement');
    }
  };

  return (
    <StyledDashboard>
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

      <StyledPageHeader>
        <div className="page-title">
          <div className="page-title-icon">
            <Icon path={mdiChartLine} size={1.5} color="#ffffff"
              style={{
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </div>
          <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
            Announcement Management
          </span>
        </div>
        <Tooltip
          title={
            <Box sx={{ p: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Announcement Management Dashboard
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                This dashboard allows you to manage all announcements and banners for the platform:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  View all active and inactive announcements
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Create new announcements with media uploads
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Edit existing announcement details and scheduling
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                  Manage announcement duration and visibility
                </Typography>
                <Typography component="li" variant="body2">
                  Remove outdated announcements
                </Typography>
              </Box>
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
              maxWidth: 400,
              p: 2
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

      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        {isAdmin && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => setShowAddModal(true)}
              startIcon={<Icon path={mdiPlus} size={1} />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
              }}
            >
              Add Announcement
            </Button>
          </Box>
        )}

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px'
            }}
          >
            <CircularProgress
              size={40}
              thickness={4}
              sx={{ color: '#3b82f6' }}
            />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {announcements.map((announcement) => (
              <Grid item xs={12} sm={6} md={4} key={announcement._id}>
                <BannerCard
                  announcement={announcement}
                  onEdit={() => {
                    setSelectedAnnouncement(announcement);
                    setShowEditModal(true);
                  }}
                  onDelete={() => handleDeleteAnnouncement(announcement._id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Modals */}
      {isAdmin && (
        <>
          <AddBannerModal
            show={showAddModal}
            handleClose={() => setShowAddModal(false)}
            onSubmit={handleAddAnnouncement}
          />

          {selectedAnnouncement && (
            <EditBannerModal
              show={showEditModal}
              handleClose={() => setShowEditModal(false)}
              announcement={selectedAnnouncement}
              onSave={handleEditAnnouncement}
            />
          )}
        </>
      )}
    </StyledDashboard>
  );
};

export default BannerManagementPage;
