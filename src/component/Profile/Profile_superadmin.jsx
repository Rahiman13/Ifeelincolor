import React, { useState, useEffect, useRef } from "react";
import { useTheme } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Modal,
  TextField,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Backdrop,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from "@material-ui/core";
import { makeStyles, alpha } from "@material-ui/core/styles";
import Icon from '@mdi/react';
import {
  mdiEmail,
  mdiPhone,
  mdiMapMarkerOutline,
  mdiDomain,
  mdiAccountTie,
  mdiCalendarCheck,
  mdiShieldCheck,
  mdiFacebook,
  mdiTwitter,
  mdiInstagram,
  mdiLinkedin,
  mdiShieldCrown,
  mdiShareVariant,
  mdiAccountEdit,
  mdiCloudUpload,
  mdiBriefcaseUpload,
  mdiCamera,
  mdiAccountGroup,
  mdiAccountSupervisor,
  mdiAccount,
  mdiAccountPlus,
  mdiBriefcaseOutline,
  mdiShieldLock
} from '@mdi/js';
import { motion } from "framer-motion";
import axios from 'axios';
import { Edit as EditIcon } from '@material-ui/icons';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Fade } from '@material-ui/core';
import { TreeView, TreeItem } from '@material-ui/lab';
import ProfileFlowchartSuperadmin from './Profile_flowchart_superadmin';
import OrgChart from "@dabeng/react-orgchart";
// import "@dabeng/react-orgchart/dist/ReactOrgChart.css";
import BaseUrl from '../../api';



const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    // Get ordinal suffix for day (1st, 2nd, 3rd, etc.)
    const getOrdinalSuffix = (n) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return {
      formatted: `${month} ${getOrdinalSuffix(day)}, ${year}`,
      age: age,
      month: month,
      year: year,
      isOld: age >= 10
    };
  } catch (error) {
    console.error('Date formatting error:', error);
    return { formatted: 'N/A', age: 0, month: '', year: '', isOld: false };
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4),
    background: `linear-gradient(135deg, #f8f9fc 0%, #f1f4f8 100%)`,
    backgroundImage: `
      radial-gradient(at 40% 20%, rgba(0,0,255,0.02) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(0,255,0,0.01) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(255,0,0,0.02) 0px, transparent 50%),
      radial-gradient(at 80% 50%, rgba(0,0,255,0.01) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(0,255,0,0.02) 0px, transparent 50%),
      radial-gradient(at 80% 100%, rgba(255,0,0,0.01) 0px, transparent 50%)
    `,
    minHeight: '100vh',
  },
  contentWrapper: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  profileSection: {
    marginBottom: theme.spacing(4),
  },
  profileHeader: {
    background: `linear-gradient(135deg, ${alpha('#1a1c1e', 0.95)} 0%, ${alpha('#2c3e50', 0.85)} 100%)`,
    backdropFilter: 'blur(10px)',
    borderRadius: '30px',
    padding: theme.spacing(6),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `
      0 20px 40px ${alpha('#000', 0.3)},
      0 0 0 1px ${alpha('#fff', 0.1)} inset
    `,
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      textAlign: 'center',
    },
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  avatarSection: {
    position: 'relative',
    width: 'fit-content',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -15,
      left: -15,
      right: -15,
      bottom: -15,
      background: `conic-gradient(
        from 0deg,
        ${theme.palette.primary.light},
        ${theme.palette.secondary.main},
        ${theme.palette.primary.light}
      )`,
      borderRadius: '50%',
      animation: '$spin 10s linear infinite',
      opacity: 0.3,
    },
  },
  headerAvatar: {
    width: 200,
    height: 200,
    border: `4px solid ${alpha('#fff', 0.2)}`,
    background: alpha(theme.palette.primary.light, 0.2),
    backdropFilter: 'blur(8px)',
    fontSize: '4rem',
    fontWeight: 600,
    boxShadow: `
      0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)},
      0 8px 24px ${alpha('#000', 0.4)}
    `,
    zIndex: 1,
  },
  nameSection: {
    marginBottom: theme.spacing(2),
  },
  nameTitle: {
    color: '#fff',
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    letterSpacing: '-0.5px',
  },
  roleChip: {
    background: alpha(theme.palette.primary.main, 0.15),
    color: '#fff',
    padding: theme.spacing(1, 3),
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha('#fff', 0.1)}`,
    position: 'absolute',
    top: -10,
    right: 10,
    fontSize: '0.75rem',
    height: '20px',
  },

  adminroleChip: {
    background: alpha(theme.palette.primary.main, 0.15),
    color: '#fff',
    padding: theme.spacing(1, 3),
    borderRadius: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha('#fff', 0.1)}`,
    position: 'absolute',
    top: -10,
    right: 10,
    fontSize: '0.75rem',
    // height: '20px',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  infoItem: {
    background: alpha('#fff', 0.05),
    padding: theme.spacing(2),
    borderRadius: '15px',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha('#fff', 0.1)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      background: alpha('#fff', 0.1),
    },
  },
  infoLabel: {
    color: alpha('#fff', 0.7),
    fontSize: '0.875rem',
    marginBottom: theme.spacing(0.5),
  },
  infoValue: {
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  actionSection: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'scale(1.05)',
      opacity: 0.4,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.8,
    },
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    background: 'white',
    borderRadius: '50%',
    padding: theme.spacing(1),
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  profileInfo: {
    flex: 1,
  },
  roleIcon: {
    background: 'rgba(255,255,255,0.2)',
    padding: theme.spacing(0.5),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '&::after': {
      content: '""',
      position: 'absolute',
      right: -8,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 6,
      height: 6,
      backgroundColor: '#4CAF50',
      borderRadius: '50%',
      boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
    },
  },
  statsContainer: {
    marginTop: theme.spacing(-4),
    marginBottom: theme.spacing(4),
  },
  statCard: {
    background: theme.palette.common.white,
    borderRadius: '30px',
    padding: theme.spacing(4),
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: `linear-gradient(90deg, 
        ${theme.palette.primary.main}, 
        ${theme.palette.secondary.main}, 
        ${theme.palette.primary.main}
      )`,
      backgroundSize: '200% 100%',
      animation: '$gradient 8s linear infinite',
    },
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
    },
  },
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 0%' },
    '100%': { backgroundPosition: '200% 0%' },
  },
  statIcon: {
    background: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '16px',
    padding: theme.spacing(2),
    width: 64,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(10deg) scale(1.1)',
      background: alpha(theme.palette.primary.main, 0.15),
    },
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  infoCard: {
    background: theme.palette.common.white,
    borderRadius: '24px',
    padding: theme.spacing(4),
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '150px',
      height: '150px',
      background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
      borderRadius: '0 0 0 100%',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    gap: theme.spacing(2),
  },
  cardIcon: {
    background: alpha(theme.palette.primary.main, 0.1),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(10deg)',
    },
  },
  infoList: {
    flex: 1,
    '& .MuiListItem-root': {
      borderRadius: 12,
      marginBottom: theme.spacing(2),
      background: alpha(theme.palette.primary.main, 0.03),
      transition: 'all 0.3s ease',
      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.06),
        transform: 'translateX(5px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      },
    },
  },
  editButton: {
    borderRadius: '30px',
    padding: theme.spacing(1.5, 4),
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '&:hover': {
      background: 'rgba(255,255,255,0.3)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  },
  socialLinks: {
    marginTop: theme.spacing(2),
  },
  socialButton: {
    margin: theme.spacing(1),
    borderRadius: '20px',
    padding: theme.spacing(2),
    minWidth: 'unset',
    width: 60,
    height: 60,
    position: 'relative',
    overflow: 'hidden',
    background: theme.palette.common.white,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'inherit',
      borderRadius: 'inherit',
      transform: 'scale(0)',
      transition: 'transform 0.3s ease',
    },
    '&:hover': {
      transform: 'translateY(-4px) rotate(8deg)',
      '&::before': {
        transform: 'scale(1.5)',
      },
    },
  },
  geometricDecoration: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    border: `2px solid ${alpha(theme.palette.common.white, 0.1)}`,
    borderRadius: '30px',
    transform: 'rotate(45deg)',
    zIndex: 0,
  },
  profileMetrics: {
    display: 'flex',
    gap: theme.spacing(4),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  metricItem: {
    textAlign: 'center',
    background: alpha('#fff', 0.05),
    padding: theme.spacing(2, 3),
    borderRadius: '15px',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${alpha('#fff', 0.1)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      background: alpha('#fff', 0.1),
    },
  },
  metricValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.palette.primary.light,
    marginBottom: theme.spacing(0.5),
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: alpha('#fff', 0.7),
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  profileTags: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  profileTag: {
    background: alpha(theme.palette.primary.main, 0.2),
    color: theme.palette.primary.light,
    padding: theme.spacing(0.5, 2),
    borderRadius: '20px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: alpha(theme.palette.primary.main, 0.3),
      transform: 'translateY(-2px)',
    },
  },
  profileStatus: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    background: alpha('#4CAF50', 0.2),
    color: '#4CAF50',
    padding: theme.spacing(0.5, 2),
    borderRadius: '20px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    border: `1px solid ${alpha('#4CAF50', 0.3)}`,
  },
  lastActive: {
    color: alpha('#fff', 0.7),
    fontSize: '0.875rem',
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  hierarchyCard: {
    background: theme.palette.background.paper,
    borderRadius: '16px',
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
  },
  hierarchyTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: theme.spacing(3),
  },
  hierarchyIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: alpha(theme.palette.primary.main, 0.1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
  },
  hierarchyContainer: {
    minHeight: '400px',
  },
  myChart: {
    '& .orgchart': {
      background: 'transparent',
      '& .node': {
        border: 'none',
        borderRadius: '12px',
        padding: '0',
        width: 'auto',
        height: 'auto',
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
      '& .lines': {
        '& .downLine': {
          background: theme.palette.primary.main,
          width: '2px',
        },
        '& .rightLine': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
        '& .leftLine': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
        '& .topLine': {
          border: `2px solid ${theme.palette.primary.main}`,
        },
      },
    },
  },
  levelLabel: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: alpha(theme.palette.primary.main, 0.7),
  },
  treeNodeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%',
  },
  levelContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(4),
    position: 'relative',
  },
  levelTitle: {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    padding: theme.spacing(0.5, 2),
    borderRadius: '20px',
    fontWeight: 600,
    fontSize: '0.875rem',
    marginBottom: theme.spacing(2),
  },
  userCard: {
    background: theme.palette.background.paper,
    borderRadius: '12px',
    padding: theme.spacing(2),
    width: '100%',
    maxWidth: '300px',
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
    },
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  userInfo: {
    flex: 1,
    minWidth: 0, // Prevents text overflow
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.95rem',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userEmail: {
    color: alpha(theme.palette.text.primary, 0.7),
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  connectingLine: {
    position: 'absolute',
    width: '2px',
    background: `linear-gradient(180deg, 
      ${alpha(theme.palette.primary.main, 0.3)},
      ${alpha(theme.palette.primary.main, 0.1)}
    )`,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 0,
  },
  assistantsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing(4),
    width: '100%',
    maxWidth: '1200px',
  },
  assistantColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -20,
      height: '20px',
      width: '2px',
      background: `linear-gradient(180deg, 
        ${alpha(theme.palette.primary.main, 0.3)},
        ${alpha(theme.palette.primary.main, 0.1)}
      )`,
    },
  },
  cliniciansContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -16,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '16px',
      width: '2px',
      background: `linear-gradient(180deg, 
        ${alpha(theme.palette.primary.main, 0.3)},
        ${alpha(theme.palette.primary.main, 0.1)}
      )`,
    },
  },
}));

const CreativeBackground = () => {
  const theme = useTheme();

  return (
    <motion.div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            background: `radial-gradient(circle, 
              ${alpha(theme.palette.primary.main, 0.03)} 0%, 
              transparent 70%
            )`,
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </motion.div>
  );
};

const DecorativeElements = () => {
  const classes = useStyles();

  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={classes.geometricDecoration}
          style={{
            top: `${20 + i * 30}%`,
            right: `${-10 + i * 5}%`,
          }}
          animate={{
            rotate: [45 + i * 15, 90 + i * 15, 45 + i * 15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </>
  );
};

const ImageOverlay = styled(Box)({
  position: 'absolute',
  bottom: 10,
  right: 10,
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '50%',
  padding: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  zIndex: 1000,
  '&:hover': {
    transform: 'scale(1.1)',
    background: 'white',
  }
});

const ImageUploadModal = ({ open, onClose, handleImageUpload, uploading }) => {
  const [selectedCompanyImage, setSelectedCompanyImage] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [companyImagePreview, setCompanyImagePreview] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const companyFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const handleImageSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'company') {
          setSelectedCompanyImage(file);
          setCompanyImagePreview(reader.result);
          toast.success('Company image selected successfully');
        } else {
          setSelectedProfileImage(file);
          setProfileImagePreview(reader.result);
          toast.success('Profile image selected successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      await handleImageUpload(selectedCompanyImage, selectedProfileImage);
      // Reset form after successful upload
      setSelectedCompanyImage(null);
      setSelectedProfileImage(null);
      setCompanyImagePreview('');
      setProfileImagePreview('');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleClose = () => {
    // Reset all states when modal is closed
    setSelectedCompanyImage(null);
    setSelectedProfileImage(null);
    setCompanyImagePreview('');
    setProfileImagePreview('');
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <StyledDialogTitle>
        <div className="icon-wrapper">
          <Icon path={mdiCamera} size={1.2} color="#ffffff" />
        </div>
        <span className="title-text">Update Images</span>
      </StyledDialogTitle>

      <StyledDialogContent>
        {/* Company Image Upload */}
        <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>Company Image</Typography>
        <ImageUploadBox
          onClick={() => companyFileInputRef.current?.click()}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            ref={companyFileInputRef}
            hidden
            accept="image/*"
            onChange={(e) => handleImageSelect(e, 'company')}
          />
          <UploadIcon
            component={motion.div}
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon path={mdiBriefcaseUpload} size={1.5} color="white" />
          </UploadIcon>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {companyImagePreview ? 'Selected Company Logo' : 'Click to Upload Company Logo'}
          </Typography>
          {companyImagePreview && (
            <PreviewImage src={companyImagePreview} alt="Company Preview" />
          )}
        </ImageUploadBox>

        {/* Profile Image Upload */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#1e293b' }}>Profile Image</Typography>
        <ImageUploadBox
          onClick={() => profileFileInputRef.current?.click()}
          component={motion.div}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input
            type="file"
            ref={profileFileInputRef}
            hidden
            accept="image/*"
            onChange={(e) => handleImageSelect(e, 'profile')}
          />
          <UploadIcon
            component={motion.div}
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon path={mdiAccountEdit} size={1.5} color="white" />
          </UploadIcon>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Profile Picture
          </Typography>
          {profileImagePreview && (
            <PreviewImage src={profileImagePreview} alt="Profile Preview" />
          )}
        </ImageUploadBox>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 2,
            color: 'rgba(0, 0, 0, 0.6)',
            fontStyle: 'italic'
          }}
        >
          Supported formats: JPG, PNG, GIF (Max size: 5MB)
        </Typography>
      </StyledDialogContent>

      <StyledDialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
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
          onClick={handleSubmit}
          disabled={!selectedCompanyImage && !selectedProfileImage || uploading}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }
          }}
        >
          {uploading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              <span>Uploading...</span>
            </Box>
          ) : (
            'Upload Images'
          )}
        </Button>
      </StyledDialogActions>
    </StyledDialog>
  );
};

const ProfileHeader = ({ adminData, classes, setEditModalOpen, setPrivacyPolicyOpen }) => {
  const theme = useTheme();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (companyImage, profileImage) => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (!adminPortal || (!companyImage && !profileImage)) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);
    try {
      // Create FormData and append files
      const formData = new FormData();
      if (companyImage) {
        formData.append('companyImage', companyImage);
      }
      if (profileImage) {
        formData.append('image', profileImage);
      }

      // Make the API call
      const response = await axios({
        method: 'PATCH',
        url: `${BaseUrl}/api/admin/update-media`,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        toast.success('Images updated successfully!');
        setImageModalOpen(false);
        // Refresh the page to show updated images
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to update images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload images';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={classes.profileHeader}
    >
      <div className={classes.headerContent}>
        <div className={classes.leftSection}>
          <motion.div
            className={classes.avatarSection}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Avatar
              src={adminData?.companyImage}
              className={classes.headerAvatar}
            >
              {adminData?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            {sessionStorage.getItem('adminPortal') === 'true' && (
              <ImageOverlay
                onClick={() => setImageModalOpen(true)}
                component={motion.div}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon path={mdiCamera} size={1} color="#1e293b" />
              </ImageOverlay>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={classes.adminroleChip}
          >
            <Icon path={mdiShieldCrown} size={0.9} color="white" />
            {adminData?.role || 'Administrator'}
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className={classes.actionSection}
          >
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditModalOpen(true)}
              className={classes.editButton}
            >
              Edit Profile
            </Button>
            {sessionStorage.getItem('adminPortal') === 'true' && (
              <Button
                variant="contained"
                startIcon={<Icon path={mdiShieldLock} size={0.9} />}
                onClick={() => setPrivacyPolicyOpen(true)}
                className={classes.editButton}
                sx={{ ml: 2 }}
              >
                Privacy Policy
              </Button>
            )}
          </motion.div>
        </div>

        <div className={classes.rightSection}>
          <div className={classes.nameSection}>
            <Typography variant="h3" className={classes.nameTitle}>
              {adminData?.name || 'Admin Name'}
            </Typography>
            <Typography variant="subtitle1" style={{ color: alpha('#fff', 0.7) }}>
              {adminData?.email || 'admin@example.com'}
            </Typography>
          </div>

          <div className={classes.infoGrid}>
            <motion.div
              className={classes.infoItem}
              whileHover={{ scale: 1.03 }}
            >
              <Typography className={classes.infoLabel}>Company</Typography>
              <Typography className={classes.infoValue}>
                <Icon path={mdiDomain} size={0.8} />
                {adminData?.companyName || 'Company Name'}
              </Typography>
            </motion.div>

            <motion.div
              className={classes.infoItem}
              whileHover={{ scale: 1.03 }}
            >
              <Typography className={classes.infoLabel}>Location</Typography>
              <Typography className={classes.infoValue}>
                <Icon path={mdiMapMarkerOutline} size={0.8} />
                {adminData?.address || 'Location'}
              </Typography>
            </motion.div>

            <motion.div
              className={classes.infoItem}
              whileHover={{ scale: 1.03 }}
            >
              <Typography className={classes.infoLabel}>Contact</Typography>
              <Typography className={classes.infoValue}>
                <Icon path={mdiPhone} size={0.8} />
                {adminData?.contact?.mobile || 'N/A'}
              </Typography>
            </motion.div>

            <motion.div
              className={classes.infoItem}
              whileHover={{ scale: 1.03 }}
            >
              <Typography className={classes.infoLabel}>Established</Typography>
              <Typography className={classes.infoValue}>
                <Icon path={mdiCalendarCheck} size={0.8} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" style={{
                    color: '#fff',
                    fontWeight: 500
                  }}>
                    {formatDate(adminData?.established).formatted}
                  </Typography>
                  <Typography variant="caption" style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.75rem'
                  }}>
                    {formatDate(adminData?.established).age} years of excellence
                  </Typography>
                </Box>
              </Typography>
            </motion.div>
          </div>

          {adminData?.bio && (
            <motion.div
              className={classes.infoItem}
              style={{ gridColumn: '1 / -1' }}
              whileHover={{ scale: 1.02 }}
            >
              <Typography className={classes.infoLabel}>Bio</Typography>
              <Typography style={{ color: '#fff' }}>
                {adminData.bio}
              </Typography>
            </motion.div>
          )}
        </div>
      </div>

      <CreativeBackground />
      <DecorativeElements />

      <ImageUploadModal
        open={imageModalOpen}
        onClose={() => {
          setImageModalOpen(false);
          setSelectedImage(null);
          setImagePreview('');
        }}
        handleImageUpload={handleImageUpload}
        uploading={uploading}
      />
    </motion.div>
  );
};

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
    display: 'inline-block',
    margin: 0,
  }
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: '32px',
  background: '#ffffff',
  borderRadius: '24px 24px 0 0',
  '& .form-section': {
    '& .section-title': {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1e293b',
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

const ImageUploadBox = styled(Box)(({ theme }) => ({
  borderRadius: '16px',
  padding: '24px',
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
  border: '2px dashed rgba(59, 130, 246, 0.4)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  textAlign: 'center',
  position: 'relative',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
    borderColor: '#3b82f6',
  }
}));

const PreviewImage = styled('img')({
  maxWidth: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginTop: '16px',
});

const UploadIcon = styled(Box)({
  width: '64px',
  height: '64px',
  margin: '0 auto 16px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
});

const UserCard = ({ user, role, color, canAdd, onAdd, addButtonLabel }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.userCard} elevation={0}>
      <Chip
        label={role}
        size="small"
        className={classes.roleChip}
        sx={{
          backgroundColor: alpha(color, 0.1),
          color: color,
          border: `1px solid ${alpha(color, 0.2)}`,
        }}
      />
      <div className={classes.cardContent}>
        <Avatar
          src={user?.image}
          sx={{
            width: 40,
            height: 40,
            bgcolor: alpha(color, 0.1),
            color: color,
            border: `2px solid ${alpha(color, 0.2)}`,
          }}
        >
          {user?.name?.charAt(0) || <Icon path={mdiAccount} size={1} />}
        </Avatar>
        <div className={classes.userInfo}>
          <Typography className={classes.userName}>{user?.name}</Typography>
          <Typography className={classes.userEmail}>{user?.email}</Typography>
        </div>
        {canAdd && (
          <IconButton
            size="small"
            onClick={onAdd}
            sx={{
              backgroundColor: alpha(color, 0.1),
              '&:hover': { backgroundColor: alpha(color, 0.2) },
            }}
          >
            {/* <Icon path={mdiAccountPlus} size={0.9} color={color} /> */}
          </IconButton>
        )}
      </div>
    </Paper>
  );
};

const OrganizationHierarchy = ({ classes }) => {
  const [adminData, setAdminData] = useState(null);
  const [assistants, setAssistants] = useState([]);
  const [clinicians, setClinicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addAssistantDialog, setAddAssistantDialog] = useState(false);
  const [addClinicianDialog, setAddClinicianDialog] = useState(false);
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  const [hierarchyData, setHierarchyData] = useState(null);

  useEffect(() => {
    const fetchHierarchyData = async () => {
      const token = sessionStorage.getItem('token');
      const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

      if (!isAdminPortal || !token) return;

      try {
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };

        const [adminRes, assistantsRes, cliniciansRes] = await Promise.all([
          axios.get(`${BaseUrl}/api/admin/profile`, config),
          axios.get(`${BaseUrl}/api/admin/assistants`, config),
          axios.get(`${BaseUrl}/api/admin/doctors`, config)
        ]);

        // Create hierarchy data structure
        const hierarchyStructure = {
          id: 'admin',
          name: adminRes.data.body.name,
          title: 'Administrator',
          email: adminRes.data.body.email,
          image: adminRes.data.body.image,
          companyName: adminRes.data.body.companyName,
          children: assistantsRes.data.body.map(assistant => ({
            id: assistant._id,
            name: assistant.name,
            title: 'Assistant',
            email: assistant.email,
            image: assistant.image,
            children: cliniciansRes.data.body
              .filter(clinician => clinician.createdBy === assistant._id || adminRes.data.body._id)
              .map(clinician => ({
                id: clinician._id,
                name: clinician.name,
                title: clinician.specializedIn || 'Clinician',
                email: clinician.email,
                image: clinician.image,
                specialization: clinician.specializedIn
              }))
          }))
        };

        setHierarchyData(hierarchyStructure);
        setAdminData(adminRes.data.body);
        setAssistants(assistantsRes.data.body);
        setClinicians(cliniciansRes.data.body);
      } catch (error) {
        console.error('Error fetching hierarchy data:', error);
        toast.error('Failed to load organization hierarchy');
      } finally {
        setLoading(false);
      }
    };

    fetchHierarchyData();
  }, []);

  const handleAddAssistant = async (formData) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${BaseUrl}/api/admin/create-assistant`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setAssistants([...assistants, response.data.body]);
        toast.success('Assistant added successfully!');
        setAddAssistantDialog(false);
      }
    } catch (error) {
      console.error('Error adding assistant:', error);
      toast.error(error.response?.data?.message || 'Failed to add assistant');
    }
  };

  const handleAddClinician = async (formData) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${BaseUrl}/api/assistant/create-doctor`,
        { ...formData, assistantId: selectedAssistantId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setClinicians([...clinicians, response.data.body]);
        toast.success('Clinician added successfully!');
        setAddClinicianDialog(false);
      }
    } catch (error) {
      console.error('Error adding clinician:', error);
      toast.error(error.response?.data?.message || 'Failed to add clinician');
    }
  };

  const NodeTemplate = ({ nodeData }) => {
    return (
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          width: 'auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Avatar
            src={nodeData.image}
            style={{
              width: 80,
              height: 80,
              border: '2px solid',
              fontSize: '1.8rem',
              fontWeight: 600,
              borderColor: nodeData.title === 'Administrator' ? '#3b82f6' :
                nodeData.title === 'Assistant' ? '#0891b2' : '#059669',
              backgroundColor: alpha(
                nodeData.title === 'Administrator' ? '#3b82f6' :
                  nodeData.title === 'Assistant' ? '#0891b2' : '#059669',
                0.1
              )
            }}

          >
            {/* <Icon path={mdiAccount} size={1.5} /> */}
            {nodeData.name?.charAt(0) || <Icon path={mdiAccount} size={1.5} />}
          </Avatar>

          {/* <div style={{ flex: 1 }}> */}
          <div>
            <Typography
              variant="subtitle1"
              style={{
                color: '#fff',
                fontWeight: 600,
                marginBottom: '4px'
              }}
            >
              {nodeData.name}
            </Typography>
            {/* <Typography
              variant="subtitle2"
              style={{
                color: '#fff',
                fontWeight: 400,
                marginBottom: '4px',
                fontSize: '0.8rem'
              }}
            >
              {nodeData.companyName}
            </Typography> */}
            <Chip
              label={nodeData.companyName || nodeData.title}
              size="small"
              sx={{
                backgroundColor: alpha(
                  nodeData.title === 'Administrator' ? '#3b82f6' :
                    nodeData.title === 'Assistant' ? '#0891b2' : '#059669',
                  0.1
                ),
                color: nodeData.title === 'Administrator' ? '#3b82f6' :
                  nodeData.title === 'Assistant' ? '#0891b2' : '#059669',
                border: '1px solid',
                borderColor: alpha(
                  nodeData.title === 'Administrator' ? '#3b82f6' :
                    nodeData.title === 'Assistant' ? '#0891b2' : '#059669',
                  0.2
                ),
                '& .MuiChip-label': {
                  fontWeight: 500,
                }
              }}
            />
            <Typography
              variant="body2"
              style={{
                color: alpha('#fff', 0.7),
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                marginTop: '8px',
              }}
            >
              <Icon path={mdiEmail} size={0.7} />
              {nodeData.email}
            </Typography>
          </div>

          {nodeData.title !== 'Administrator' && nodeData.title !== 'Assistant' && (
            <IconButton
              size="small"
              onClick={() => handleAddMember(nodeData)}
              sx={{
                backgroundColor: alpha('#059669', 0.1),
                '&:hover': {
                  backgroundColor: alpha('#059669', 0.2),
                },
              }}
            >
              <Icon path={mdiAccountPlus} size={0.9} color="#059669" />
            </IconButton>
          )}
        </div>


        {/* <div
          style={{
            marginTop: '12px',
            padding: '8px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Typography
            variant="body2"
            style={{
              color: alpha('#fff', 0.7),
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
            }}
          >
            <Icon path={mdiEmail} size={0.7} />
            {nodeData.email}
          </Typography>

          {nodeData.specialization && (
            <Typography
              variant="body2"
              style={{
                color: alpha('#fff', 0.7),
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                marginTop: '4px',
              }}
            >
              <Icon path={mdiBriefcaseOutline} size={0.7} />
              {nodeData.specialization}
            </Typography>
          )}
        </div> */}
      </div>
    );
  };

  return (
    <Paper className={classes.hierarchyCard} elevation={0}>
      <div className={classes.hierarchyTitle}>
        <div className={classes.hierarchyIcon}>
          <Icon path={mdiAccountGroup} size={1.2} />
        </div>
        <Typography variant="h6" style={{ fontWeight: 600 }}>
          Organization Hierarchy
        </Typography>
      </div>

      <div className={classes.hierarchyContainer}>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : hierarchyData ? (
          <Box sx={{ overflowX: 'auto', py: 4 }}>
            <OrgChart
              datasource={hierarchyData}
              collapsible={false}
              pan={true}
              zoom={true}
              NodeTemplate={NodeTemplate}
              chartClass={classes.myChart}
            />
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            No hierarchy data available
          </Typography>
        )}
      </div>

      {/* Add Member Dialogs */}
      <AddMemberDialog
        open={addAssistantDialog}
        onClose={() => setAddAssistantDialog(false)}
        onSubmit={handleAddAssistant}
        title="Add New Assistant"
        role="Assistant"
      />

      <AddMemberDialog
        open={addClinicianDialog}
        onClose={() => setAddClinicianDialog(false)}
        onSubmit={handleAddClinician}
        title="Add New Clinician"
        role="Clinician"
      />
    </Paper>
  );
};

const AddMemberDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  role
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: {
      mobile: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', password: '', contact: { mobile: '' } });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mobile Number"
            value={formData.contact.mobile}
            onChange={(e) => setFormData({
              ...formData,
              contact: { ...formData.contact, mobile: e.target.value }
            })}
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Add {role}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const PrivacyPolicyDialog = ({ open, onClose, isAdmin }) => {
  const [privacyData, setPrivacyData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await axios.get('http://18.209.44.54:3000/api/privacy/latest');
      if (response.data.status === 'success') {
        setPrivacyData(response.data.body);
        setFormData({
          title: response.data.body.title,
          content: response.data.body.content
        });
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      toast.error('Failed to load privacy policy');
    }
  };

  const handleCreateUpdate = async () => {
    const token = sessionStorage.getItem('token');
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (!isAdminPortal) {
      toast.error('Unauthorized to modify privacy policy');
      return;
    }

    try {
      const payload = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      let response;
      if (privacyData?._id) {
        // Update existing policy
        response = await axios.put(
          `http://18.209.44.54:3000/api/privacy/update/${privacyData._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Create new policy
        response = await axios.post(
          'http://18.209.44.54:3000/api/privacy/create',
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      if (response.data.status === 'success') {
        toast.success('Privacy policy updated successfully');
        setPrivacyData(response.data.body);
        setEditMode(false);
        fetchPrivacyPolicy();
      }
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      toast.error('Failed to update privacy policy');
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <div className="icon-wrapper">
          <Icon path={mdiShieldLock} size={1.2} color="#ffffff" />
        </div>
        <span className="title-text">Privacy Policy</span>
      </StyledDialogTitle>

      <StyledDialogContent>
        {editMode ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              fullWidth
              multiline
              rows={8}
              margin="normal"
            />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {privacyData?.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {privacyData?.content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Last updated: {new Date(privacyData?.updatedAt).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </StyledDialogContent>

      <StyledDialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        {isAdmin && (
          <>
            {editMode ? (
              <Button
                onClick={handleCreateUpdate}
                variant="contained"
                color="primary"
              >
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={() => setEditMode(true)}
                variant="contained"
                color="primary"
              >
                Edit Policy
              </Button>
            )}
          </>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default function ProfilePage() {
  const classes = useStyles();
  const theme = useTheme();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    address: '',
    founderName: '',
    established: '',
    bio: '',
    contact: {
      email: '',
      mobile: ''
    },
    socialMediaLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      email: ''
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [companyImage, setCompanyImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [companyImagePreview, setCompanyImagePreview] = useState('');
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const isAdmin = sessionStorage.getItem('adminPortal') === 'true';

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');
      const assistant = sessionStorage.getItem('assistant');

      if (!token || !role) {
        setError('Unauthorized. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        let response;
        if (role.toLowerCase() === 'assistant') {
          response = await axios.get(
            `${BaseUrl}/api/assistant/profile`,
            config
          );
        } else {
          response = await axios.get(
            `${BaseUrl}/api/admin/profile`,
            config
          );
        }

        if (response.data.status === 'success') {
          const profileData = response.data.body;
          setAdminData(profileData);
          setEditFormData({
            companyName: profileData.companyName || '',
            image: profileData.image || '',
            founderName: profileData.founderName || '',
            established: profileData.established || '',
            name: profileData.name || '',
            email: profileData.email || '',
            address: profileData.address || '',
            bio: profileData.bio || '',
            contact: {
              email: profileData.contact?.email || '',
              mobile: profileData.contact?.mobile || ''
            },
            socialMediaLinks: {
              facebook: profileData.socialProfile?.facebook || '',
              twitter: profileData.socialProfile?.twitter || '',
              instagram: profileData.socialProfile?.instagram || '',
              linkedin: profileData.socialProfile?.linkedin || ''
            }
          });
          // toast.success('Profile loaded successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        toast.error(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImagePreview(reader.result);
        } else {
          setCompanyImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (!adminPortal) {
      toast.error('Unauthorized to edit profile');
      return;
    }

    try {
      const updateData = {
        name: editFormData.name,
        email: editFormData.email,
        companyName: editFormData.companyName,
        address: editFormData.address,
        founderName: editFormData.founderName,
        established: editFormData.established,
        bio: editFormData.bio,
        contact: editFormData.contact,
        socialMediaLinks: editFormData.socialMediaLinks
      };

      const response = await axios.put(
        `${BaseUrl}/api/admin/update-info`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        setAdminData(response.data.body);
        setEditModalOpen(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const privacyPolicyButton = (
    <Button
      variant="contained"
      startIcon={<Icon path={mdiShieldLock} size={0.9} />}
      onClick={() => setPrivacyPolicyOpen(true)}
      className={classes.editButton}
      sx={{ ml: 2 }}
    >
      Privacy Policy
    </Button>
  );

  if (loading) {
    return (
      <Backdrop
        open={true}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: '#fff',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="primary" size={60} />
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              mt: 2,
              fontWeight: 500
            }}
          >
            Loading Profile...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container className={classes.root}>
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
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
      <Container maxWidth="lg" className={classes.root}>
        <div className={classes.contentWrapper}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <section className={classes.profileSection}>
              <ProfileHeader
                adminData={adminData}
                classes={classes}
                setEditModalOpen={setEditModalOpen}
                setPrivacyPolicyOpen={setPrivacyPolicyOpen}
              />
            </section>

            <section className={classes.statsContainer}>
              <Grid container spacing={3}>
                {[
                  { icon: mdiDomain, label: 'Company', value: adminData?.companyName },
                  {
                    icon: mdiCalendarCheck,
                    label: 'Established',
                    value: formatDate(adminData?.established).formatted,
                    subValue: `${formatDate(adminData?.established).age} years in business`,
                    highlight: formatDate(adminData?.established).isOld
                  },
                  { icon: mdiAccountTie, label: 'Founder', value: adminData?.founderName }
                ].map((stat, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Paper
                        className={classes.statCard}
                        elevation={0}
                        sx={{
                          background: stat.highlight ?
                            'linear-gradient(135deg, rgba(255,223,186,0.1) 0%, rgba(255,223,186,0.05) 100%)' :
                            undefined
                        }}
                      >
                        <div className={classes.statIcon}>
                          <Icon
                            path={stat.icon}
                            size={1.2}
                            color={stat.highlight ? theme.palette.primary.main : undefined}
                          />
                        </div>
                        <Typography
                          variant="h5"
                          gutterBottom
                          style={{
                            fontWeight: 600,
                            color: stat.highlight ? theme.palette.primary.main : undefined
                          }}
                        >
                          {stat.value || 'N/A'}
                        </Typography>
                        {stat.subValue && (
                          <Typography
                            variant="caption"
                            display="block"
                            style={{
                              color: stat.highlight ?
                                alpha(theme.palette.primary.main, 0.8) :
                                'text.secondary',
                              marginTop: -8
                            }}
                          >
                            {stat.subValue}
                          </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          {stat.label}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </section>

            <section className={classes.infoSection}>
              <Paper className={classes.infoCard} elevation={0}>
                <div className={classes.cardHeader}>
                  <div className={classes.cardIcon}>
                    <Icon path={mdiDomain} size={1.2} />
                  </div>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Company Information
                  </Typography>
                </div>
                <List className={classes.infoList}>
                  {[
                    { icon: mdiMapMarkerOutline, label: 'Address', value: adminData?.address },
                    { icon: mdiAccountTie, label: 'Founder', value: adminData?.founderName },
                    {
                      icon: mdiCalendarCheck,
                      label: 'Established',
                      value: (
                        <Box>
                          <Typography variant="body1" style={{ fontWeight: 500 }}>
                            {formatDate(adminData?.established).formatted}
                          </Typography>
                          <Typography
                            variant="caption"
                            style={{
                              color: theme.palette.primary.main,
                              display: 'block',
                              marginTop: 2
                            }}
                          >
                            A legacy of {formatDate(adminData?.established).age} years
                          </Typography>
                        </Box>
                      )
                    }
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Icon path={item.icon} size={1} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.value || 'Not specified'}
                        primaryTypographyProps={{ style: { fontWeight: 500 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper className={classes.infoCard} elevation={0}>
                <div className={classes.cardHeader}>
                  <div className={classes.cardIcon}>
                    <Icon path={mdiPhone} size={1.2} />
                  </div>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Contact Details
                  </Typography>
                </div>
                <List className={classes.infoList}>
                  {[
                    { icon: mdiEmail, label: 'Email', value: adminData?.contact?.email || adminData?.email },
                    { icon: mdiPhone, label: 'Mobile', value: adminData?.contact?.mobile }
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Icon path={item.icon} size={1} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.value || 'Not specified'}
                        primaryTypographyProps={{ style: { fontWeight: 500 } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper className={classes.infoCard} elevation={0}>
                <div className={classes.cardHeader}>
                  <div className={classes.cardIcon}>
                    <Icon path={mdiShareVariant} size={1.2} />
                  </div>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Social Media
                  </Typography>
                </div>
                <div className={classes.socialLinks}>
                  {[
                    { icon: mdiFacebook, link: adminData?.socialMediaLinks?.facebook, color: '#1877F2' },
                    { icon: mdiTwitter, link: adminData?.socialMediaLinks?.twitter, color: '#1DA1F2' },
                    { icon: mdiInstagram, link: adminData?.socialMediaLinks?.instagram, color: '#E4405F' },
                    { icon: mdiLinkedin, link: adminData?.socialMediaLinks?.linkedin, color: '#0A66C2' },
                  ].map((social, index) => (
                    social.link && (
                      <Button
                        key={index}
                        className={classes.socialButton}
                        style={{
                          backgroundColor: alpha(social.color, 0.1),
                          background: `linear-gradient(135deg, ${alpha(social.color, 0.2)} 0%, ${alpha(social.color, 0.1)} 100%)`,
                        }}
                        component={motion.div}
                        whileHover={{
                          scale: 1.1,
                          rotate: 8,
                        }}
                        whileTap={{ scale: 0.95 }}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(social.link, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <Icon path={social.icon} size={1} color={social.color} />
                      </Button>
                    )
                  ))}
                </div>
              </Paper>
            </section>
          </motion.div>

          {sessionStorage.getItem('adminPortal') === 'true' && (
            <OrganizationHierarchy classes={classes} />
            // <ProfileFlowchartSuperadmin />
          )}
        </div>
      </Container>

      <StyledDialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <div className="icon-wrapper">
            <Icon path={mdiAccountEdit} size={1.2} color="#ffffff" />
          </div>
          <span className="title-text">Edit Profile</span>
        </StyledDialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleEditSubmit}>
            {/* Basic Information */}
            <div className="form-section">
              <div className="section-title">Basic Information</div>
              <TextField
                label="Name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Bio"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </div>

            {/* Company Information */}
            <div className="form-section">
              <div className="section-title">Company Information</div>
              <TextField
                label="Company Name"
                value={editFormData.companyName}
                onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Founder Name"
                value={editFormData.founderName}
                onChange={(e) => setEditFormData({ ...editFormData, founderName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Established Date"
                type="date"
                value={editFormData.established ? editFormData.established.split('T')[0] : ''}
                onChange={(e) => setEditFormData({ ...editFormData, established: e.target.value })}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <div className="section-title">Contact Information</div>
              <TextField
                label="Contact Email"
                value={editFormData.contact.email}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  contact: { ...editFormData.contact, email: e.target.value }
                })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Mobile Number"
                value={editFormData.contact.mobile}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  contact: { ...editFormData.contact, mobile: e.target.value }
                })}
                fullWidth
                margin="normal"
              />
            </div>

            {/* Social Media Links */}
            <div className="form-section">
              <div className="section-title">Social Media Links</div>
              <TextField
                label="Facebook"
                value={editFormData.socialMediaLinks.facebook}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  socialMediaLinks: { ...editFormData.socialMediaLinks, facebook: e.target.value }
                })}
                placeholder={adminData?.socialMediaLinks?.facebook || "https://facebook.com/yourprofile"}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <Icon
                      path={mdiFacebook}
                      size={0.8}
                      color="#1877F2"
                      style={{ marginRight: '8px' }}
                    />
                  ),
                }}
              />
              <TextField
                label="Twitter"
                value={editFormData.socialMediaLinks.twitter}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  socialMediaLinks: { ...editFormData.socialMediaLinks, twitter: e.target.value }
                })}
                placeholder={adminData?.socialMediaLinks?.twitter || "https://twitter.com/yourhandle"}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <Icon
                      path={mdiTwitter}
                      size={0.8}
                      color="#1DA1F2"
                      style={{ marginRight: '8px' }}
                    />
                  ),
                }}
              />
              <TextField
                label="Instagram"
                value={editFormData.socialMediaLinks.instagram}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  socialMediaLinks: { ...editFormData.socialMediaLinks, instagram: e.target.value }
                })}
                placeholder={adminData?.socialMediaLinks?.instagram || "https://instagram.com/yourusername"}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <Icon
                      path={mdiInstagram}
                      size={0.8}
                      color="#E4405F"
                      style={{ marginRight: '8px' }}
                    />
                  ),
                }}
              />
              <TextField
                label="LinkedIn"
                value={editFormData.socialMediaLinks.linkedin}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  socialMediaLinks: { ...editFormData.socialMediaLinks, linkedin: e.target.value }
                })}
                placeholder={adminData?.socialMediaLinks?.linkedin || "https://linkedin.com/in/yourprofile"}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <Icon
                      path={mdiLinkedin}
                      size={0.8}
                      color="#0A66C2"
                      style={{ marginRight: '8px' }}
                    />
                  ),
                }}
              />
              <Typography
                variant="caption"
                color="textSecondary"
                style={{
                  display: 'block',
                  marginTop: '8px',
                  fontStyle: 'italic'
                }}
              >
                Please enter complete URLs including 'https://'
              </Typography>
            </div>
          </form>
        </StyledDialogContent>

        <StyledDialogActions>
          <Button
            variant="outlined"
            onClick={() => setEditModalOpen(false)}
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
            onClick={handleEditSubmit}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }
            }}
          >
            Save Changes
          </Button>
        </StyledDialogActions>
      </StyledDialog>
      <PrivacyPolicyDialog
        open={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
        isAdmin={isAdmin}
      />
    </>
  );
}