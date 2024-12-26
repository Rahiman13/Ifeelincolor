import React, { useState, useEffect } from 'react';
import { Dropdown } from "react-bootstrap";
import Icon from '@mdi/react';
import { mdiAccountTie, mdiAccountMultiple, mdiChartLine, mdiPlus, mdiAlertCircleOutline } from '@mdi/js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card_circle from '../../assets/circle.png';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { FaEllipsisV } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Tabs, Tab, Modal, TextField, Box, TablePagination, Typography, MenuItem, CircularProgress, Backdrop, Paper, Avatar, Chip, IconButton, Menu, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Menu as MenuIcon } from '@mui/icons-material';
import './manager.scss';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BaseUrl from '../../api';


const calculatePercentageIncrease = (current, previous) => {
  if (!current || !previous) return '0% of total';
  if (previous === 0) return current > 0 ? '100% of total' : '0% of total';

  const increase = ((current - previous) / Math.abs(previous)) * 100;
  const formattedValue = Math.abs(increase).toFixed(1);

  if (increase > 0) {
    return `↑ ${formattedValue}% of total`;
  } else if (increase < 0) {
    return `↓ ${formattedValue}% of total`;
  }
  return '0% of total';
};

const MetricCard = ({ title, value, icon, gradient, percentage }) => (
  <Card className="card-trendy text-white"
    sx={{
      background: gradient,
      color: 'white',
      height: '160px',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <img
      src={Card_circle}
      className="trendy-card-img-absolute"
      alt="circle"
      style={{
        opacity: 0.8,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    />
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
          {title}
        </Typography>
        <Icon path={icon} size={1.5} color="rgba(255,255,255,0.8)" />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontSize: '1.8rem', fontWeight: 600 }}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 0,
            fontSize: '0.8rem',
            opacity: 0.8,
            color: percentage.startsWith('↑') ? '#4CAF50' :
              percentage.startsWith('↓') ? '#FF5252' :
                'inherit'
          }}
        >
          {percentage}
        </Typography>
      </Box>
    </Box>
  </Card>
);

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
  borderRadius: theme.shape.borderRadius * 3,
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
  minWidth: 700,
});

const TableHeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  background: theme.palette.grey[200],

}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  // color: theme.palette.common.white,
  color: theme.palette.common.black,

  fontWeight: '500',
  textTransform: 'uppercase',
  fontSize: '0.9rem',
  lineHeight: '1.5rem',
  letterSpacing: '0.05em',
  padding: theme.spacing(2),
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: alpha(theme.palette.primary.light, 0.05),
//   },
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.primary.light, 0.1),
//     transform: 'translateY(-2px)',
//     boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//   },
//   transition: 'all 0.3s ease',
// }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'white',
  '&:nth-of-type(odd)': {
  },
  '&:hover': {
    backgroundColor: '#F5F5F5',
    transform: 'translateY(-2px)',
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

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  borderRadius: '20px',
  backgroundColor: '#7a990a',
  padding: '0 10px',
  height: 28,
  fontSize: '0.75rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
}));

// const ActionButton = styled(IconButton)(({ theme }) => ({
//   padding: 8,
//   transition: 'all 0.2s',
//   '&:hover': {
//     transform: 'scale(1.15)',
//     boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
//   },
// }));
const ActionButton = styled(IconButton)(({ theme }) => ({
  padding: '4px 10px 3px',
  margin: '3px',
  display: 'flex-column',
  gap: '10px',
  transition: 'all 0.2s',
  backgroundColor: "#F5F5FF5",
  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  borderRadius: '20px',

  '&:hover': {
    transform: 'scale(1.15)',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: '130px',
  '& .MuiInputBase-root': {
    borderRadius: '20px',
    backgroundColor: 'white',
    fontSize: '0.75rem',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '6px 10px',
    fontSize: '0.75rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[300],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
    transform: 'translate(14px, 6px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
}));

const ManagersPage = () => {
  const [activeTab, setActiveTab] = useState("total");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]);
  const [activeManagers, setActiveManagers] = useState([]);
  const [inactiveManagers, setInactiveManagers] = useState([]);
  const [managerCounts, setManagerCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State for dropdown menu
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!initialLoading) {
      fetchManagersForTab();
    }
  }, [activeTab]);

  const fetchInitialData = async () => {
    setInitialLoading(true);
    try {
      await Promise.all([fetchManagers(), fetchManagerCounts()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to fetch initial data');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchManagersForTab = async () => {
    try {
      await fetchManagers();
    } catch (error) {
      console.error('Error fetching managers for tab:', error);
      toast.error('Failed to fetch managers');
    }
  };

  const fetchManagers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let endpoint = `${BaseUrl}/api/organization/managers`;

      if (activeTab === 'active') {
        endpoint = `${BaseUrl}/api/organization/managers/active`;
      } else if (activeTab === 'inactive') {
        endpoint = `${BaseUrl}/api/organization/managers/inactive`;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (activeTab === 'active') {
        setActiveManagers(response.data.body);
      } else if (activeTab === 'inactive') {
        setInactiveManagers(response.data.body);
      } else {
        setManagers(response.data.body);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  };

  const fetchManagerCounts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${BaseUrl}/api/organization/managers/counts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Assuming the API returns both current and previous counts
      // If not, you'll need to modify your backend to include this data
      setManagerCounts({
        total: response.data.body.total,
        active: response.data.body.active,
        inactive: response.data.body.inactive,
        previousTotal: response.data.body.previousTotal || 0,
        previousActive: response.data.body.previousActive || 0,
        previousInactive: response.data.body.previousInactive || 0
      });
    } catch (error) {
      console.error('Error fetching manager counts:', error);
      toast.error('Failed to fetch manager counts');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateChange = (type) => (date) => {
    setDateRange(prev => ({ ...prev, [type]: date }));
  };

  const filterManagersByDateRange = (managers) => {
    if (!dateRange.from && !dateRange.to) return managers;

    return managers.filter(manager => {
      const joinedDate = new Date(manager.createdAt);
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

  const getPaginatedManagers = () => {
    let currentManagers;
    switch (activeTab) {
      case "active":
        currentManagers = activeManagers;
        break;
      case "inactive":
        currentManagers = inactiveManagers;
        break;
      default:
        currentManagers = managers;
    }
    if (!currentManagers) return [];

    const filteredManagers = filterManagersByDateRange(currentManagers);
    return filteredManagers;
  };

  const handleEdit = (manager) => {
    setSelectedManager(manager);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to recover this manager!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActionLoading(true);
        try {
          const token = sessionStorage.getItem('token');
          const response = await axios.delete(`${BaseUrl}/api/organization/manager/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.status === 'success') {
            // Remove the deleted manager from the list
            setManagers(prevManagers => prevManagers.filter(m => m._id !== id));
            Swal.fire(
              'Deleted!',
              'The manager has been deleted.',
              'success'
            );
            // Refresh manager counts after successful deletion
            fetchManagerCounts();
          } else {
            throw new Error(response.data.message || 'Failed to delete manager');
          }
        } catch (error) {
          console.error('Error deleting manager:', error);
          Swal.fire(
            'Error!',
            error.message || 'Failed to delete the manager.',
            'error'
          );
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleSave = async () => {
    setActionLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (modalType === "edit" && selectedManager) {
        const response = await axios.put(
          `${BaseUrl}/api/organization/manager/${selectedManager._id}`,
          {
            name: selectedManager.name || '',
            email: selectedManager.email || '',
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === 'success') {
          setManagers(prevManagers =>
            prevManagers.map(m => m._id === selectedManager._id ? response.data.body : m)
          );
          toast.success('Manager details updated successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to update manager');
        }
      } else if (modalType === "add" && selectedManager) {
        const response = await axios.post(
          `${BaseUrl}/api/manager/register`,
          {
            name: selectedManager.name || '',
            email: selectedManager.email || '',
            password: selectedManager.password || '',
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === 'success') {
          // Add the new manager and refresh the data
          await fetchInitialData();
          toast.success('New manager added successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to add manager');
        }
      }
      setShowModal(false);
      setSelectedManager(null);
      // Refresh manager counts after successful operation
      await fetchManagerCounts();
    } catch (error) {
      console.error('Error saving manager:', error);
      toast.error(error.message || 'Failed to save manager');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedManager({ ...selectedManager, [name]: value });
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

  return (
    <div className="container-fluid mt-4 manager-page">
      {initialLoading ? (
        <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <div className="page-header">
            <h3 className="page-title">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <Icon path={mdiAccountTie} size={1.4} />
              </span> Managers
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
                    Organization Manager System
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.9)' }}>
                    A comprehensive system for managing organization administrators and their access controls.
                  </Typography>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Dashboard Overview:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Total managers count with growth metrics</li>
                    <li>Active vs. Inactive manager statistics</li>
                    <li>Real-time status monitoring</li>
                    <li>Trend analysis and reporting</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Manager Management Features:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Add new managers with secure credentials</li>
                    <li>Edit existing manager profiles</li>
                    <li>Activate/Deactivate manager accounts</li>
                    <li>Bulk management operations</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Filtering & Search:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Filter by active/inactive status</li>
                    <li>Date range selection</li>
                    <li>Advanced search capabilities</li>
                    <li>Custom filter combinations</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Security Features:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Role-based access control</li>
                    <li>Secure password management</li>
                    <li>Activity logging and auditing</li>
                    <li>Two-factor authentication support</li>
                  </ul>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                    Data Management:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>
                    <li>Automated data backup</li>
                    <li>Data export capabilities</li>
                    <li>Version history tracking</li>
                    <li>Data integrity checks</li>
                  </ul>

                  <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon path={mdiAlertCircleOutline} size={0.6} />
                      Note: All manager operations are logged and monitored for security purposes
                    </Typography>
                  </Box>
                </Box>
              }
              arrow
              placement="bottom-start"
              sx={{
                maxWidth: 'none',
                '& .MuiTooltip-tooltip': {
                  bgcolor: 'rgba(0, 0, 0, 0.87)',
                  maxWidth: '400px',
                }
              }}
            ><Box sx={{
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
          <div className="row px-3">
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} my={1}>
              <MetricCard
                title="All Managers"
                value={managerCounts.total}
                icon={mdiChartLine}
                gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                percentage={calculatePercentageIncrease(managerCounts.total, managerCounts.previousTotal || 0)}
              />
              <MetricCard
                title="Active Managers"
                value={managerCounts.active}
                icon={mdiAccountTie}
                gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                percentage={calculatePercentageIncrease(managerCounts.active, managerCounts.previousActive || 0)}
              />
              <MetricCard
                title="Inactive Managers"
                value={managerCounts.inactive}
                icon={mdiAccountMultiple}
                gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                percentage={calculatePercentageIncrease(managerCounts.inactive, managerCounts.previousInactive || 0)}
              />
            </Box>
          </div>

          <Box mt={4} px={3} >
            {/* <Card sx={{ p: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}> */}

            <Box sx={{ paddingTop: 0, width: '100%' }}>
              <StyledTableContainer style={{ width: '100%', borderRadius: '0px', overflow: 'hidden' }}>
                <TableHeaderBox>
                  <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                    Managers Details
                  </Typography>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFilterClick} // Open filter dropdown
                      startIcon={<MenuIcon />}
                      sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#FFF', color: 'black', '&:hover': { backgroundColor: '#FFF' } }}
                      className='rounded-80 border border-dark'
                    >
                      Filter
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleFilterSelect("total")}>All Managers</MenuItem>
                      <MenuItem onClick={() => handleFilterSelect("active")}>Active Managers</MenuItem>
                      <MenuItem onClick={() => handleFilterSelect("inactive")}>Inactive Managers</MenuItem>
                    </Menu>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => { setSelectedManager({}); setModalType("add"); setShowModal(true); }}
                      startIcon={<Icon path={mdiPlus} size={1} />}
                      // sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#28a745', '&:hover': { backgroundColor: '#218838' } }}
                      sx={{ borderRadius: '10px', textTransform: 'none', backgroundColor: '#7a990a', '&:hover': { backgroundColor: '#218838' } }}
                      className='rounded-80 border-info'
                    >
                      Add Manager
                    </Button>
                  </div>
                  {/* <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<Icon path={mdiEye} size={0.8} />}
                      onClick={this.handleViewAllClick}
                    >
                      View All
                    </Button> */}
                </TableHeaderBox>
                <StyledTable>
                  <StyledTableHead>
                    <TableRow>
                      <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                      <StyledHeaderCell align="left">Name</StyledHeaderCell>
                      <StyledHeaderCell align="center">Email</StyledHeaderCell>
                      <StyledHeaderCell align="center">Status</StyledHeaderCell>
                      <StyledHeaderCell align="center">Joined Date</StyledHeaderCell>
                      <StyledHeaderCell align="center">Actions</StyledHeaderCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {getPaginatedManagers()
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((manager, index) => (
                        <StyledTableRow key={manager._id}>
                          <StyledTableCell align="center">
                            <Typography variant="body2" fontWeight="500">
                              {page * rowsPerPage + index + 1}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box display="flex" alignItems="center">
                              <StyledAvatar alt={manager.name || ''}>
                                {manager.name ? manager.name.charAt(0) : '?'}
                              </StyledAvatar>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {manager.name || 'Unnamed Manager'}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell align="center" className='text-primary'>{manager.email}</StyledTableCell>
                          <StyledTableCell align="center">
                            <StyledChip
                              label={manager.Active === "yes" ? "Active" : "Inactive"}
                              color={manager.Active === "yes" ? "success" : "error"}
                              size="small"
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Typography variant="body2" color="textSecondary">
                              {new Date(manager.createdAt).toLocaleDateString()}
                            </Typography>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <ActionButton onClick={() => handleEdit(manager)} color="primary">
                              <EditIcon />
                            </ActionButton>
                            <ActionButton onClick={() => handleDelete(manager._id)} color="error">
                              <DeleteIcon />
                            </ActionButton>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </StyledTable>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <StyledDatePicker
                        label="From"
                        value={dateRange.from}
                        onChange={handleDateChange('from')}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="dd/MM/yy"
                        clearable
                      />
                      <StyledDatePicker
                        label="To"
                        value={dateRange.to}
                        onChange={handleDateChange('to')}
                        renderInput={(params) => <TextField {...params} />}
                        inputFormat="dd/MM/yy"
                        clearable
                      />
                    </Box>
                  </LocalizationProvider>
                  <TablePagination
                    component="div"
                    count={getPaginatedManagers().length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </Box>
              </StyledTableContainer>
            </Box>
            {/* </Card> */}

            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
              <DialogTitle sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#fff', // Change text color to white for better contrast
                background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', // Match the background gradient
                borderBottom: '2px solid #e0e0e0'
              }}>
                {modalType === "edit" ? "Edit Manager" : "Add New Manager"}
              </DialogTitle>
              <DialogContent sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={selectedManager?.name || ''}
                  onChange={handleInputChange}
                  error={!selectedManager?.name}
                  helperText={!selectedManager?.name ? "Name is required" : ""}
                />
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
                  value={selectedManager?.email || ''}
                  onChange={handleInputChange}
                  error={!selectedManager?.email}
                  helperText={!selectedManager?.email ? "Email is required" : ""}
                />
                {modalType === "add" && (
                  <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type="password"
                    value={selectedManager?.password || ''}
                    onChange={handleInputChange}
                    error={!selectedManager?.password}
                    helperText={!selectedManager?.password ? "Password is required" : ""}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowModal(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    }
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            <Backdrop open={actionLoading} style={{ zIndex: 9999, color: '#fff' }}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManagersPage;
