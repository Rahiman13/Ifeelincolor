import React, { useState, useEffect } from "react";
import Icon from '@mdi/react';
import { mdiOfficeBuilding, mdiDomain, mdiChartLine, mdiPlus, mdiCalendarCheck, mdiCalendarClock } from '@mdi/js';
// import './OrganizationPage.scss';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Modal, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TablePagination, CircularProgress, Backdrop, Chip, Tooltip, Paper } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Menu as MenuIcon, RemoveRedEye as ViewIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Card_circle from '../../assets/circle.png';
import axios from 'axios';
import { mdiAccountGroup, mdiAlertCircleOutline } from '@mdi/js';
import { Container } from 'react-bootstrap';
import BaseUrl from '../../api';
// import {
//     FaBuilding,
//     FaGlobe,
//     FaUserTie,
//     FaMapMarkerAlt,
//     FaPhone,
//     FaLinkedin,
//     FaTwitter,
//     FaFacebook,
//     FaInstagram
// } from 'react-icons/fa';
import { Fade } from '@mui/material';
import { mdiPencil } from '@mdi/js';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
    FaPhone,
    FaMapMarkerAlt,
    FaBuilding,
    FaEnvelope,
    FaGlobe,
    FaCalendarAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaLinkedin,
    FaTwitter,
    FaFacebook,
    FaInstagram,
    FaUsers,
    FaUserTie
} from 'react-icons/fa';
import {
    mdiFilter,
    mdiViewList,
    mdiCheckCircle,
    mdiCloseCircle,
    mdiCheck
} from '@mdi/js';
import { mdiMagnify } from '@mdi/js';
import { mdiDownload } from '@mdi/js';

// ... Keep the styled components from the Clinician page ...
// Metric Card Component
const MetricCard = ({ title, value, icon, gradient, percentage }) => (
    <Card
        sx={{
            background: gradient, // Gradient as the base background
            color: 'white',
            padding: 4,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transition effect for hover
            '&:hover': {
                // transform: 'scale(1.05)', // Slightly scale the card on hover
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', // Add shadow on hover
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '195px',
                height: '240px',
                // backgroundImage: `url(${Card_circle})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                opacity: 0.6, // Set opacity for transparency
                zIndex: 0, // Ensure it's behind the text
            },
            zIndex: 1, // Ensure the content stays on top
        }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }} className='d-flex align-items-center gap-2'>
            <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
            <Typography variant="h6" fontWeight="normal">
                {title}
            </Typography>
            <Icon path={icon} size={1.2} color="rgba(255,255,255,0.8)" />
        </Box>
        <Typography variant="h4" fontWeight="bold" my={2}>
            {value}
        </Typography>
        <Typography variant="body2">
            {percentage}
        </Typography>
    </Card>
);

// Styled components for enhanced table appearance
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
    borderRadius: theme.shape.borderRadius * 3,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    minWidth: '100%',
    position: 'relative',
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '24px 24px 0 0',
}));

const StyledTable = styled(Table)({
    minWidth: '100%',
    fontFamily: 'Arial, sans-serif',
});

// const StyledTableHead = styled(TableHead)(({ theme }) => ({
//     background: theme.palette.grey[200],
// }));

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
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
        // backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    '&:hover': {
        // backgroundColor: 'rgba(0, 0, 0, 0.04)',
        // transform: 'translateY(-2px)',
        // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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

const StyledChip = styled(Chip)(({ theme, active }) => ({
    fontWeight: 'bold',
    borderRadius: '20px',
    backgroundColor: active ? '#7a990a' : '#d32f2f',
    color: 'white',
    padding: '0 10px',
    height: 28,
    fontSize: '0.75rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    padding: '8px',
    margin: '4px',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
}));

// Add these new styled components at the top after existing styled components
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

// Update the MetricCard component to ModernMetricCard
// const ModernMetricCard = styled(Card)(({ gradient }) => ({
//     background: gradient || 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '24px',
//     padding: '24px',
//     minHeight: '200px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//     position: 'relative',
//     overflow: 'hidden',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//         transform: 'translateY(-8px)',
//         boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
//     },
//     '& .MuiTypography-root': {
//         color: '#fff',
//     },
//     '&::before': {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         width: '195px',
//         height: '240px',
//         backgroundImage: `url(${Card_circle})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'contain',
//         opacity: 0.6,
//         zIndex: 0,
//     }
// }));

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


// Add this with other styled components
const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
    border: `2px solid ${theme.palette.background.paper}`,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.2)',
    }
}));

const IconWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

// Add this styled component with the other styled components
const StyledModal = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '20px',
        padding: theme.spacing(2),
        maxWidth: '600px',
        width: '100%'
    }
}));

// Add these styled components after your existing styled components
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

// Add these styled components at the top with other styled components
const ModalContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    maxHeight: '90vh',
    overflow: 'auto',
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
    '&::-webkit-scrollbar': {
        width: '8px'
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f5f9',
        borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#94a3b8',
        borderRadius: '4px',
        '&:hover': {
            background: '#64748b'
        }
    }
}));

const ModalHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: theme.spacing(3),
    borderRadius: '24px 24px 0 0',
    position: 'sticky',
    top: 0,
    zIndex: 1
}));

const InfoSection = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    '&:hover': {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
    }
}));

// Add the DetailModal component
const DetailModal = ({ organization, open, onClose }) => {
    if (!organization) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="organization-detail-modal"
        >
            <ModalContainer>
                {/* Header Section */}
                <ModalHeader>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '12px',
                                    p: 1,
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <FaBuilding size={28} color="white" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" color="white" sx={{ mb: 0.5 }}>
                                    {organization.companyName || organization.name}
                                </Typography>
                                <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)">
                                    Organization Profile
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'rotate(90deg)',
                                    transition: 'all 0.3s ease-in-out'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </ModalHeader>

                <Box p={4}>
                    {/* Profile Section */}
                    <InfoSection sx={{
                        position: 'relative',
                        mt: -8,
                        mb: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        borderRadius: '24px',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
                    }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={3}>
                                    <Avatar
                                        src={organization.image}
                                        alt={organization.name}
                                        sx={{
                                            width: 180,
                                            height: 180,
                                            border: '4px solid white',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                            transition: 'transform 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        {organization.name?.charAt(0)}
                                    </Avatar>
                                    <Box display="flex" gap={1} mt={2}>
                                        <Chip
                                            icon={organization.active ? <FaCheckCircle /> : <FaTimesCircle />}
                                            label={organization.active ? "Active" : "Inactive"}
                                            color={organization.active ? "success" : "error"}
                                            sx={{
                                                borderRadius: '12px',
                                                '& .MuiChip-icon': { fontSize: '1.2rem' }
                                            }}
                                        />
                                        <Chip
                                            icon={organization.verified ? <FaCheckCircle /> : <FaTimesCircle />}
                                            label={organization.verified ? "Verified" : "Unverified"}
                                            color={organization.verified ? "success" : "warning"}
                                            sx={{
                                                borderRadius: '12px',
                                                '& .MuiChip-icon': { fontSize: '1.2rem' }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Box sx={{ p: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Paper elevation={0} sx={{
                                                p: 2,
                                                background: 'rgba(59, 130, 246, 0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(59, 130, 246, 0.1)'
                                            }}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <FaEnvelope color="#3b82f6" />
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Email Address
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {organization.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Paper elevation={0} sx={{
                                                p: 2,
                                                background: 'rgba(34, 197, 94, 0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(34, 197, 94, 0.1)'
                                            }}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <FaPhone color="#22c55e" />
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Contact Number
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {organization.mobile || 'Not provided'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Paper elevation={0} sx={{
                                                p: 2,
                                                background: 'rgba(249, 115, 22, 0.05)',
                                                borderRadius: '16px',
                                                border: '1px solid rgba(249, 115, 22, 0.1)'
                                            }}>
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <FaMapMarkerAlt color="#f97316" />
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            Location
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {organization.address || 'Not provided'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </InfoSection>

                    {/* Company Details Section */}
                    <InfoSection>
                        <Typography variant="h6" gutterBottom sx={{
                            color: '#1e293b',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 3
                        }}>
                            <FaBuilding />
                            Company Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={0} sx={{
                                    p: 3,
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                        <FaUserTie size={20} color="#64748b" />
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Founded By
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6">
                                        {organization.founder || 'Not specified'}
                                    </Typography>
                                    {/* <Typography variant="h6">
                                        {organization.certificate || 'Not specified'}
                                    </Typography> */}
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper elevation={0} sx={{
                                    p: 3,
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                        <FaCalendarAlt size={20} color="#64748b" />
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Established Date
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6">
                                        {organization.established ? formatDate(organization.established) : 'Not specified'}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                sx={{
                                    position: 'relative',
                                    p: 2,
                                    m:2,
                                    // backgroundColor: theme.palette.background.paper,
                                    borderRadius: 2,
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={organization.certificate || '/placeholder-image.jpg'}
                                    alt="Organization Certificate"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: 2,
                                        objectFit: 'cover',
                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: 16,
                                        right: 16,
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        color: '#fff',
                                        p: 1.5,
                                        borderRadius: 1,
                                        textAlign: 'center',
                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        {organization.name || 'Certificate'}
                                    </Typography>
                                    <Button
                                        href={organization.certificate || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            color: '#fff',
                                            border: `1px solid #fff`,
                                            '&:hover': {
                                                // backgroundColor: theme.palette.primary.main,
                                                color: '#fff',
                                                // borderColor: theme.palette.primary.main,
                                            },
                                        }}
                                    >
                                        View Certificate
                                    </Button>
                                </Box>
                            </Grid>

                        </Grid>
                    </InfoSection>

                    {/* Social Media Section */}
                    <InfoSection>
                        <Typography variant="h6" gutterBottom sx={{
                            color: '#1e293b',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 3
                        }}>
                            <FaGlobe />
                            Social Media Presence
                        </Typography>
                        <Grid container spacing={2}>
                            {organization.socialProfile && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Paper elevation={0} sx={{
                                            p: 2.5,
                                            borderRadius: '16px',
                                            background: 'rgba(14, 118, 168, 0.05)',
                                            border: '1px solid rgba(14, 118, 168, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }
                                        }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaLinkedin size={24} color="#0077B5" />
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        LinkedIn
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {organization.socialProfile.linkedin || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper elevation={0} sx={{
                                            p: 2.5,
                                            borderRadius: '16px',
                                            background: 'rgba(14, 118, 168, 0.05)',
                                            border: '1px solid rgba(14, 118, 168, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }
                                        }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaTwitter size={24} color="#1DA1F2" />
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Twitter
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {organization.socialProfile.twitter || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper elevation={0} sx={{
                                            p: 2.5,
                                            borderRadius: '16px',
                                            background: 'rgba(14, 118, 168, 0.05)',
                                            border: '1px solid rgba(14, 118, 168, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }
                                        }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaFacebook size={24} color="#1877F2" />
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Facebook
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {organization.socialProfile.facebook || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Paper elevation={0} sx={{
                                            p: 2.5,
                                            borderRadius: '16px',
                                            background: 'rgba(14, 118, 168, 0.05)',
                                            border: '1px solid rgba(14, 118, 168, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                            }
                                        }}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaInstagram size={24} color="#E4405F" />
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Instagram
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {organization.socialProfile.instagram || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </InfoSection>
                </Box>
            </ModalContainer>
        </Modal>
    );
};

// Add this after the styled components
const FilterMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: '12px',
        marginTop: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
    }
}));

const StyledFilterButton = styled(Button)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    padding: '6px 10px',
    color: '#1e293b',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    fontWeight: 600,
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    // gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    '&:hover': {
        background: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }
}));

const FilterBadge = styled('span')(({ active }) => ({
    background: active ? '#22c55e' : '#94a3b8',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.25rem',
    fontWeight: 'semibold',
    transition: 'all 0.3s ease',
}));

const StyledFilterMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        marginTop: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '8px',
        minWidth: '220px'
    }
}));

const StyledMenuItem = styled(MenuItem)(({ theme, selected }) => ({
    borderRadius: '12px',
    padding: '10px 16px',
    margin: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    background: selected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
    '&:hover': {
        background: 'rgba(59, 130, 246, 0.12)',
        transform: 'translateX(4px)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '50%',
        background: selected ? '#3b82f6' : 'transparent',
        borderRadius: '0 4px 4px 0',
        transition: 'all 0.3s ease',
    }
}));

const FilterIcon = styled(Box)(({ selected }) => ({
    width: '24px',
    height: '24px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: selected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(148, 163, 184, 0.12)',
    color: selected ? '#3b82f6' : '#64748b',
    transition: 'all 0.3s ease',
}));

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

// Add this styled component with other styled components
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

const OrganizationPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [organizationCounts, setOrganizationCounts] = useState({
        total: 0,
        activeCount: 0,
        inactiveCount: 0
    });
    const [organizationStats, setOrganizationStats] = useState({
        totalOrganizations: 0,
        activeOrganizations: 0,
        inactiveOrganizations: 0
    });
    const [isAdminPortal, setIsAdminPortal] = useState(false);
    const [newOrganization, setNewOrganization] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [activeFilter, setActiveFilter] = useState("all");
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const adminPortal = sessionStorage.getItem('adminPortal');
        setIsAdminPortal(adminPortal === 'true');
        fetchOrganizations();
        fetchOrganizationStats();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const baseUrl = role === 'assistant' ? 'assistant' : 'Admin';
            const url = `${BaseUrl}/api/${baseUrl}/organizations`;

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setOrganizations(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            toast.error('Failed to fetch organizations');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrganizationStats = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const baseUrl = role === 'assistant' ? 'assistant' : 'Admin';

            const response = await axios.get(`${BaseUrl}/api/${baseUrl}/organization-stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setOrganizationStats({
                    totalOrganizations: response.data.body.totalOrganizations || 0,
                    activeOrganizations: response.data.body.activeOrganizations || 0,
                    inactiveOrganizations: response.data.body.inactiveOrganizations || 0
                });
            }
        } catch (error) {
            console.error('Error fetching organization stats:', error);
            toast.error('Failed to fetch organization statistics');
        }
    };

    const fetchOrganizationCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const baseUrl = role === 'assistant' ? 'assistant' : 'admin';
            const response = await axios.get(`${BaseUrl}/api/${baseUrl}/organizations-counts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status === 'success') {
                setOrganizationCounts(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching organization counts:', error);
            toast.error('Failed to fetch organization counts');
        }
    };

    const handleEdit = async (organization) => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

            // Determine the base URL based on role and adminPortal
            const baseUrl = adminPortal ? 'admin' : 'assistant';

            // Fetch the organization details
            const response = await axios.get(
                `${BaseUrl}/api/${baseUrl}/organization/${organization._id}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.status === 'success') {
                setSelectedOrganization(response.data.body);
                setModalType("edit");
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching organization details:', error);
            toast.error('Failed to fetch organization details');
        }
    };

    const handleDelete = async (id) => {
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
            try {
                const token = sessionStorage.getItem('token');
                const role = sessionStorage.getItem('role');
                const baseUrl = role === 'assistant' ? 'assistant' : 'admin';

                // Fixed the syntax error here - added closing bracket for the axios.delete call
                await axios.delete(`${BaseUrl}/api/${baseUrl}/organization/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                setOrganizations(organizations.filter(org => org._id !== id));
                toast.success('Organization deleted successfully');
                fetchOrganizationStats();
                fetchOrganizations();
            } catch (error) {
                console.error('Error deleting organization:', error);
                toast.error('Failed to delete organization');
            }
        }
    };

    const handleAddOrganization = () => {
        setNewOrganization({ name: '', email: '', password: '' });
        setModalType("add");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (modalType === "add") {
            try {
                setActionLoading(true);
                const token = sessionStorage.getItem('token');
                const response = await axios.post(`${BaseUrl}/api/organization/register`, newOrganization, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.data.status === 'success') {
                    toast.success('Organization registered successfully');
                    setOrganizations([...organizations, response.data.body]);
                    setShowModal(false);
                    fetchOrganizationStats();
                }
            } catch (error) {
                console.error('Error registering organization:', error);
                toast.error(error.response?.data?.message || 'Failed to register organization');
            } finally {
                setActionLoading(false);
            }
        } else if (modalType === "edit") {
            try {
                setActionLoading(true);
                const token = sessionStorage.getItem('token');
                const role = sessionStorage.getItem('role');
                const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

                // Determine the base URL based on role and adminPortal
                const baseUrl = adminPortal ? 'admin' : 'assistant';

                const response = await axios.put(
                    `${BaseUrl}/api/${baseUrl}/organization/${selectedOrganization._id}`,
                    selectedOrganization,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );

                if (response.data.status === 'success') {
                    toast.success('Organization updated successfully');
                    setOrganizations(organizations.map(org =>
                        org._id === selectedOrganization._id ? response.data.body : org
                    ));
                    setShowModal(false);
                    fetchOrganizationStats();
                }
            } catch (error) {
                console.error('Error updating organization:', error);
                toast.error(error.response?.data?.message || 'Failed to update organization');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrganization({ ...newOrganization, [name]: value });
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilterSelect = (filter) => {
        setActiveFilter(filter);
        setPage(0);
        handleClose();
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(0); // Reset to first page when searching
    };

    const getFilteredOrganizations = () => {
        let filteredOrgs = [...organizations];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredOrgs = filteredOrgs.filter(org =>
                org.companyName?.toLowerCase().includes(query) ||
                org.name.toLowerCase().includes(query)
            );
        }

        // Apply active/inactive filter
        if (activeFilter === "active") {
            filteredOrgs = filteredOrgs.filter(org => org.active === true);
        } else if (activeFilter === "inactive") {
            filteredOrgs = filteredOrgs.filter(org => org.active === false);
        }

        // Apply pagination
        return filteredOrgs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedOrganization(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update the handleView function in the main component
    const handleView = async (organization) => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

            if (!adminPortal) {
                toast.error('Access denied');
                return;
            }

            // Determine API endpoint based on role
            const baseUrl = role === 'Admin'
                ? `${BaseUrl}/api/admin`
                : `${BaseUrl}/api/assistant`;

            const response = await axios.get(
                `${baseUrl}/organization/${organization._id}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.status === 'success') {
                setSelectedOrganization(response.data.body);
                setModalType('view');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching organization details:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch organization details');
        }
    };

    // Add this new function to handle CSV download
    const handleDownloadCSV = () => {
        // Filter organizations based on current search and filter
        const filteredOrgs = organizations.filter(org => {
            const matchesSearch = searchQuery ?
                (org.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    org.name.toLowerCase().includes(searchQuery.toLowerCase())) :
                true;

            if (activeFilter === "active") return matchesSearch && org.active === true;
            if (activeFilter === "inactive") return matchesSearch && org.active === false;
            return matchesSearch;
        });

        // Define CSV headers and data
        const headers = [
            'Organization Name',
            'Company Name',
            'Email',
            'Phone',
            'Address',
            'Status',
            'Verification',
            'Founder',
            'Certificate',
            'Established Date',
            'Subscription Start',
            'Subscription End',
            'Clinicians Count'
        ];

        // Transform data into CSV format
        const csvData = filteredOrgs.map(org => [
            org.name,
            org.companyName || 'N/A',
            org.email,
            org.mobile || 'N/A',
            org.address || 'N/A',
            org.active ? 'Active' : 'Inactive',
            org.verified ? 'Verified' : 'Unverified',
            org.founder || 'N/A',
            org.established ? new Date(org.established).toLocaleDateString() : 'N/A',
            org.subscription?.startDate ? new Date(org.subscription.startDate).toLocaleDateString() : 'N/A',
            org.subscription?.endDate ? new Date(org.subscription.endDate).toLocaleDateString() : 'N/A',
            org.subscription?.clinicians || 'N/A'
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `organizations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                                    path={mdiOfficeBuilding}
                                    size={1.5}
                                    color="#ffffff"
                                    style={{
                                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                                    }}
                                />
                            </div>
                            <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                                Organization Management
                            </span>
                        </div>
                        <Tooltip
                            title={
                                <Box sx={{ p: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        Organization Management
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                        <li>
                                            Manage and monitor all registered organizations
                                        </li>
                                        <li>
                                            Track active and inactive organization status
                                        </li>
                                        <li>
                                            Monitor subscription details and user counts
                                        </li>
                                        <li>
                                            View analytics and performance metrics
                                        </li>
                                    </ul>

                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                                        Tip: Use filters and search to quickly find specific organizations
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
                                    maxWidth: 350
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
                        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} mb={4}>
                            {/* Total Organizations Card */}
                            <ModernMetricCard
                                title="All Organizations"
                                value={organizationStats.totalOrganizations || 0}
                                icon={mdiChartLine}
                                gradient="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
                                percentage="100.0% Total"
                            />

                            {/* Active Organizations Card */}
                            <ModernMetricCard
                                title="Active Organizations"
                                value={organizationStats.activeOrganizations || 0}
                                icon={mdiDomain}
                                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                percentage={`${((organizationStats.activeOrganizations / organizationStats.totalOrganizations) * 100 || 0).toFixed(1)}% of total`}
                            />

                            {/* Inactive Organizations Card */}
                            <ModernMetricCard
                                title="Inactive Organizations"
                                value={organizationStats.inactiveOrganizations || 0}
                                icon={mdiAccountGroup}
                                gradient="linear-gradient(135deg, #02aab0 0%, #00cdac 100%)"
                                percentage={`${((organizationStats.inactiveOrganizations / organizationStats.totalOrganizations) * 100 || 0).toFixed(1)}% of total`}
                            />
                        </Box>

                        <StyledTableContainer sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            overflow: 'hidden'
                        }}>
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
                                        component="h2"
                                        sx={{
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Organization Details
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
                                            placeholder="Search organizations..."
                                            value={searchQuery}
                                            onChange={handleSearch}
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
                                        {`Found ${organizations.filter(org =>
                                            org.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            org.name.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).length} results`}
                                    </Box>
                                </Box>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <DownloadButton
                                        onClick={handleDownloadCSV}
                                        startIcon={<Icon path={mdiDownload} size={0.8} />}
                                    >
                                        Download CSV
                                    </DownloadButton>
                                    <StyledFilterButton
                                        onClick={handleFilterClick}
                                        startIcon={
                                            <Icon path={mdiFilter}
                                                size={0.8}
                                                color={Boolean(anchorEl) ? "#3b82f6" : "#64748b"}
                                            />
                                        }
                                        endIcon={
                                            <FilterBadge active={activeFilter !== 'all'}>
                                                {activeFilter === 'all' ? 'All' :
                                                    activeFilter === 'active' ? 'Active' : 'Inactive'}
                                            </FilterBadge>
                                        }
                                    >
                                        Filter
                                    </StyledFilterButton>
                                    <StyledFilterMenu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                    >
                                        <StyledMenuItem
                                            onClick={() => handleFilterSelect('all')}
                                            selected={activeFilter === 'all'}
                                        >
                                            <FilterIcon selected={activeFilter === 'all'}>
                                                <Icon path={mdiViewList} size={0.6} />
                                            </FilterIcon>
                                            All Organizations
                                            {activeFilter === 'all' && (
                                                <Icon
                                                    path={mdiCheck}
                                                    size={0.6}
                                                    color="#3b82f6"
                                                    style={{ marginLeft: 'auto' }}
                                                />
                                            )}
                                        </StyledMenuItem>
                                        <StyledMenuItem
                                            onClick={() => handleFilterSelect('active')}
                                            selected={activeFilter === 'active'}
                                        >
                                            <FilterIcon selected={activeFilter === 'active'}>
                                                <Icon path={mdiCheckCircle} size={0.6} />
                                            </FilterIcon>
                                            Active Organizations
                                            {activeFilter === 'active' && (
                                                <Icon
                                                    path={mdiCheck}
                                                    size={0.6}
                                                    color="#3b82f6"
                                                    style={{ marginLeft: 'auto' }}
                                                />
                                            )}
                                        </StyledMenuItem>
                                        <StyledMenuItem
                                            onClick={() => handleFilterSelect('inactive')}
                                            selected={activeFilter === 'inactive'}
                                        >
                                            <FilterIcon selected={activeFilter === 'inactive'}>
                                                <Icon path={mdiCloseCircle} size={0.6} />
                                            </FilterIcon>
                                            Inactive Organizations
                                            {activeFilter === 'inactive' && (
                                                <Icon
                                                    path={mdiCheck}
                                                    size={0.6}
                                                    color="#3b82f6"
                                                    style={{ marginLeft: 'auto' }}
                                                />
                                            )}
                                        </StyledMenuItem>
                                    </StyledFilterMenu>
                                    {isAdminPortal && (
                                        <Button
                                            variant="contained"
                                            onClick={handleAddOrganization}
                                            startIcon={<Icon path={mdiPlus} size={1} />}
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
                                            Add Organization
                                        </Button>
                                    )}
                                </div>
                            </TableHeaderBox>
                            <StyledTable>
                                <StyledTableHead>
                                    <TableRow>
                                        <StyledHeaderCell sx={{ width: '20%' }}>Organization Info</StyledHeaderCell>
                                        <StyledHeaderCell sx={{ width: '20%' }}>Company Details</StyledHeaderCell>
                                        <StyledHeaderCell sx={{ width: '25%' }}>Contact & Social</StyledHeaderCell>
                                        <StyledHeaderCell sx={{ width: '20%' }}>Subscription Details</StyledHeaderCell>
                                        <StyledHeaderCell sx={{ width: '15%' }}>Actions</StyledHeaderCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {getFilteredOrganizations().map((org) => (
                                        <StyledTableRow key={org._id}>
                                            <StyledTableCell>
                                                <Box display="flex" flexDirection="column" alignItems="center">
                                                    <AnimatedAvatar
                                                        alt={org.name}
                                                        src={org.image}
                                                        sx={{ width: 60, height: 60, marginBottom: 1 }}
                                                    >
                                                        {org.name.charAt(0)}
                                                    </AnimatedAvatar>
                                                    <Typography variant="subtitle2">{org.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{org.email}</Typography>
                                                    <Box mt={1} display="flex" gap={0.5}>
                                                        <Chip
                                                            label={org.verified ? "Verified" : "Unverified"}
                                                            size="small"
                                                            color={org.verified ? "success" : "warning"}
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                        <Chip
                                                            label={org.active ? "Active" : "Inactive"}
                                                            size="small"
                                                            color={org.active ? "success" : "error"}
                                                            sx={{ fontSize: '0.7rem' }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="500">
                                                        <IconWrapper>
                                                            <FaBuilding />
                                                        </IconWrapper>
                                                        {org.companyName || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" mt={1}>
                                                        <IconWrapper>
                                                            <FaCalendarAlt />
                                                        </IconWrapper>
                                                        Est: {org.established ? new Date(org.established).toLocaleDateString() : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" mt={1}>
                                                        <IconWrapper>
                                                            <FaUserTie />
                                                        </IconWrapper>
                                                        Founder: {org.founder || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box>
                                                    <Typography variant="body2">
                                                        <IconWrapper>
                                                            <FaMapMarkerAlt />
                                                        </IconWrapper>
                                                        {org.address || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" mt={1}>
                                                        <IconWrapper>
                                                            <FaPhone />
                                                        </IconWrapper>
                                                        {org.mobile || 'N/A'}
                                                    </Typography>
                                                    <Box mt={1} display="flex" gap={1}>
                                                        {org.socialProfile?.linkedin && (
                                                            <Tooltip title="LinkedIn">
                                                                <IconButton size="small" href={org.socialProfile.linkedin} target="_blank">
                                                                    <FaLinkedin color="#0077B5" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {org.socialProfile?.twitter && (
                                                            <Tooltip title="Twitter">
                                                                <IconButton size="small" href={org.socialProfile.twitter} target="_blank">
                                                                    <FaTwitter color="#1DA1F2" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {org.socialProfile?.facebook && (
                                                            <Tooltip title="Facebook">
                                                                <IconButton size="small" href={org.socialProfile.facebook} target="_blank">
                                                                    <FaFacebook color="#1877F2" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                        {org.socialProfile?.instagram && (
                                                            <Tooltip title="Instagram">
                                                                <IconButton size="small" href={org.socialProfile.instagram} target="_blank">
                                                                    <FaInstagram color="#E4405F" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                {org.subscription ? (
                                                    <Box display="flex" flexDirection="column" gap={1}>
                                                        <Typography variant="body2">
                                                            <IconWrapper>
                                                                <FaUsers />
                                                            </IconWrapper>
                                                            Clinicians: {org.subscription.clinicians}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <IconWrapper>
                                                                <Icon path={mdiCalendarCheck} size={0.8} />
                                                            </IconWrapper>
                                                            Start: {new Date(org.subscription.startDate).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            <IconWrapper>
                                                                <Icon path={mdiCalendarClock} size={0.8} />
                                                            </IconWrapper>
                                                            End: {new Date(org.subscription.endDate).toLocaleDateString()}
                                                        </Typography>
                                                        {org.subscription.renewal && (
                                                            <Chip
                                                                label="Auto Renewal"
                                                                size="small"
                                                                color="success"
                                                                sx={{ width: 'fit-content' }}
                                                            />
                                                        )}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No active subscription
                                                    </Typography>
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box display="flex" gap={1} justifyContent="center">
                                                    <ActionButton onClick={() => handleView(org)}>
                                                        <ViewIcon fontSize="small" color="primary" />
                                                    </ActionButton>
                                                    <ActionButton onClick={() => handleEdit(org)}>
                                                        <EditIcon fontSize="small" color="primary" />
                                                    </ActionButton>
                                                    <ActionButton onClick={() => handleDelete(org._id)}>
                                                        <DeleteIcon fontSize="small" color="error" />
                                                    </ActionButton>
                                                </Box>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </StyledTable>
                            <TablePagination
                                component="div"
                                count={organizations.filter(org => {
                                    const matchesSearch = searchQuery ?
                                        (org.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            org.name.toLowerCase().includes(searchQuery.toLowerCase())) :
                                        true;

                                    if (activeFilter === "active") return matchesSearch && org.active === true;
                                    if (activeFilter === "inactive") return matchesSearch && org.active === false;
                                    return matchesSearch;
                                }).length}
                                page={page}
                                onPageChange={(event, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25]}
                                sx={{
                                    borderTop: '1px solid rgba(224, 224, 224, 0.4)',
                                    backgroundColor: '#fff',
                                    borderBottomLeftRadius: '24px',
                                    borderBottomRightRadius: '24px',
                                    '& .MuiTablePagination-toolbar': {
                                        padding: '16px 24px',
                                    },
                                    '& .MuiTablePagination-select': {
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        marginRight: '16px',
                                        border: '1px solid rgba(224, 224, 224, 0.4)',
                                    },
                                }}
                            />
                        </StyledTableContainer>
                    </Container>
                </>
            )}

            <StyledDialog
                open={showModal}
                onClose={() => {
                    setShowModal(false);
                    setNewOrganization({ name: '', email: '', password: '' });
                    setSelectedOrganization(null);
                }}
                maxWidth="md"
                fullWidth
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 500 }}
            >
                <StyledDialogTitle>
                    <div className="icon-container">
                        <Icon
                            path={modalType === "add" ? mdiPlus : mdiPencil}
                            size={1.2}
                            color="#fff"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                        />
                    </div>
                    {modalType === "add" ? "Add New Organization" : "Edit Organization"}
                </StyledDialogTitle>
                <StyledDialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Organization Name"
                            name="name"
                            value={modalType === "add" ? newOrganization.name : selectedOrganization?.name || ''}
                            onChange={modalType === "add" ? handleInputChange : handleEditInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={modalType === "add" ? newOrganization.email : selectedOrganization?.email || ''}
                            onChange={modalType === "add" ? handleInputChange : handleEditInputChange}
                            fullWidth
                            required
                        />
                        {modalType === "add" && (
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                value={newOrganization.password}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                        )}
                        {modalType === "edit" && (
                            <>
                                <TextField
                                    label="Company Name"
                                    name="companyName"
                                    value={selectedOrganization?.companyName || ''}
                                    onChange={handleEditInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Mobile"
                                    name="mobile"
                                    value={selectedOrganization?.mobile || ''}
                                    onChange={handleEditInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={selectedOrganization?.address || ''}
                                    onChange={handleEditInputChange}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </>
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
                                setShowModal(false);
                                setNewOrganization({ name: '', email: '', password: '' });
                                setSelectedOrganization(null);
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
                            disabled={actionLoading}
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
                            {actionLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                modalType === "add" ? "Add Organization" : "Save Changes"
                            )}
                        </Button>
                    </Box>
                </StyledDialogContent>
            </StyledDialog>

            {modalType === "view" && (
                <DetailModal
                    organization={selectedOrganization}
                    open={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedOrganization(null);
                    }}
                />
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </StyledDashboard>
    );
};

export default OrganizationPage;


