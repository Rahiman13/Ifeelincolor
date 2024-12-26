import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.svg';
import Face1 from '../../assets/face1.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Add this import
// import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';
import BaseUrl from '../../api';


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

    let apiUrl = '';
    
    // Determine the API URL based on the user role
    if (role === 'organization') {
      apiUrl = `${BaseUrl}/api/organization/notifications`;
    } else if (role === 'manager') {
      apiUrl = `${BaseUrl}/api/manager/notifications`;
    } else if (role === 'Admin') {
      apiUrl = `${BaseUrl}/api/admin/notifications`;
    } else if (role === 'assistant') {
      apiUrl = `${BaseUrl}/api/admin/notifications-assistant`;
    }

    if (token) {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success') {
            setNotifications(data.body); // Set notifications state
          }
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
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

  const navbarStyle = {
    background: 'linear-gradient(135deg, #1a1c1e 0%, #2c3e50 100%)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: "'Poppins', sans-serif",
  };

  const brandWrapperStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  };

  const brandTextStyle = {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: "'Montserrat', sans-serif",
    letterSpacing: '2px',
    textTransform: 'uppercase',
    background: 'linear-gradient(45deg, #fff, #3498DB)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.85)',
    transition: 'all 0.3s ease',
    padding: '8px 15px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const notificationIconStyle = {
    fontSize: '24px',
    color: 'rgba(255, 255, 255, 0.85)',
    transition: 'all 0.3s ease',
  };

  const notificationDropdownStyle = {
    background: 'rgba(28, 30, 33, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
    minWidth: '320px',
    marginTop: '15px',
  };

  const notificationItemStyle = {
    padding: '12px',
    margin: '6px 0',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#fff',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      transform: 'translateY(-2px)',
    },
  };

  const notificationHeaderStyle = {
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '0 12px 12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '6px',
  };

  const notificationFooterStyle = {
    color: '#3498db',
    fontSize: '0.9rem',
    fontWeight: '500',
    padding: '16px',
    textAlign: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#2980b9',
    },
  };

  const profileImageStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    objectFit: 'cover',
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-column flex-md-row" style={navbarStyle}>
      <div className="text-center navbar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center" style={brandWrapperStyle}>
        <span className="navbar-brand brand-logo" style={brandTextStyle}>
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
            <Dropdown>
              <Dropdown.Toggle className="nav-link count-indicator p-10 toggle-arrow-hide bg-transparent" style={navLinkStyle}>
                <i className="mdi mdi-bell-outline fs-4" style={{position: 'relative'}}></i>
                {/* {notifications.length > 0 && (
                  <span className="count-symbol bg-danger" style={{
                    position: 'absolute',
                    top: '20px',
                    right: '16px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%'
                  }}></span>
                )} */}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list" style={{
                ...notificationDropdownStyle,
                position: 'absolute',
                transform: 'translate(-250px, 0)',
                width: '600px'
              }}>
                <h6 className="p-3 mb-0" style={{ fontWeight: 'bold', color: '#fff' }}>Notifications</h6>
                <div className="dropdown-divider"></div>
                {(showAllNotifications ? notifications : notifications.slice(0, 5)).map(notification => (
                  <Dropdown.Item 
                    key={notification._id} 
                    className="dropdown-item preview-item" 
                    style={notificationItemStyle}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-info">
                        <i className="mdi mdi-alert-circle-outline"></i>
                      </div>
                    </div>
                    <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                      <h6 className="preview-subject font-weight-normal mb-1" style={{ color: '#fff' }}>
                        {notification.message}
                      </h6>
                      <p className="text-gray ellipsis mb-0" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </Dropdown.Item>
                ))}
                <div className="dropdown-divider"></div>
                <h6 
                  className="p-3 mb-0 text-center cursor-pointer" 
                  style={{ color: '#3498db' }} 
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                >
                  {showAllNotifications ? 'Show less notifications' : 'See all notifications'}
                </h6>
              </Dropdown.Menu>
            </Dropdown>
          </li>
          <li className="nav-item nav-profile ms-0">
            <Dropdown>
              <Dropdown.Toggle as={Link} className="nav-link p-0 d-flex align-items-center" style={navLinkStyle}>
                <div className="nav-profile-img me-1"> {/* Adjusted margin */}
                  <img 
                    src={orgImage || dummyAvatar} 
                    alt="user" 
                    style={profileImageStyle}
                  />
                  {/* <span className="availability-status online"></span> */}
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
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
