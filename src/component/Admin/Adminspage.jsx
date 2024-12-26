import React, { useState, useEffect } from 'react';
import { Card, Typography, Box, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TablePagination, useMediaQuery, useTheme, TableContainer, CircularProgress, Backdrop } from '@mui/material';
import Icon from '@mdi/react';
import { mdiShieldAccount, mdiAccountMultiple, mdiChartLine, mdiDotsVertical, mdiPlus } from '@mdi/js';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card_circle from '../../assets/circle.png'
import '../Clinician/ClinicianPage.scss'
import axios from 'axios';
import BaseUrl from '../../api';


// Metric Card Component
const MetricCard = ({ title, value, icon, gradient, percentage }) => (
    <Card
        sx={{
            background: gradient,
            color: 'white',
            padding: 4,
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            height: '230px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '195px',
                height: '240px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                opacity: 0.6,
                zIndex: 0,
            },
            zIndex: 1,
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

// Updated Admins Table Component
const AdminsTable = ({ admins, onEdit, onDelete, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const handleMenuClick = (event, admin) => {
        setAnchorEl(event.currentTarget);
        setSelectedAdmin(admin);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAdmin(null);
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="text-center fw-bold">S.No </TableCell>
                        <TableCell className="text-center fw-bold">Name</TableCell>
                        <TableCell className="text-center fw-bold">Email</TableCell>
                        <TableCell className="text-center fw-bold">Mobile</TableCell>
                        <TableCell className="text-center fw-bold">Joined Date</TableCell>
                        <TableCell className="text-center fw-bold">Status</TableCell>
                        <TableCell className="text-center fw-bold">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {admins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((admin,index) => (
                        <TableRow key={admin._id}>
                            <TableCell className="text-center ">{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell className="text-center ">{admin.name || "-"}</TableCell>
                            <TableCell className="text-center ">{admin.email || "-"}</TableCell>
                            <TableCell className="text-center ">{admin.mobile || "-"}</TableCell>
                            <TableCell className="text-center ">{admin.joinedDate || "-"}</TableCell>
                            <TableCell className="text-center ">{admin.Active || "-"}</TableCell>
                            <TableCell className="text-center ">
                                <IconButton onClick={(e) => handleMenuClick(e, admin)}>
                                    <Icon path={mdiDotsVertical} size={1} />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={admins.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { onEdit(selectedAdmin); handleMenuClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { onDelete(selectedAdmin); handleMenuClose(); }}>Delete</MenuItem>
            </Menu>
        </TableContainer>
    );
};

// Updated Admin Modal Component
const AdminModal = ({ open, onClose, onSave, admin }) => {
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
    });

    useEffect(() => {
        if (admin) {
            setFormValues({
                name: admin.name || '',
                email: admin.email || '',
                mobile: admin.mobile || '',
                password: '' // We don't populate the password for editing
            });
        } else {
            setFormValues({
                name: '',
                email: '',
                password: '',
                mobile: '',
            });
        }
    }, [admin]);

    const handleSave = async () => {
        try {
            const token = sessionStorage.getItem('token');
            let response;

            if (admin) {
                // Editing existing admin
                response = await axios.put(`${BaseUrl}/api/organization/orgadmin/${admin._id}`, 
                    { name: formValues.name, email: formValues.email, mobile: formValues.mobile },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // Adding new admin
                response = await axios.post(`${BaseUrl}/api/orgadmin/register`, formValues, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            
            const updatedAdmin = {
                ...response.data,
                joinedDate: admin ? admin.joinedDate : new Date().toISOString().split('T')[0],
                Active: admin ? admin.Active : "yes",
            };
            
            onSave(updatedAdmin);
            toast.success(admin ? 'Admin updated successfully' : 'Admin added successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || `Error ${admin ? 'updating' : 'adding'} admin`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle style={{ fontWeight: 'bold', backgroundColor: '#efefef' }}>
                {admin ? 'Edit Admin' : 'Add Admin'}
            </DialogTitle>
            <DialogContent>
                <TextField label="Name" fullWidth value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} margin="normal" />
                <TextField label="Email" fullWidth value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} margin="normal" />
                {admin && (    
                <TextField label="Mobile" fullWidth value={formValues.mobile} onChange={(e) => setFormValues({ ...formValues, mobile: e.target.value })} margin="normal" />
                )}
                {!admin && (
                    <TextField label="Password" fullWidth value={formValues.password} onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} margin="normal" type="password" />
                )}
            </DialogContent>
            <DialogActions className="actions">
                <Button onClick={onClose}
                    variant="outlined"
                    sx={{
                        backgroundColor: '#f0f0f0',
                        borderColor: '#d32f2f',
                        color: '#d32f2f',
                        '&:hover': {
                            backgroundColor: '#d32f2f',
                            color: '#fff',
                        }
                    }}
                    className='me-2 rounded-pill'
                >
                    Cancel
                </Button>
                <Button onClick={handleSave} variant='contained' sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    }
                }}
                    className='me-2 rounded-pill'
                >
                    {admin ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AdminsPage = () => {
    const [allAdmins, setAllAdmins] = useState([]);
    const [activeAdmins, setActiveAdmins] = useState([]);
    const [inactiveAdmins, setInactiveAdmins] = useState([]);
    const [adminCounts, setAdminCounts] = useState({
        totalAdmins: 0,
        activeAdmins: 0,
        inactiveAdmins: 0
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [tab, setTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchAllAdmins(), fetchActiveAdmins(), fetchAdminCounts()]);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAdmins = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${BaseUrl}/api/organization/orgadmins`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === "success") {
                const admins = response.data.body.map(admin => ({
                    ...admin,
                    joinedDate: new Date(admin.createdAt).toISOString().split('T')[0],
                    active: admin.Active === "yes"
                }));
                setAllAdmins(admins);
                setInactiveAdmins(admins.filter(admin => !admin.active));
            } else {
                toast.error('Failed to fetch all admins');
            }
        } catch (error) {
            console.error('Error fetching all admins:', error);
            toast.error('Failed to fetch all admins');
        }
    };

    const fetchActiveAdmins = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${BaseUrl}/api/organization/orgadmins/active`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === "success") {
                setActiveAdmins(response.data.body.map(admin => ({
                    ...admin,
                    joinedDate: new Date(admin.createdAt).toISOString().split('T')[0],
                    active: true
                })));
            } else {
                toast.error('Failed to fetch active admins');
            }
        } catch (error) {
            console.error('Error fetching active admins:', error);
            toast.error('Failed to fetch active admins');
        }
    };

    const fetchAdminCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${BaseUrl}/api/organization/orgadmins/counts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === "success") {
                setAdminCounts(response.data.body);
            } else {
                toast.error('Failed to fetch admin counts');
            }
        } catch (error) {
            console.error('Error fetching admin counts:', error);
            toast.error('Failed to fetch admin counts');
        }
    };

    const handleAddAdmin = () => {
        setSelectedAdmin(null);
        setModalOpen(true);
    };

    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
        setModalOpen(true);
    };

    const handleSaveAdmin = async (adminData) => {
        setActionLoading(true);
        try {
            // ... existing save logic ...
            await fetchData(); // Refresh data after saving
            toast.success(adminData._id ? 'Admin updated successfully' : 'Admin added successfully');
        } catch (error) {
            console.error('Error saving admin:', error);
            toast.error('Failed to save admin');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteAdmin = (admin) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${admin.name}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setActionLoading(true);
                try {
                    const token = sessionStorage.getItem('token');
                    await axios.delete(`${BaseUrl}/api/organization/orgadmin/${admin._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    await fetchData(); // Refresh data after deleting
                    toast.success('Admin deleted successfully');
                } catch (error) {
                    console.error('Error deleting admin:', error);
                    toast.error('Failed to delete admin');
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className='container-fluid mt-4 Admin-page'>
            {loading ? (
                <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <>
                    <div className="page-header">
                        <h3 className="page-title">
                            <span className="page-title-icon bg-gradient-primary text-white me-2">
                                <Icon path={mdiShieldAccount} size={1.3} />
                            </span> Admins
                        </h3>
                        <span>
                            Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
                        </span>
                    </div>
                    <div className="row px-3" >
                        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))" gap={5} my={1}>
                            <MetricCard
                                title="Active Admins"
                                value={adminCounts.activeAdmins}
                                icon={mdiShieldAccount}
                                gradient="linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)"
                                percentage={`${((adminCounts.activeAdmins / adminCounts.totalAdmins) * 100).toFixed(1)}% of total`}
                            />
                            <MetricCard
                                title="Inactive Admins"
                                value={adminCounts.inactiveAdmins}
                                icon={mdiAccountMultiple}
                                gradient="linear-gradient(135deg, #FFD200 0%, #F7971E 100%)"
                                percentage={`${((adminCounts.inactiveAdmins / adminCounts.totalAdmins) * 100).toFixed(1)}% of total`}
                            />
                            <MetricCard
                                title="Total Admins"
                                value={adminCounts.totalAdmins}
                                icon={mdiChartLine}
                                gradient="linear-gradient(135deg, #38ef7d 0%, #11998e 100%)"
                                percentage="100% Total"
                            />
                        </Box>
                    </div>

                    <Box mt={4} px={3}>
                        <Card sx={{ p: 3 }}>
                            <div className="border-bottom border-#efefef border-2">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <Typography variant="h5" gutterBottom>
                                        Admin Management
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddAdmin}
                                        startIcon={<Icon path={mdiPlus} size={1} />}
                                        sx={{ borderRadius: '20px', textTransform: 'none' }}
                                        className='rounded-pill'
                                    >
                                        Add Admin
                                    </Button>
                                </div>
                            </div>
                            <Tabs
                                className='py-4'
                                value={tab}
                                onChange={(e, newValue) => setTab(newValue)}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                                variant={isMobile ? 'scrollable' : 'standard'}
                            >
                                <Tab label="All Admins" />
                                <Tab label="Active Admins" />
                                <Tab label="Inactive Admins" />
                            </Tabs>
                            {tab === 0 && (
                                <AdminsTable
                                    admins={allAdmins}
                                    onEdit={handleEditAdmin}
                                    onDelete={handleDeleteAdmin}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            )}
                            {tab === 1 && (
                                <AdminsTable
                                    admins={activeAdmins}
                                    onEdit={handleEditAdmin}
                                    onDelete={handleDeleteAdmin}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            )}
                            {tab === 2 && (
                                <AdminsTable
                                    admins={inactiveAdmins}
                                    onEdit={handleEditAdmin}
                                    onDelete={handleDeleteAdmin}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            )}
                        </Card>
                        <AdminModal
                            open={modalOpen}
                            onClose={() => {
                                setModalOpen(false);
                                setSelectedAdmin(null);
                            }}
                            onSave={handleSaveAdmin}
                            admin={selectedAdmin}
                        />
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

export default AdminsPage;