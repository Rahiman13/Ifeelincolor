import React, { useState, useEffect } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png'
import Face1 from '../../assets/face1.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Add this import
// import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import BaseUrl from '../../api';
import { io } from 'socket.io-client';
// import './Navbar.css';


const dummyAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAACUCAMAAAD79nauAAAAZlBMVEX///8AAAD8/Pzh4eHExMT19fXn5+f5+fnu7u6pqamHh4d5eXmsrKxHR0fr6+tfX18fHx/R0dE+Pj6bm5tubm62trYsLCzLy8syMjJzc3MXFxfX19cRERE5OTlmZmZZWVmTk5NOTk7ac85mAAAEZklEQVR4nO2cibaiMAyGWWUp+yaiV+H9X3LUGc9VxNIoaeIcvifIf9qkaZrUMFZWVjSSOEEodmeECKPcojYHjleLoWg680bWxtWW2igY+5M5RRO41JYpkwyTEq44XyIjb15rME1hU9ungO9I1uFCzN41/LKSrsOF1qG2Uk4wswp/yTivhXtUkXBhQ23qS+zpuDrFgWuM8nfKGs4xitraaawAoOF8XlDbO0nSgkTELDdUDdJgHkpqgyewUpgIM2W4FBZQg5nV1CY/40FFmCG1yc/4YBEnfpngBiyi4xdl4SLMiNrmJ94Q0XvURo+B+4QpfGqjx4BDLEfPfkNE8T+IaPbURo+xYPnfhYyfCPUbEV8RhgCL+GHnE0YJFhHzE+GARaT8ygU2WAS/w+6NvINf2mEkBUzCgWECaPgVUETH8WoHDU9FTm3yBNDwVCXUFk+wBYroqQ2eYg/LnjhWO84xFlZ5OvE76s74IUhERW3vNKDw1AXU5k4TQUS0/LK/K9sfgIiY2toXbJRfu0y2LmEYEM/mV/77R9DNG3+DbbuKPShrOFHb+hr1RJbxS3aeKWrIqC2VoZp5sMybbuzVNBT8btf3qJXQGF5M71GqeTCs1TyikAUeWHvEBX+YFdFT2zjPbJhNeXv1FSuSq2g4FjmecMODTATjs/oeR9YF2FNbp4gjK3uwTcFH/B8iZNvpW0TUsvD0JX4tv2oL7inHFX/mBTL9gg3lzVYLGvapk6FStuHYw/iLpfj6OOzZFjuMTa+m4bIYTKuYSRQrazjfUCOGMrwI+PBonkpm0dYNUkD178YQMpKRiB9p9v2a9shiU1leDXyFH9EEPm2ospIc9sY1TepsyDokkm0AiUcymt4h2Vf7oHrTEaY5lY7mbWXVYqlF+KXdBToLIVGsWv6G0cWlLueA95hB0JEdWvvl99GILfZqeAHORnogxO2/mb/yLEKKGm/1aDirQFwLXJe+B7HJcdHTTQ5afgvqQPkQtOFUeE/7ByDlIC6ki+ZjkFr6t7OD+0uCdHLPPAEtzA5HRKkxOKG1sOgVkeKIkJbsFwcpxsp/RlkapNYJT2uIxTqyIY2Kn9IhadCY/2E+FWsUgXejAP4I8QGY80a64hPqMKQur0Ct3Gi6YyNPauMXbEwN76uwb3feA78ZHn9DFfiFZR/73D7oGNPO4TPwIPQ0zeLGWV1f3GA6t9D1Y5Kl3jkABbcK+8BcO9DbxDr/Xkig7QNqaB4MtjECrfb/Jm3oH2fzZPp70hZX0VD01SXL7qiCpk8TOPYrZ6D6E8aC/5ryiopwHqFephTV0X6nly9xYBTUg1LJ51tKMBgLcT57BWt5/DX+0WJUNpcWWcD47whWTfxO8UY3Zsuu3zpKgW8wQ89wVs2tBeA97BiwaCZ9xnV6xdXY1Yzaesd4+3qYVZCVOcON9IBrB9JcROQul6A6gyOKJuvuXeTQZU17DBjvokk2TtSHojoejzsRlrVj8/unbWVlZWVlZWUFwh8O4UAQnNBllQAAAABJRU5ErkJggg=='; // Path to your dummy avatar image

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [orgName, setOrgName] = useState('');
  const [orgImage, setOrgImage] = useState('');
  const [notifications, setNotifications] = useState([]); // Add state for notifications
  const [showAllNotifications, setShowAllNotifications] = useState(false); // State to toggle between showing all notifications or just the latest 5
  const [userInfo, setUserInfo] = useState(null);
  const [socket, setSocket] = useState(null);
  const [announcements, setAnnouncements] = useState([]); // State for announcements
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false); // State to control modal visibility
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false); // Add loading state for announcements

  const toggleOffcanvas = () => {
    const sidebar = document.querySelector('.sidebar-offcanvas');
    if (sidebar) {
      sidebar.classList.toggle('active');
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handlePowerClick = () => {
    toast.success('Logout Successful');
    setTimeout(() => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('OrganizationId');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('adminPortal');
      navigate('/');
    }, 2000);
  };

  const fetchNotifications = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (!token || !role) {
      console.error('Missing token or role');
      return;
    }

    let apiUrl = '';
    switch (role.toLowerCase()) {
      case 'organization':
        apiUrl = `${BaseUrl}/api/organization/notifications`;
        break;
      case 'manager':
        apiUrl = `${BaseUrl}/api/manager/notifications`;
        break;
      case 'admin':
        apiUrl = `${BaseUrl}/api/admin/notifications`;
        break;
      case 'assistant':
        apiUrl = `${BaseUrl}/api/assistant/notifications`;
        break;
      default:
        console.error('Invalid role:', role);
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setNotifications(data.body);
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsSidebarOpen(false);
      }
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close sidebar and reset icon when route changes
    const sidebar = document.querySelector('.sidebar-offcanvas');
    if (sidebar && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      setIsSidebarOpen(false);
    }
  }, [location]);

  const fetchUserDetails = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

    if (token) {
      try {
        let apiUrl = '';
        if (isAdminPortal && role === 'Admin') {
          apiUrl = `${BaseUrl}/api/admin/profile`;
        } else if (isAdminPortal && role === 'assistant') {
          apiUrl = `${BaseUrl}/api/assistant/profile`;
        } else if (role === 'organization') {
          apiUrl = `${BaseUrl}/api/organization/me`;
        } else if (role === 'manager') {
          apiUrl = `${BaseUrl}/api/manager/info`;
        }

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            if (isAdminPortal && role === 'Admin') {
              setOrgName(data.body.name);
              setOrgImage(data.body.image);
            } else if (isAdminPortal && role === 'assistant') {
              setOrgName(data.body.name);
              setOrgImage(data.body.image);
            } else if (role === 'organization') {
              setOrgName(data.body.name);
              setOrgImage(data.body.image);
            } else if (role === 'manager') {
              setUserInfo(data.body);
              setOrgName(data.body.manager.name);
              setOrgImage(data.body.organization.image);
            }
          }
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Create socket with explicit connection URL and options
      const newSocket = io(BaseUrl, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket'], // Force WebSocket transport
        path: '/socket.io/', // Make sure this matches your server configuration
      });

      // Debug socket connection
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        // Join user-specific room if needed
        const role = sessionStorage.getItem('role');
        const orgId = sessionStorage.getItem('OrganizationId');
        if (role && orgId) {
          newSocket.emit('join', { role, orgId });
        }
      });

      setSocket(newSocket);
      return () => {
        console.log('Cleaning up socket connection');
        newSocket.close();
      };
    }
  }, []);

  useEffect(() => {
    if (socket) {
      // Debug incoming events
      const handleNotification = (notification) => {
        console.log('Received notification:', notification);
        
        // Update notifications state with the new notification
        setNotifications(prev => {
          // Check if notification already exists to prevent duplicates
          const exists = prev.some(n => n._id === notification._id);
          if (!exists) {
            // Show toast for new notification
            toast.info(notification.message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              toastId: notification._id, // Prevent duplicate toasts
            });
            return [notification, ...prev];
          }
          return prev;
        });
      };

      // Listen for different types of notifications
      socket.on('notification', handleNotification);
      socket.on('newNotification', handleNotification); // Some servers might use different event names
      socket.on('update', handleNotification);

      // Error handling
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection lost. Attempting to reconnect...', {
          toastId: 'connection-error',
        });
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        fetchNotifications(); // Refresh notifications after reconnection
        toast.success('Reconnected to notification service', {
          toastId: 'reconnection-success',
        });
      });

      // Cleanup
      return () => {
        socket.off('notification', handleNotification);
        socket.off('newNotification', handleNotification);
        socket.off('update', handleNotification);
        socket.off('connect_error');
        socket.off('disconnect');
        socket.off('reconnect');
      };
    }
  }, [socket]);

  // Function to fetch announcements
  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true); // Set loading to true when fetching starts
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role') + 's'; // Added 's' at the end of the role value
    

    if (!token || !role) {
      console.error('Missing token or role');
      return;
    }

    const apiUrl = `${BaseUrl}/api/announcement`;

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        // Filter announcements based on role and date
        const currentDate = new Date();
        const filteredAnnouncements = data.body.filter(announcement => {
          const startDate = new Date(announcement.startDate);
          const endDate = new Date(announcement.endDate);
          console.log(announcement.type, role.charAt(0).toUpperCase() + role.slice(1));
          return (announcement.type === 'All' || announcement.type === role.charAt(0).toUpperCase() + role.slice(1)) &&
                 currentDate >= startDate && currentDate <= endDate;
        });
        setAnnouncements(filteredAnnouncements);
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoadingAnnouncements(false); // Set loading to false when fetching ends
    }
  };

  const handleShowAnnouncements = () => {
    fetchAnnouncements(); // Fetch announcements when modal is opened
    setShowAnnouncementsModal(true);
  };

  const handleCloseAnnouncements = () => setShowAnnouncementsModal(false);

  const navbarStyle = {
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
  };

  const brandWrapperStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'color 0.3s ease',
  };

  const navLinkHoverStyle = {
    color: '#fff',
  };

  return (
    <>
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-column flex-md-row" style={navbarStyle}>
        <div className="text-center navbar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center" style={brandWrapperStyle}>
          <span className="navbar-brand brand-logo" style={{ 
              color: 'white', 
              fontSize: '18px', 
              fontWeight: '800', 
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              IFEELINCOLOR
          </span>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch justify-content-between flex-grow-1">
          <div className="d-flex align-items-center">
            <button
              className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
              type="button"
              onClick={toggleOffcanvas}
              style={{ color: 'white' }}
            >
              <span className={`mdi ${isSidebarOpen ? 'mdi-close' : 'mdi-menu'}`}></span>
            </button>
            <button
              className="navbar-toggler navbar-toggler align-items-center d-none d-lg-flex"
              type="button"
              onClick={() => document.body.classList.toggle('sidebar-icon-only')}
              style={{ color: 'white' }}
            >
              <span className="mdi mdi-menu"></span>
            </button>
          </div>

          <ul className="navbar-nav navbar-nav-right d-flex align-items-center">
          <li className="nav-item">
              <button onClick={handleShowAnnouncements} className="btn btn-link nav-link" style={navLinkStyle}>
                <i className="mdi mdi-sale fs-4"></i>
              </button>
            </li>
            <li className="nav-item">
              <Dropdown align="end">
                <Dropdown.Toggle className="nav-link count-indicator p-10 toggle-arrow-hide bg-transparent" style={navLinkStyle}>
                  <i className="mdi mdi-bell-outline fs-4"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list" 
                  style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    position: 'absolute',
                    transform: 'translate(-250px, 0)',
                    width: '500px'
                  }}>
                  <h6 className="p-3 mb-0" style={{ fontWeight: 'bold', color: '#333' }}>Admin Notifications</h6>
                  <div className="dropdown-divider"></div>
                  {(showAllNotifications ? notifications : notifications.slice(0, 5)).map(notification => ( // Show all or latest 5 notifications
                    <Dropdown.Item key={notification._id} className="dropdown-item preview-item" style={{ padding: '10px 15px', borderRadius: '5px', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <div className="preview-thumbnail">
                        <div className="preview-icon bg-info">
                          <i className="mdi mdi-alert-circle-outline"></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                        <h6 className="preview-subject font-weight-normal mb-1" style={{ fontWeight: '600', color: '#333' }}>{notification.message}</h6>
                        <p className="text-gray ellipsis mb-0" style={{ fontSize: '12px', color: '#777' }}>{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                    </Dropdown.Item>
                  ))}
                  <div className="dropdown-divider"></div>
                  <h6 className="p-3 mb-0 text-center cursor-pointer" style={{ color: '#007bff' }} onClick={() => setShowAllNotifications(!showAllNotifications)}>
                    {showAllNotifications ? 'Show less notifications' : 'See all notifications'}
                  </h6>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            
            <li className="nav-item nav-profile ms-0">
              <Dropdown>
                <Dropdown.Toggle as={Link} className="nav-link p-0 d-flex align-items-center" style={navLinkStyle}>
                  <div className="nav-profile-img me-1"> {/* Adjusted margin */}
                    <img src={orgImage || dummyAvatar} alt="user" className="rounded-circle" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                    <span className="availability-status online" style={{ backgroundColor: 'green', position: 'absolute', bottom: '0px', right: '0px', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                  </div>
                  <span className="d-none d-md-inline-block text-white px-2 fs-8" style={{fontWeight: '500'}}>{orgName || 'User'}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end mt-2">
                  <Dropdown.Item 
                    as={Link} 
                    to={sessionStorage.getItem('adminPortal') === 'true' ? '/profile_superadmin' : '/profile'} 
                    className="d-flex align-items-center"
                  >
                    <FaUser className="me-2" /> Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handlePowerClick} className="d-flex align-items-center">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </nav>

      {/* Modal for displaying announcements */}
      <Modal show={showAnnouncementsModal} onHide={handleCloseAnnouncements} className="custom-modal">
        <Modal.Header closeButton className="bg-gradient-primary text-white p-3">
          <Modal.Title className="modal-title font-weight-bold text-white">Announcements</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {loadingAnnouncements ? ( // Show spinner while loading
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : ( // Show announcements when not loading
            announcements.length > 0 ? (
              announcements.map(announcement => (
                <div key={announcement._id} className="card mb-3 shadow-lg border-0 rounded-lg bg-white">
                  <div className="card-body p-3">
                    <h5 className="card-title font-semibold text-lg text-primary">Title: {announcement.title}</h5>
                    <p className="card-text text-gray-800">{announcement.content}</p>
                    <p className="card-text text-gray-800">Starts From: {new Date(announcement.startDate).toLocaleDateString()}</p>
                    <p className="card-text text-gray-800">Valid Till: {new Date(announcement.endDate).toLocaleDateString()}</p>
                    {announcement.media && <img src={announcement.media} alt={announcement.title} className="img-fluid rounded-lg mt-2" />}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No announcements available.</p>
            )
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center p-3">
          <button variant="secondary" className="btn btn-primary btn-sm btn-rounded px-4 py-2" onClick={handleCloseAnnouncements}>
            Close
          </button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Navbar;
