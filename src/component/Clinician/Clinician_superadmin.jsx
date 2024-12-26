import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import Icon from '@mdi/react';
import { mdiDoctor, mdiStethoscope, mdiChartLine, mdiPlus, mdiDownload } from '@mdi/js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card_circle from '../../assets/circle.png';
import './ClinicianPage.scss';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { FaEllipsisV } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { Card, Typography, Box, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, Modal, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TablePagination, useMediaQuery, useTheme, CircularProgress, Backdrop, Paper, Chip, Tooltip, LinearProgress, Badge } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Menu as MenuIcon, Visibility as VisibilityIcon, RemoveRedEye as ViewIcon, Close as CloseIcon, Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon, Star as StarIcon } from '@mui/icons-material';
import { styled, alpha, ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Container, Row, Col } from 'react-bootstrap';
import { mdiAlertCircleOutline, mdiMagnify } from '@mdi/js';
import { FaUserMd, FaGraduationCap, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
// import { Grid, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Grid from '@mui/material/Grid';
import BaseUrl from '../../api';


// Define the theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff4081',
            dark: '#9a0036',
            contrastText: '#fff',
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        fontFamily: "'Poppins', sans-serif",
    },
});

// Metric Card Component
const MetricCard = ({ title, value, icon, gradient, percentage }) => (
    <Card
        sx={{
            height: '160px',
            background: gradient,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
            }
        }}
        onClick={onClick}
    >
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }} className='d-flex align-items-center gap-2'>
            <img src={Card_circle} className="trendy-card-img-absolute" alt="circle" />
            <Typography variant="h6" fontWeight="normal">
                {title}
            </Typography>
            <Icon path={icon} size={1.5} color="rgba(255,255,255,0.8)" style={{ opacity: 0.6, }} />
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
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//     boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
//     borderRadius: theme.shape.borderRadius * 3,
//     overflow: 'hidden',
//     background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
//     backdropFilter: 'blur(20px)',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
// }));

const TableHeaderBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '24px 24px 0 0',
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: 'bold',
    color: theme.palette.common.white,
    background: status === 'Active'
        ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
        : 'linear-gradient(45deg, #e74c3c, #c0392b)',
    padding: '10px 15px',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
    },
}));

const IconWrapper = styled('span')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
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

// const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
//     color: theme.palette.common.black,
//     fontWeight: '500',
//     textTransform: 'uppercase',
//     fontSize: '0.9rem',
//     lineHeight: '1.5rem',
//     letterSpacing: '0.05em',
//     padding: theme.spacing(2),
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(odd)': {
//         // backgroundColor: theme.palette.action.hover,
//     },
//     '&:hover': {
//         // backgroundColor: theme.palette.action.selected,
//         transition: 'all 0.3s ease',
//         //   transform: 'translateY(-2px)',
//         // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//     },
// }));

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     padding: '16px 24px',
//     fontSize: '0.875rem',
//     color: theme.palette.text.secondary,
//     '& .MuiBox-root': {
//         maxWidth: '250px', // Adjust this value based on your needs
//     },
//     '& .MuiTypography-root': {
//         wordBreak: 'break-word',
//         whiteSpace: 'normal',
//         lineHeight: '1.5',
//     },
//     '& .MuiChip-root': {
//         margin: '2px',
//         maxWidth: '100%',
//         '& .MuiChip-label': {
//             whiteSpace: 'normal',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             display: '-webkit-box',
//             '-webkit-line-clamp': 2,
//             '-webkit-box-orient': 'vertical',
//         }
//     }
// }));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
    border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledChip = styled(Chip)(({ theme, variant }) => ({
    fontWeight: 'bold',
    borderRadius: '20px',
    padding: '0 10px',
    height: 28,
    fontSize: '0.75rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    background: variant === 'status'
        ? 'linear-gradient(45deg, #2ecc71, #27ae60)'
        : theme.palette.background.default,
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
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

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .MuiInputBase-root': {
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.9)',
        '&:hover': {
            background: 'rgba(255, 255, 255, 1)',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
}));

// Add these new styled components at the top of the file
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

// Update the ModernMetricCard component
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

// Add this with other styled components at the top of the file
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    borderTop: '1px solid rgba(224, 224, 224, 0.4)',
    backgroundColor: '#fff',
    borderBottomLeftRadius: theme.shape.borderRadius * 3,
    borderBottomRightRadius: theme.shape.borderRadius * 3,
    '& .MuiTablePagination-toolbar': {
        padding: '16px 24px',
        '& .MuiTablePagination-selectLabel': {
            marginBottom: 0,
        },
        '& .MuiTablePagination-displayedRows': {
            marginBottom: 0,
        },
    },
    '& .MuiTablePagination-select': {
        borderRadius: theme.shape.borderRadius,
        padding: '8px 12px',
        marginRight: theme.spacing(2),
        border: '1px solid rgba(224, 224, 224, 0.4)',
        '&:focus': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    '& .MuiTablePagination-actions': {
        marginLeft: theme.spacing(2),
        '& button': {
            padding: '8px',
            borderRadius: '50%',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
        },
    },
}));

const DetailModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiPaper-root': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '24px',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
    }
}));

// Add this styled component with your other styled components
const ViewIconButton = styled(IconButton)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    padding: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.25)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    },
    '& .MuiSvgIcon-root': {
        color: 'white',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
    },
    '&:hover .MuiSvgIcon-root': {
        transform: 'scale(1.1)',
    },
}));

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


const EditDialog = styled(Dialog)(({ theme }) => ({
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

// Add this to your existing styled components
const EditIconButton = styled(IconButton)(({ theme }) => ({
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    padding: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)',
    },
    '& .MuiSvgIcon-root': {
        color: 'white',
        fontSize: '1.2rem',
    }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: 'white',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '50%',
        width: '35px',
        height: '35px',
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: '#3a9d00',
        },
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '2px solid #44b700',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(1)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(1.4)',
            opacity: 0,
        },
    },
}));

const ImageContainer = styled(Box)({
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

// Add these styled components
const ModalContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    maxHeight: '90vh',
    overflow: 'auto',
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    padding: 0,
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
    },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    padding: theme.spacing(3),
    borderRadius: '24px 24px 0 0',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1,
}));

const InfoSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    margin: theme.spacing(2),
    transition: 'transform 0.3s ease',
    '&:hover': {
        // transform: 'translateY(-4px)',
    },
}));

const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};

// Add this styled component with the other styled components
const TableHeaderButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '12px',
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35)',
        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    },
    '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
    },
}));

// const AddClinicianDialog = ({ open, onClose }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);

//     const handleInputChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const response = await axios.post(
//                 `${BaseUrl}/api/auth/doctor-register`,
//                 formData
//             );

//             if (response.data.status === 'success') {
//                 toast.success(response.data.message);
//                 onClose();
//                 // Refresh the clinicians list
//                 fetchClinicians();
//             }
//         } catch (error) {
//             console.error('Error creating clinician:', error);
//             toast.error(error.response?.data?.message || 'Failed to create clinician');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Dialog
//             open={open}
//             onClose={onClose}
//             PaperProps={{
//                 sx: {
//                     borderRadius: '16px',
//                     padding: '16px',
//                     minWidth: '400px'
//                 }
//             }}
//         >
//             <DialogTitle sx={{
//                 background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
//                 color: 'white',
//                 borderRadius: '8px'
//             }}>
//                 Add New Clinician
//             </DialogTitle>
//             <DialogContent>
//                 <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
//                     <TextField
//                         name="name"
//                         label="Name"
//                         fullWidth
//                         required
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         name="email"
//                         label="Email"
//                         type="email"
//                         fullWidth
//                         required
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         sx={{ mb: 2 }}
//                     />
//                     <TextField
//                         name="password"
//                         label="Password"
//                         type="password"
//                         fullWidth
//                         required
//                         value={formData.password}
//                         onChange={handleInputChange}
//                         sx={{ mb: 2 }}
//                     />
//                     <DialogActions>
//                         <Button onClick={onClose} color="inherit">
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             disabled={loading}
//                             sx={{
//                                 background: 'linear-gradient(45deg, #7a990a, #9cb50f)',
//                                 '&:hover': {
//                                     background: 'linear-gradient(45deg, #9cb50f, #7a990a)',
//                                 }
//                             }}
//                         >
//                             {loading ? <CircularProgress size={24} /> : 'Add Clinician'}
//                         </Button>
//                     </DialogActions>
//                 </Box>
//             </DialogContent>
//         </Dialog>
//     );
// };



const EditClinicianDialog = ({ open, onClose, clinician, onSave }) => {
    const [formData, setFormData] = useState({
        name: clinician?.name || '',
        email: clinician?.email || '',
        mobileNum: clinician?.mobileNum || '',
        specializedIn: clinician?.specializedIn || '',
        about: clinician?.about || '',
        experience: clinician?.experience || '',
        location: clinician?.location || ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (clinician) {
            setFormData({
                name: clinician.name || '',
                email: clinician.email || '',
                mobileNum: clinician.mobileNum || '',
                specializedIn: clinician.specializedIn || '',
                about: clinician.about || '',
                experience: clinician.experience || '',
                location: clinician.location || ''
            });
        }
    }, [clinician]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const adminPortal = sessionStorage.getItem('adminPortal');

            if (adminPortal === 'true' && clinician?._id) {
                const url = role === 'Admin'
                    ? `${BaseUrl}/api/admin/doctors/${clinician._id}`
                    : `${BaseUrl}/api/assistant/doctors/${clinician._id}`;

                const response = await axios.put(url, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    toast.success('Clinician updated successfully');
                    onSave(response.data.body);
                    onClose();
                }
            }
        } catch (error) {
            console.error('Error updating clinician:', error);
            toast.error(error.response?.data?.message || 'Failed to update clinician');
        } finally {
            setLoading(false);
        }
    };

    return (
        <EditDialog open={open} onClose={onClose}>
            <StyledDialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EditIcon />
                    Edit Clinician
                </Box>
            </StyledDialogTitle>
            <StyledDialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        name="name"
                        label="Name"
                        fullWidth
                        value={formData.name}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="mobileNum"
                        label="Mobile Number"
                        fullWidth
                        value={formData.mobileNum}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="specializedIn"
                        label="Specialization"
                        fullWidth
                        value={formData.specializedIn}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="experience"
                        label="Experience"
                        fullWidth
                        value={formData.experience}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="location"
                        label="Location"
                        fullWidth
                        value={formData.location}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        name="about"
                        label="About"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.about}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </Box>
            </StyledDialogContent>
            <StyledDialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
            </StyledDialogActions>
        </EditDialog>
    );
};

// Update the renderActionsCell function in the ClinicianPage component
// const renderActionsCell = (clinician) => (
//     <StyledTableCell align="center">
//         <Box sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             gap: 1
//         }}>
//             <Tooltip title="Edit" arrow placement="top">
//                 <EditIconButton onClick={() => handleEditClick(clinician)}>
//                     <EditIcon />
//                 </EditIconButton>
//             </Tooltip>
//             {/* ... existing action buttons ... */}
//         </Box>
//     </StyledTableCell>
// );


const ClinicianPage = () => {
    const [activeTab, setActiveTab] = useState("allClinicians");
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("add");
    const [selectedClinician, setSelectedClinician] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [clinicians, setClinicians] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [clinicianCounts, setClinicianCounts] = useState({
        total: 0,
        activeCount: 0,
        inactiveCount: 0
    });
    const [userRole, setUserRole] = useState('');
    const [myClinicians, setMyClinicians] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
    const [adminPortal, setAdminPortal] = useState('');
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedClinicianForEdit, setSelectedClinicianForEdit] = useState(null);



    useEffect(() => {
        setAdminPortal(sessionStorage.getItem('adminPortal'));
        console.log(adminPortal);
    }, []);

    useEffect(() => {
        getUserRole();
        fetchClinicians();
        fetchClinicianCounts();
    }, []);

    const getUserRole = () => {
        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        if (role) {
            setUserRole(role);
        } else if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role);
                sessionStorage.setItem('role', payload.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setUserRole('');
            }
        }
    };

    const getAuthHeaders = () => {
        const token = sessionStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    const AddClinicianDialog = ({ open, onClose }) => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: ''
        });
        const [loading, setLoading] = useState(false);

        const handleInputChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            try {
                const response = await axios.post(
                    `${BaseUrl}/api/auth/doctor-register`,
                    formData
                );

                if (response.data.status === 'success') {
                    toast.success(response.data.message);
                    onClose();
                    // Refresh the clinicians list
                    fetchClinicians();
                }
            } catch (error) {
                console.error('Error creating clinician:', error);
                toast.error(error.response?.data?.message || 'Failed to create clinician');
            } finally {
                setLoading(false);
            }
        };

        return (
            <StyledDialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        padding: '16px',
                        minWidth: '400px'
                    }
                }}
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
                    Add New Clinician
                </StyledDialogTitle>
                <StyledDialogContent>
                    <Box onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            name="name"
                            label="Name"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            mt: 4
                        }}>
                            <DialogActions>
                                <Button onClick={onClose}
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
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
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
                                    {loading ? <CircularProgress size={24} /> : 'Add Clinician'}
                                </Button>
                            </DialogActions>
                        </Box>
                    </Box>
                </StyledDialogContent>
            </StyledDialog>
        );
    };

    const fetchClinicians = async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            const adminPortal = sessionStorage.getItem('adminPortal');

            if (adminPortal === 'true') {
                let url;
                if (role === 'Admin') {
                    url = `${BaseUrl}/api/admin/doctors`;
                } else if (role === 'assistant') {
                    url = `${BaseUrl}/api/assistant/doctors`;
                }

                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    setClinicians(response.data.body);
                }
            }
        } catch (error) {
            console.error('Error fetching clinicians:', error);
            toast.error('Failed to fetch clinicians');
        } finally {
            setLoading(false);
        }
    };

    const fetchClinicianCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            let url;

            if (role === 'manager') {
                url = `${BaseUrl}/api/manager/clinicians-counts`;
            } else if (role === 'Admin') {
                url = `${BaseUrl}/api/admin/doctors-counts`;
            } else if (role === 'assistant') {
                url = `${BaseUrl}/api/assistant/doctors-counts`;
            } else {
                url = `${BaseUrl}/api/organization/doctors/count`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                if (role === 'manager') {
                    setClinicianCounts({
                        total: response.data.body.totalClinisists,
                        activeCount: response.data.body.activeClinisists,
                        inactiveCount: response.data.body.inactiveClinisists
                    });
                } else {
                    setClinicianCounts(response.data.body);
                }
            }
        } catch (error) {
            console.error('Error fetching clinician counts:', error);
            toast.error('Failed to fetch clinician counts');
        }
    };

    // previous code
    // const fetchMyClinicians = async () => {
    //     try {
    //         const token = sessionStorage.getItem('token');
    //         const response = await axios.get(`${BaseUrl}/api/organization/my-doctors`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });

    //         if (response.data.status === 'success') {
    //             setMyClinicians(response.data.body);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching my clinicians:', error);
    //         toast.error('Failed to fetch clinicians added by you');
    //     }
    // };

    const fetchMyClinicians = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');
            let url;
            if (role === 'organization') {
                url = `${BaseUrl}/api/organization/my-doctors`;
            }
            // Clinicians added by Admin
            else if (role === 'Admin') {
                url = ''
            }
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                setMyClinicians(response.data.body);
            }
        } catch (error) {
            console.error('Error fetching my clinicians:', error);
            toast.error('Failed to fetch clinicians added by you');
        }
    };

    const activeClinicians = clinicians.filter(clinician => clinician.Active === 'yes');
    const inactiveClinicians = clinicians.filter(clinician => clinician.Active === 'no');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    };

    const handleDateChange = (type) => (date) => {
        setDateRange(prev => ({ ...prev, [type]: date }));
    };

    const filterCliniciansByDateRange = (clinicians) => {
        if (!dateRange.from && !dateRange.to) return clinicians;

        return clinicians.filter(clinician => {
            const joinedDate = new Date(clinician.createdAt);
            if (dateRange.from && dateRange.to) {
                return joinedDate >= dateRange.from && joinedDate <= dateRange.to;
            } else if (dateRange.from) {
                return joinedDate >= dateRange.from;
            } else if (dateRange.to) {
                return joinedDate <= dateRange.to;
            }
            return true;
        });
    };

    const getPaginatedClinicians = () => {
        const filtered = filterCliniciansByDateRange(clinicians);
        return filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    const handleEdit = (clinician) => {
        setSelectedClinician(clinician);
        setImagePreview(clinician.avatar);
        setModalType("edit");
        setShowModal(true);
    };

    const handleEditClick = (clinician) => {
        setSelectedClinicianForEdit(clinician);
        setEditDialogOpen(true);
    };

    const handleEditSave = (updatedClinician) => {
        setClinicians(prevClinicians =>
            prevClinicians.map(c =>
                c._id === updatedClinician._id ? updatedClinician : c
            )
        );
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to recover this clinician!",
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

                let url;
                if (role === 'manager') {
                    url = `${BaseUrl}/api/manager/delete-doctor/${id}`;
                } else if (role === 'Admin') {
                    url = `${BaseUrl}/api/admin/doctors/${id}`;
                } else if (role === 'assistant') {
                    url = `${BaseUrl}/api/assistant/doctors/${id}`;
                } else {
                    url = `${BaseUrl}/api/organization/delete-doctor/${id}`;
                }

                const response = await axios.delete(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    // Remove the deleted clinician from the list
                    setClinicians(prevClinicians => prevClinicians.filter(c => c._id !== id));
                    fetchClinicians();
                    fetchClinicianCounts();
                    Swal.fire(
                        'Deleted!',
                        response.data.message || 'The clinician has been deleted.',
                        'success'
                    );
                }
            }
        } catch (error) {
            console.error('Error deleting clinician:', error);
            toast.error('Failed to delete clinician');
        } finally {
            setActionLoading(false);
        }
    };

    const handleSave = async () => {
        setActionLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const role = sessionStorage.getItem('role');

            if (modalType === "edit" && selectedClinician) {
                const { _id, name, email } = selectedClinician;
                let url, data;

                if (role === 'manager') {
                    url = `${BaseUrl}/api/manager/update-doctor/${_id}`;
                } else if (role === 'Admin') {
                    url = `${BaseUrl}/api/admin/doctors/${_id}`;
                } else if (role === 'assistant') {
                    url = `${BaseUrl}/api/assistant/doctors/${_id}`;
                } else {
                    url = `${BaseUrl}/api/organization/update-doctor/${_id}`;
                }
                data = { name, email };

                const response = await axios.put(url, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    // Update the clinician in the existing list
                    setClinicians(prevClinicians =>
                        prevClinicians.map(c => c._id === _id ? response.data.body : c)
                    );
                    toast.success(response.data.message || 'Clinician updated successfully!');
                }
            } else if (modalType === "add" && selectedClinician) {
                const { name, email, password } = selectedClinician;
                let url, data;

                if (role === 'manager') {
                    url = `${BaseUrl}/api/manager/register-doctor`;
                    data = { name, email, password };
                } else {
                    url = `${BaseUrl}/api/organization/register-doctor`;
                    data = { name, email, password };
                }

                const response = await axios.post(url, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.status === 'success') {
                    // Add the new clinician to the existing list
                    setClinicians(prevClinicians => [...prevClinicians, response.data.body]);
                    toast.success(response.data.message || 'New clinician added successfully!');
                }
            }
            setShowModal(false);
            setSelectedClinician(null); // Reset selected clinician after saving
        } catch (error) {
            console.error('Error saving clinician:', error);
            toast.error(error.response?.data?.message || 'Failed to save clinician');
        } finally {
            setActionLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedClinician(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setSelectedClinician({ ...selectedClinician, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget); // Open dropdown
    };

    const handleClose = () => {
        setAnchorEl(null); // Close dropdown
    };

    const handleFilterSelect = (filter) => {
        setActiveTab(filter); // Set the active tab based on selection
        setPage(0); // Reset page to 0
        handleClose(); // Close dropdown
    };

    const handleViewDetails = async (doctorId) => {
        try {
            setModalLoading(true);
            const token = sessionStorage.getItem('token');
            const adminPortal = sessionStorage.getItem('adminPortal');

            if (adminPortal === 'true') {
                const response = await axios.get(
                    `${BaseUrl}/api/patients/get-doctor/${doctorId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.status === 'success') {
                    setSelectedDoctor(response.data.body);
                    setDetailModalOpen(true);
                } else {
                    toast.error('Failed to fetch doctor details');
                }
            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
            toast.error('Failed to fetch doctor details');
        } finally {
            setModalLoading(false);
        }
    };

    const renderDoctorCell = (clinician) => (
        <StyledTableCell>
            <Box display="flex" alignItems="center">
                <StyledAvatar
                    src={clinician.image}
                    alt={clinician.name}
                    sx={{
                        width: 60,
                        height: 60,
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        marginRight: 2
                    }}
                >
                    {clinician.name.charAt(0)}
                </StyledAvatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                        {clinician.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {clinician.degree || 'N/A'}
                    </Typography>
                </Box>
            </Box>
        </StyledTableCell>
    );

    const renderActionsCell = (clinician) => (
        <StyledTableCell align="center">
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                '& .MuiIconButton-root': {
                    transition: 'all 0.3s ease',
                }
            }}>

                <Tooltip
                    title="View Details"
                    arrow
                    placement="top"
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <ActionButton
                            color="view"
                            onClick={() => handleViewDetails(clinician._id)}
                            sx={{
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                }
                            }}
                        >
                            <VisibilityIcon />
                        </ActionButton>
                    </span>
                </Tooltip>
                <Tooltip
                    title="Edit Clinician"
                    arrow
                    placement="top"
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <ActionButton
                            color="view"
                            onClick={() => handleEditClick(clinician)}
                            sx={{
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                }
                            }}
                        >
                            <EditIcon />
                        </ActionButton>
                    </span>
                </Tooltip>
                <Tooltip
                    title="Delete Clinician"
                    arrow
                    placement="top"
                    TransitionProps={{ timeout: 600 }}
                >
                    <span>
                        <ActionButton
                            color="delete"
                            onClick={() => handleDelete(clinician._id)}
                            sx={{
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                }
                            }}
                        >
                            <DeleteIcon />
                        </ActionButton>
                    </span>
                </Tooltip>
            </Box>
        </StyledTableCell>
    );

    // Add this helper function to safely format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    // Update the Career Timeline section in DetailModal
    const DetailModal = () => {
        if (!selectedDoctor) return null;

        return (
            <Modal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                aria-labelledby="doctor-detail-modal"
            >
                <ModalContainer>
                    {modalLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <ModalHeader>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h5" fontWeight="bold" color="white">
                                        Doctor Profile
                                    </Typography>
                                    <IconButton
                                        onClick={() => setDetailModalOpen(false)}
                                        sx={{ color: 'white' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </ModalHeader>

                            <Box p={3}>
                                {/* Professional Info Section */}
                                <InfoSection>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <Box display="flex" justifyContent="center">
                                                <Avatar
                                                    src={selectedDoctor.image}
                                                    alt={selectedDoctor.name}
                                                    sx={{ width: 150, height: 150, border: '4px solid white', boxShadow: 3 }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Typography variant="h4" gutterBottom>
                                                {selectedDoctor.name}
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                                <Chip
                                                    label={selectedDoctor.specializedIn}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={selectedDoctor.degree || 'N/A'}
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    icon={<StarIcon />}
                                                    label={`${selectedDoctor.ratings} Rating`}
                                                    color="warning"
                                                />
                                            </Box>
                                            <Typography variant="body1" gutterBottom>
                                                {selectedDoctor.about}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Experience: {selectedDoctor.experience}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </InfoSection>

                                {/* License & Registration Section */}
                                <InfoSection>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        License & Registration
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={2} sx={{ p: 2 }}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    License Number
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedDoctor.licenseNumber}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={2} sx={{ p: 2 }}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    NPI Number
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedDoctor.npiNumber}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={2} sx={{ p: 2 }}>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    License Expiration
                                                </Typography>
                                                <Typography variant="body1">
                                                    {new Date(selectedDoctor.licenseExpirationDate).toLocaleDateString()}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </InfoSection>

                                {/* Services Section */}
                                <InfoSection>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Services Offered
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedDoctor.services}
                                    </Typography>
                                </InfoSection>

                                {/* Career Timeline Section */}
                                <InfoSection>
                                    <Typography variant="h6" gutterBottom color="primary">
                                        Career Path
                                    </Typography>
                                    {selectedDoctor.careerpath && selectedDoctor.careerpath.length > 0 ? (
                                        <Timeline>
                                            {selectedDoctor.careerpath.map((career, index) => (
                                                <TimelineItem key={career._id || index}>
                                                    <TimelineSeparator>
                                                        <TimelineDot
                                                            color="primary"
                                                            sx={{
                                                                boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                                                            }}
                                                        />
                                                        {index < selectedDoctor.careerpath.length - 1 && (
                                                            <TimelineConnector sx={{ bgcolor: 'primary.light' }} />
                                                        )}
                                                    </TimelineSeparator>
                                                    <TimelineContent>
                                                        <Paper
                                                            elevation={2}
                                                            sx={{
                                                                p: 2,
                                                                '&:hover': {
                                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                                    transform: 'translateY(-2px)',
                                                                    transition: 'all 0.3s ease'
                                                                }
                                                            }}
                                                        >
                                                            <Typography variant="h6" color="primary.main">
                                                                {career.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="text.secondary"
                                                                sx={{ mb: 1 }}
                                                            >
                                                                {formatDate(career.startDate)} - {formatDate(career.endDate)}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                                {career.description || 'No description available'}
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    gap: 1,
                                                                    flexWrap: 'wrap',
                                                                    mt: 1
                                                                }}
                                                            >
                                                                {career.specialty && (
                                                                    <Chip
                                                                        label={career.specialty}
                                                                        size="small"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            borderRadius: '4px',
                                                                            '& .MuiChip-label': {
                                                                                px: 1
                                                                            }
                                                                        }}
                                                                    />
                                                                )}
                                                                {career.organizationName && (
                                                                    <Chip
                                                                        label={career.organizationName}
                                                                        size="small"
                                                                        color="secondary"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            borderRadius: '4px',
                                                                            '& .MuiChip-label': {
                                                                                px: 1
                                                                            }
                                                                        }}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Paper>
                                                    </TimelineContent>
                                                </TimelineItem>
                                            ))}
                                        </Timeline>
                                    ) : (
                                        <Box
                                            sx={{
                                                p: 3,
                                                textAlign: 'center',
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                color: 'text.secondary'
                                            }}
                                        >
                                            <Typography variant="body1">
                                                No career history available
                                            </Typography>
                                        </Box>
                                    )}
                                </InfoSection>
                            </Box>
                        </>
                    )}
                </ModalContainer>
            </Modal>
        );
    };

    // Add these styled components
    const ActionIconButton = styled(IconButton)(({ theme, color }) => ({
        background: color === 'view'
            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        padding: '8px',
        marginRight: '8px',
        transition: 'all 0.3s ease',
        boxShadow: `0 2px 8px ${color === 'view' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${color === 'view' ? 'rgba(99, 102, 241, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
        },
        '& .MuiSvgIcon-root': {
            color: 'white',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
        },
        '&:hover .MuiSvgIcon-root': {
            transform: 'scale(1.1)',
        },
    }));

    const getFilteredClinicians = () => {
        if (!searchQuery) return clinicians;

        return clinicians.filter(clinician => {
            const searchString = searchQuery.toLowerCase();
            return (
                clinician.name?.toLowerCase().includes(searchString) ||
                clinician.email?.toLowerCase().includes(searchString) ||
                clinician.specializedIn?.toLowerCase().includes(searchString)
            );
        });
    };

    // Add this utility function near the top of the file
    const convertToCSV = (clinicians) => {
        // Define headers for CSV
        const headers = [
            'Name',
            'Email',
            'Mobile Number',
            'Specialization',
            'Experience',
            'Location',
            'Status',
            'Ratings'
        ];

        // Convert clinicians data to CSV rows
        const rows = clinicians.map(clinician => [
            clinician.name,
            clinician.email,
            clinician.mobileNum || 'N/A',
            clinician.specializedIn || 'N/A',
            clinician.experience || 'N/A',
            clinician.location || 'N/A',
            clinician.Active === 'yes' ? 'Active' : 'Inactive',
            clinician.ratings || 'N/A'
        ]);

        // Combine headers and rows
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    };

    // Add this styled component with your other styled components
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

    // Inside your ClinicianPage component, add this function
    const handleDownloadCSV = () => {
        const csvData = convertToCSV(getFilteredClinicians());
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'clinicians_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <ThemeProvider theme={theme}>
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
                                        path={mdiDoctor}
                                        size={1.5}
                                        color="#ffffff"
                                        style={{
                                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                                        }}
                                    />
                                </div>
                                <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                                    Clinician Management
                                </span>
                            </div>
                            <Tooltip
                                title={
                                    <Box sx={{ p: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Clinician Management
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            A comprehensive platform for managing healthcare professionals:
                                        </Typography>
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                            <li>View and manage all clinicians in your network</li>
                                            <li>Track active and inactive clinician status</li>
                                            <li>Access detailed professional profiles and credentials</li>
                                            <li>Monitor performance metrics and ratings</li>
                                            <li>Review career history and specializations</li>
                                            <li>Manage licensing and certification information</li>
                                        </ul>
                                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                                            Use the search option to efficiently manage your clinical staff.
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
                                <ModernMetricCard
                                    title="All Clinicians"
                                    value={clinicianCounts.total || 0}
                                    icon={mdiChartLine}
                                    gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                                    percentage="100% of Total"
                                />
                                <ModernMetricCard
                                    title="Active Clinicians"
                                    value={clinicianCounts.activeCount || 0}
                                    icon={mdiDoctor}
                                    gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                                    percentage={`${((clinicianCounts.activeCount / clinicianCounts.total) * 100).toFixed(1)}% of total`}
                                />
                                <ModernMetricCard
                                    title="Inactive Clinicians"
                                    value={clinicianCounts.inactiveCount || 0}
                                    icon={mdiStethoscope}
                                    gradient="linear-gradient(135deg, #02aab0 0%, #00cdac 100%)"
                                    percentage={`${((clinicianCounts.inactiveCount / clinicianCounts.total) * 100).toFixed(1)}% of total`}
                                />
                            </Box>

                            <Grid item xs={12}>
                                <StyledTableContainerHeader
                                    sx={{
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
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                Clinician Details
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3,
                                                position: 'relative',
                                                zIndex: 1
                                            }}>
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
                                                    placeholder="Search clinicians..."
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

                                            {/* Add this button before the Add Clinician button */}
                                            <DownloadButton
                                                startIcon={<Icon path={mdiDownload} size={1} />}
                                                onClick={handleDownloadCSV}
                                            >
                                                Download CSV
                                            </DownloadButton>

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
                                                Add Clinician
                                            </Button>
                                            {sessionStorage.getItem('adminPortal') === 'true' && (
                                                <AddClinicianDialog
                                                    open={openDialog}
                                                    onClose={() => setOpenDialog(false)}
                                                />
                                            )}
                                        </Box>
                                    </TableHeaderBox>

                                    {/* <StyledTableContainer sx={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                overflow: 'hidden'
                            }}> */}
                                    <StyledTableContainer className="border-radius-0">
                                        <StyledTable>
                                            <StyledTableHead>
                                                <TableRow>
                                                    <StyledHeaderCell sx={{ width: '20%' }}>Doctor Information</StyledHeaderCell>
                                                    <StyledHeaderCell sx={{ width: '20%' }}>Specialization & Experience</StyledHeaderCell>
                                                    <StyledHeaderCell sx={{ width: '15%' }}>Contact Details</StyledHeaderCell>
                                                    <StyledHeaderCell sx={{ width: '20%' }}>Career History</StyledHeaderCell>
                                                    <StyledHeaderCell sx={{ width: '15%' }}>Performance & Status</StyledHeaderCell>
                                                    <StyledHeaderCell sx={{ width: '10%' }} align="center">Actions</StyledHeaderCell>
                                                </TableRow>
                                            </StyledTableHead>
                                            <TableBody>
                                                {getFilteredClinicians()
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((clinician) => (
                                                        <StyledTableRow key={clinician._id}>
                                                            {renderDoctorCell(clinician)}
                                                            <StyledTableCell>
                                                                <Box display="flex" flexDirection="column" alignItems="flex-start">
                                                                    <Tooltip title={clinician.specializedIn} arrow>
                                                                        <Chip
                                                                            icon={<FaUserMd />}
                                                                            label={clinician.specializedIn}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            sx={{ mb: 1 }}
                                                                        />
                                                                    </Tooltip>
                                                                    <Box display="flex" alignItems="center" mb={1}>
                                                                        <IconWrapper>
                                                                            <FaGraduationCap />
                                                                        </IconWrapper>
                                                                        <Typography variant="body2" color="textSecondary">
                                                                            {clinician.experince || 'N/A'}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {clinician.about ? (
                                                                            <div>
                                                                                {clinician.about.split('\n').map((line, index) => (
                                                                                    <p key={index}>{line}</p>
                                                                                ))}
                                                                            </div>
                                                                        ) : 'No description available'}
                                                                    </Typography>
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Box>
                                                                    <Typography variant="body2">
                                                                        <IconWrapper>
                                                                            <FaMapMarkerAlt />
                                                                        </IconWrapper>
                                                                        {clinician.location || 'Location not specified'}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <IconWrapper>📱</IconWrapper>
                                                                        {clinician.mobileNum}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <IconWrapper>📧</IconWrapper>
                                                                        {clinician.email}
                                                                    </Typography>
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Typography variant="body2" sx={{ mb: 1 }}>
                                                                    {clinician.highlights || 'No highlights available'}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {clinician.careerpath?.map((career, idx) => (
                                                                        <Tooltip
                                                                            key={idx}
                                                                            title={`${career.description} | ${formatDate(career.startDate)} - ${formatDate(career.endDate)}`}
                                                                            arrow
                                                                        >
                                                                            <Chip
                                                                                label={`${career.name}`}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                sx={{ margin: '2px' }}
                                                                            />
                                                                        </Tooltip>
                                                                    ))}
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                <Box sx={{ mb: 1 }}>
                                                                    <Chip
                                                                        icon={<FaStar style={{ color: '#ffc107' }} />}
                                                                        label={`Rating: ${clinician.ratings || 'N/A'}`}
                                                                        variant="outlined"
                                                                        size="small"
                                                                    />
                                                                </Box>
                                                                <StatusChip
                                                                    label={clinician.Active === 'yes' ? 'Active' : 'Inactive'}
                                                                    status={clinician.Active === 'yes' ? 'Active' : 'Inactive'}
                                                                />
                                                            </StyledTableCell>
                                                            {renderActionsCell(clinician)}
                                                        </StyledTableRow>
                                                    ))}
                                            </TableBody>
                                        </StyledTable>
                                        <StyledTablePagination
                                            component="div"
                                            count={getFilteredClinicians().length}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            rowsPerPageOptions={[5, 10, 25]}
                                        />
                                    </StyledTableContainer>
                                </StyledTableContainerHeader>
                            </Grid>
                        </Container>
                    </>
                )}
                <ToastContainer position="top-right" autoClose={3000} />
            </StyledDashboard>
            <DetailModal />
            {/* {sessionStorage.getItem('adminPortal') === 'true' && (
                <AddClinicianDialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                />
            )} */}
            <EditClinicianDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                clinician={selectedClinicianForEdit}
                onSave={handleEditSave}
            />
        </ThemeProvider>
    );
};

export default ClinicianPage;