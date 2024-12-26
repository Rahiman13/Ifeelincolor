import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap';
import '@mdi/font/css/materialdesignicons.min.css';
import Face1 from '../../assets/face1.jpg'; // Import profile image
import axios from 'axios';
import { MdAccountCircle } from 'react-icons/md';
import BaseUrl from '../../api';


const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const [orgDetails, setOrgDetails] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [assistantProfile, setAssistantProfile] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [assistantId, setAssistantId] = useState(null);
  const location = useLocation();

  // Get the user role, token and adminPortal from session storage
  const role = sessionStorage.getItem('role') || '';
  const token = sessionStorage.getItem('token') || '';
  const adminPortal = sessionStorage.getItem('adminPortal') || '';

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (adminPortal === 'true' && token && role === 'Admin') {
        try {
          const response = await axios.get(`${BaseUrl}/api/admin/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setAdminProfile(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error);
        }
      } else if (role === 'organization' && token) {
        try {
          const response = await axios.get(`${BaseUrl}/api/organization/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setOrgDetails(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching organization details:', error);
        }
      } else if (role === 'assistant' && token) {
        try {
          const response = await axios.get(`${BaseUrl}/api/assistant/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setAssistantProfile(response.data.body);
            setAssistantId(response.data.body._id);
          }
        } catch (error) {
          console.error('Error fetching assistant profile:', error);
        }
      }
    };

    fetchProfileDetails();
  }, [role, token, adminPortal]);

  useEffect(() => {
    const fetchAssistantPermissions = async () => {
      if (role === 'assistant' && adminPortal === 'true' && token && assistantId) {
        try {
          const response = await axios.get(
            `${BaseUrl}/api/assistant/get-permissions/${assistantId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (response.data.status === 'success') {
            setPermissions(response.data.body.permissions);
          }
        } catch (error) {
          console.error('Error fetching assistant permissions:', error);
        }
      }
    };

    if (assistantId) {
      fetchAssistantPermissions();
    }
  }, [role, token, adminPortal, assistantId]);

  const sidebarStyle = {
    background: 'linear-gradient(135deg, #1a1c1e 0%, #2c3e50 100%)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    fontFamily: "'Poppins', sans-serif",
    color: '#fff',
  };

  const navItemStyle = {
    margin: '5px 12px',
    borderRadius: '12px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    color: '#fff',
  };

  const navLinkStyle = {
    color: 'rgba(255, 255, 255, 0.85)',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 18px',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    borderRadius: '12px',
    width: '100%',
  };

  const navItemHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',  //double hover effect
    transform: 'translateX(5px)',
    color: '#fff',
  };

  const navLinkHoverStyle = {
    color: '#fff',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #3498DB',
  };

  const menuIconStyle = {
    fontSize: '24px',
    marginRight: '15px',
    color: '#fff',
    transition: 'transform 0.3s ease',
  };

  const subMenuIconStyle = {
    fontSize: '18px',
    marginRight: '10px',
    color: 'rgba(255, 255, 255, 0.8)',
    transition: 'transform 0.3s ease',
  };

  const profileSectionStyle = {
    padding: '25px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const profileContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    width: '100%',
    padding: '0',
    textDecoration: 'none',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-2px)',
    },
  };

  const profileImageContainerStyle = {
    position: 'relative',
    flexShrink: 0,
    width: '50px',
    height: '50px',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  };

  const avatarIconStyle = {
    fontSize: '2.5rem',
    color: '#26d0ce',
  };

  const userDetailsStyle = {
    flex: 1,
    minWidth: 0,
  };

  const userNameStyle = {
    display: 'block',
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: '4px',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const userRoleStyle = {
    display: 'block',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const onlineStatusStyle = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '10px',
    height: '10px',
    backgroundColor: '#2ecc71',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 0 0 2px rgba(46, 204, 113, 0.3)'
  };

  const menuItemStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  };

  const renderTooltip = (props, text) => (
    <Tooltip id="button-tooltip" {...props}>
      {text}
    </Tooltip>
  );

  const toggleMenuState = (menuStateKey) => {
    setMenuState((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      [menuStateKey]: !prevState[menuStateKey],
    }));
  };

  const onRouteChanged = () => {
    document.querySelector('#sidebar').classList.remove('active');
    setMenuState({});

    const dropdownPaths = [
      { path: '/dashboard/ifeelincolor', state: 'dashboardMenuOpen' },
      { path: '/patient-management/view', state: 'patientManagementMenuOpen' },
      { path: '/patient-management/statuses', state: 'patientManagementMenuOpen' },
      { path: '/patient-management/assign-questions', state: 'patientManagementMenuOpen' },
      { path: '/subscription-management/portal', state: 'subscriptionManagementMenuOpen' },
      { path: '/subscription-management/clinician', state: 'subscriptionManagementMenuOpen' },
      { path: '/subscription-management/organization', state: 'subscriptionManagementMenuOpen' },
      { path: '/test-management/create', state: 'testManagementMenuOpen' },
      { path: '/test-management/manage', state: 'testManagementMenuOpen' },
      { path: '/test-management/ai-questions', state: 'testManagementMenuOpen' },
      { path: '/banner-management/upload', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/banner-management/view', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/subscription-budget-analysis/overview_superadmin', state: 'subscriptionBudgetAnalysisMenuOpen' },
      { path: '/settings', state: 'settingsMenuOpen' },
      { path: '/register', state: 'registerMenuOpen' },
      { path: '/profile_superadmin', state: 'profileMenuOpen' },
    ];


    dropdownPaths.forEach((obj) => {
      if (isPathActive(obj.path)) {
        setMenuState((prevState) => ({
          ...prevState,
          [obj.state]: true,
        }));
      }
    });
  };

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const collapsedMenuStyle = {
    position: 'absolute',
    left: '100%',
    top: '0',
    minWidth: '250px',
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 4px 4px 0',
    zIndex: 1000,
    padding: '8px 0',
  };

  useEffect(() => {
    onRouteChanged();
    const body = document.querySelector('body');
    const sidebarItems = document.querySelectorAll('.sidebar .nav-item');

    sidebarItems.forEach((el) => {
      const handleMouseOver = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');

          const navLink = el.querySelector('.nav-link');
          if (navLink) {
            navLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            navLink.style.borderRadius = '4px';
          }

          const collapseMenu = el.querySelector('.collapse');
          if (collapseMenu) {
            Object.assign(collapseMenu.style, {
              display: 'block',
              position: 'absolute',
              left: '100%',
              top: '0',
              minWidth: '250px',
              background: 'linear-gradient(135deg, #1a1c1e 0%, #2c3e50 100%)',
              boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '0 4px 4px 0',
              zIndex: '1000',
              padding: '8px 0',
            });

            const subMenuItems = collapseMenu.querySelectorAll('.nav-item');
            subMenuItems.forEach(item => {
              Object.assign(item.style, {
                margin: '5px 8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              });

              const subNavLink = item.querySelector('.nav-link');
              if (subNavLink) {
                Object.assign(subNavLink.style, {
                  padding: '10px 15px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                });

                subNavLink.addEventListener('mouseenter', () => {
                  subNavLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  subNavLink.style.color = '#26d0ce';
                  subNavLink.style.transform = 'translateX(5px)';
                });

                subNavLink.addEventListener('mouseleave', () => {
                  subNavLink.style.backgroundColor = '';
                  subNavLink.style.color = 'rgba(255, 255, 255, 0.8)';
                  subNavLink.style.transform = '';
                });
              }
            });
          }
        }
      };

      const handleMouseOut = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');

          const navLink = el.querySelector('.nav-link');
          if (navLink) {
            navLink.style.backgroundColor = '';
          }

          const collapseMenu = el.querySelector('.collapse');
          if (collapseMenu) {
            collapseMenu.style.display = '';
            collapseMenu.style.position = '';
          }
        }
      };

      el.addEventListener('mouseover', handleMouseOver);
      el.addEventListener('mouseout', handleMouseOut);

      return () => {
        el.removeEventListener('mouseover', handleMouseOver);
        el.removeEventListener('mouseout', handleMouseOut);
      };
    });
  }, [location]);

  const subMenuStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    margin: '5px 0',
    padding: '5px',
  };

  const collapsedSubMenuStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '8px 12px',
    margin: '4px 8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'rgba(255, 255, 255, 0.85)',
    textDecoration: 'none',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#26d0ce',
      transform: 'translateX(5px)',
    }
  };

  const handleNavItemHover = (e, isHovering) => {
    const navItem = e.currentTarget;
    const navLink = navItem.querySelector('.nav-link');

    if (isHovering) {
      navItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      navLink.style.color = '#26d0ce';
      navLink.style.transform = 'translateX(5px)';
      navLink.style.fontWeight = '600';
    } else {
      navItem.style.backgroundColor = '';
      navLink.style.color = 'rgba(255, 255, 255, 0.85)';
      navLink.style.transform = '';
      navLink.style.fontWeight = '';
    }
  };

  const hasPermission = (permissionKey) => {
    if (role !== 'assistant') return true;
    return permissions?.[permissionKey] ?? false;
  };

  const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '15px',
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar" style={sidebarStyle}>
      <ul className="nav" style={{ padding: '0' }}>
        <li className="nav-item nav-profile" style={profileSectionStyle}>
          <Link
            to="/profile_superadmin"
            className="nav-link"
            style={profileContentStyle}
          >
            <div style={profileImageContainerStyle}>
              {adminProfile?.image ? (
                <img
                  src={adminProfile.image}
                  alt="profile"
                  style={profileImageStyle}
                />
              ) : assistantProfile?.image ? (
                <img
                  src={assistantProfile.image}
                  alt="profile"
                  style={profileImageStyle}
                />
              ) : (
                <MdAccountCircle style={avatarIconStyle} />
              )}
            </div>
            <div style={userDetailsStyle}>
              <span style={userNameStyle}>
                {adminProfile?.name || assistantProfile?.name || 'Loading...'}
              </span>
              <span style={userRoleStyle}>
                {adminProfile?.email || assistantProfile?.email || 'Loading...'}
              </span>
            </div>
          </Link>
        </li>

        {/* Dashboard */}
        {hasPermission('dashboard') && (
          <li
            className="nav-item"
            style={isPathActive('/dashboard/ifeelincolor') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/dashboard/ifeelincolor"
              style={navLinkStyle}
            >
              <i className="mdi mdi-view-dashboard" style={menuIconStyle}></i>
              <span className="menu-title">Dashboard</span>
            </Link>
          </li>
        )}

        {/* Earnings */}
        {hasPermission('earnings') && (
          <li className="nav-item" style={isPathActive('/subscription-budget-analysis/overview_superadmin') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/subscription-budget-analysis/overview_superadmin"
              style={navLinkStyle}
            >
              <i className="mdi mdi-chart-line" style={menuIconStyle}></i>
              <span className="menu-title">Earnings</span>
            </Link>
          </li>
        )}

        {/* Patients */}
        {hasPermission('patientManagement') && (
          <li
            className="nav-item"
            style={isPathActive('/patient-management/view') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/patient-management/view"
              style={navLinkStyle}
            >
              <i className="mdi mdi-account-multiple" style={menuIconStyle}></i>
              <span className="menu-title">Patient Management</span>
            </Link>
          </li>
        )}

        {/* Clinician */}
        {hasPermission('clinicianManagement') && (
          <li
            className="nav-item"
            style={isPathActive('/clinician-management/view') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/clinician-management/view_superadmin"
              style={navLinkStyle}
            >
              <i className="mdi mdi-doctor" style={menuIconStyle}></i>
              <span className="menu-title">Clinician</span>
            </Link>
          </li>
        )}

        {/* Organization */}
        {hasPermission('organizationManagement') && (
          <li
            className="nav-item"
            style={isPathActive('/organization-management/view') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/organization-management/view"
              style={navLinkStyle}
            >
              <i className="mdi mdi-office-building" style={menuIconStyle}></i>
              <span className="menu-title">Organization</span>
            </Link>
          </li>
        )}

        {/* Assistant */}
        {hasPermission('assistantManagement') && (
          <li
            className="nav-item"
            style={isPathActive('/assistant-management/view') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/assistant-management/view"
              style={navLinkStyle}
            >
              <i className="mdi mdi-account-tie" style={menuIconStyle}></i>
              <span className="menu-title">Assistant</span>
            </Link>
          </li>
        )}

        {/* Create Assistant pages for CRUD operations has permission only for superadmin*/}
        {/* Create Organization registrations page */}

        {/* Portal Plan */}
        {hasPermission('planManagement') && (
          <li
            className="nav-item"
            style={isPathActive('/packages/view_superadmin') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/packages/view_superadmin"
              style={navLinkStyle}
            >
              <i className="mdi mdi-clipboard-list-outline" style={menuIconStyle}></i>
              <span className="menu-title">Plan Management</span>
            </Link>
          </li>
        )}

        {/* Recommandations */}
        {hasPermission('recommendation') && (
          <li
            className="nav-item"
            style={isPathActive('/recommendation/overview') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/recommendation/overview"
              style={navLinkStyle}
            >
              <i className="mdi mdi-lightbulb-on" style={menuIconStyle}></i>
              <span className="menu-title">Recommendations</span>
            </Link>
          </li>
        )}

        {/* Subscriptions dropdown - show if any subscription permission is true */}
        {(hasPermission('patientSubscription') ||
          hasPermission('clinicianSubscription') ||
          hasPermission('organizationSubscription')) && (
            <li className="nav-item" style={isPathActive('/subscription-management') ? activeNavItemStyle : navItemStyle}>
              <div className="nav-link" onClick={() => toggleMenuState('subscriptionManagementMenuOpen')} style={navLinkStyle}>
                <i className="mdi mdi-card-account-details" style={menuIconStyle}></i>
                <span className="menu-title">Subscriptions</span>
                <i className={`mdi ${menuState.subscriptionManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`} />
              </div>
              <Collapse in={menuState.subscriptionManagementMenuOpen}>
                <ul className="nav flex-column sub-menu">
                  {hasPermission('patientSubscription') && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/subscription-management/portal"
                        style={navLinkStyle}
                      >
                        <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                        Portal
                      </Link>
                    </li>
                  )}
                  {hasPermission('clinicianSubscription') && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/subscription-management/clinician" style={navLinkStyle}
                      >
                        <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                        Clinician</Link>
                    </li>
                  )}
                  {hasPermission('organizationSubscription') && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/subscription-management/organization" style={navLinkStyle}
                      >
                        <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                        Organization</Link>
                    </li>
                  )}
                </ul>
              </Collapse>
            </li>
          )}

        {/* Assessments */}
        {hasPermission('assessments') && (
          <li className="nav-item" style={isPathActive('/test-management') ? activeNavItemStyle : navItemStyle}>
            <div
              className={`nav-link ${menuState.testManagementMenuOpen ? 'menu-expanded' : ''}`}
              onClick={() => toggleMenuState('testManagementMenuOpen')}
              style={navLinkStyle}
            >
              <i className="mdi mdi-clipboard-text" style={menuIconStyle}></i>
              <span className="menu-title">Assessment</span>
              <i className={`mdi ${menuState.testManagementMenuOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'}`} />
            </div>
            <Collapse in={menuState.testManagementMenuOpen}>
              <ul className="nav flex-column m-0 p-0 sub-menu">
                {/* <li className="nav-item" style={navItemStyle}>
                  <Link className={isPathActive('/test-management/manage') ? 'nav-link active' : 'nav-link'} to="/test-management/manage"
                    style={navLinkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                      e.currentTarget.style.color = navLinkHoverStyle.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = navLinkStyle.color;
                    }}
                  >
                    <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                    <span className="menu-title m-0 p-0">Manage</span>
                  </Link>
                </li> */}
                <li className="nav-item" style={navItemStyle}>
                  <Link className={isPathActive('/test-management/mood-assessments') ? 'nav-link active' : 'nav-link'} to="/test-management/mood-assessments"
                    style={navLinkStyle}
                  >
                    <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                    <span className=" m-0 p-0">Mood </span>
                  </Link>
                </li>
                <li className="nav-item" style={navItemStyle}>
                  <Link className={isPathActive('/test-management/body-assessments') ? 'nav-link active' : 'nav-link'} to="/test-management/body-assessments"
                    style={navLinkStyle}
                  >
                    <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                    <span className=" m-0 p-0">Body </span>
                  </Link>
                </li>
                {/* <li className="nav-item" style={navItemStyle}>
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props) => renderTooltip(props, "Mood Level Assessments")}
                  >
                    <Link className={isPathActive('/test-management/mood-level-assessments') ? 'nav-link active' : 'nav-link'} to="/test-management/mood-level-assessments"
                      style={{...navLinkStyle, ...menuItemStyle}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                        e.currentTarget.style.color = navLinkHoverStyle.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = navLinkStyle.color;
                      }}
                    >
                      <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                      <span className="menu-title m-0 p-0">Mood Level Assessments</span>
                    </Link>
                  </OverlayTrigger>
                </li> */}

                {/* <li className="nav-item" style={navItemStyle}>
                  <Link className={isPathActive('/test-management/ai-questions') ? 'nav-link active' : 'nav-link'} to="/test-management/ai-questions"
                    style={navLinkStyle}
                  >
                    <i className='mdi mdi-arrow-right fs-6' style={subMenuIconStyle}></i>
                    <span className=" m-0 p-0">ChatBot</span>
                  </Link>
                </li> */}
              </ul>
            </Collapse>
          </li>
        )}


        {hasPermission('announcements') && (
          <li
            className="nav-item"
            style={isPathActive('/banner-management/view') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link
              className="nav-link"
              to="/banner-management/view"
              style={navLinkStyle}
            >
              <i className="mdi mdi-bullhorn" style={menuIconStyle}></i>
              {/* <span className="menu-title">Banner Management</span> */}
              <span className="menu-title">Announcements</span>
            </Link>
          </li>
        )}

        {/* Permissions */}
        {sessionStorage.getItem('role') === 'Admin' && (
          <li
            className="nav-item"
            style={isPathActive('/permissions') ? activeNavItemStyle : navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Link className="nav-link" to="/permissions"
              style={navLinkStyle}
            >
              <i className="mdi mdi-shield-account" style={menuIconStyle}></i>
              <span className="menu-title">Permissions</span>
            </Link>
          </li>
        )}

        {/* <li className="nav-item" style={isPathActive('/settings') ? activeNavItemStyle : navItemStyle}
        >
          <Link className="nav-link" to="/settings"
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-cogs" style={menuIconStyle}></i>
            <span className="menu-title">Settings</span>
          </Link>
        </li> */}

        {/* Payments */}
        {hasPermission('payments') && (

        <li
          className="nav-item"
          style={isPathActive('/payment/organization') ? activeNavItemStyle : navItemStyle}
          onMouseEnter={(e) => handleNavItemHover(e, true)}
          onMouseLeave={(e) => handleNavItemHover(e, false)}
        >
          <Link
            className="nav-link"
            to="/payment/organization"
            style={navLinkStyle}
          >
            <i className="mdi mdi-cash-register" style={menuIconStyle}></i>
            <span className="menu-title">Payment Setup</span>
          </Link>
        </li>
        )}

      </ul>
    </nav>
  );
};

export default Sidebar;