import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import '@mdi/font/css/materialdesignicons.min.css';
import axios from 'axios';
import BaseUrl from '../../api';


const Sidebar = () => {
  const [menuState, setMenuState] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const location = useLocation();

  // Get the user role and token from session storage
  const role = sessionStorage.getItem('role') || '';
  const token = sessionStorage.getItem('token') || '';

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          let response;
          if (role === 'organization') {
            response = await axios.get(`${BaseUrl}/api/organization/me`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } else if (role === 'manager') {
            response = await axios.get(`${BaseUrl}/api/manager/info`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }

          if (response && response.data.status === 'success') {
            setUserDetails(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, [role, token]);

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
      { path: '/dashboard', state: 'dashboardMenuOpen' },
      { path: '/patient-management/view', state: 'patientManagementMenuOpen' },
      { path: '/clinicians/view', state: 'clinicianMenuOpen' },
      { path: '/subscription-management/organization_portal', state: 'subscriptionManagementMenuOpen' },
      { path: '/banner-management/view', state: 'bannerAnnouncementManagementMenuOpen' },
      { path: '/subscription-budget-analysis/overview', state: 'subscriptionBudgetAnalysisMenuOpen' },
      { path: '/packages/view', state: 'PlanManagementMenuOpen' },
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

  useEffect(() => {
    onRouteChanged();
    const body = document.querySelector('body');
    const sidebarItems = document.querySelectorAll('.sidebar .nav-item');

    sidebarItems.forEach((el) => {
      const handleMouseOver = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      };

      const handleMouseOut = () => {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
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

  const sidebarStyle = {
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Roboto', sans-serif",
    color: '#26d0ce !important',
  };

  const navItemStyle = {
    margin: '5px 8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    color: '#26d0ce !important',
  };

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 10px',
    color: 'rgba(255, 255, 255, 0.8)',
    // color: '#fff',
    textDecoration: 'none',
    transition: 'all 0.3s ease-in-out',
  };

  const navItemHoverStyle = {
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // transform: 'translateY(-2px)',
    backgroundColor: 'transparent !important',
    color: '#26d0ce !important',
  };

  const navLinkHoverStyle = {
    color: '#26d0ce',
  };

  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const menuIconStyle = {
    fontSize: '22px',
    marginRight: '12px',
    color: '#26d0ce',
  };

  const profileSectionStyle = {
    padding: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '20px',
    color: '#26d0ce !important',
  };

  const profileContentStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const profileImageContainerStyle = {
    position: 'relative',
    marginRight: '15px',
    flexShrink: 0,
    width: '60px',
    height: '60px',
  };

  const profileImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
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

  const userDetailsStyle = {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const userNameStyle = {
    fontWeight: '500',
    fontSize: '16px',
    marginBottom: '2px',
    color: '#26d0ce',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };


  const userRoleStyle = {
    fontSize: '14px',
    // color: 'rgba(255, 255, 255, 0.7)',
    color: '#26d0ce',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar" style={sidebarStyle}>
      <ul className="nav" style={{ padding: '0' }}>
        {/* Profile Section */}
        <li className="nav-item nav-profile" style={profileSectionStyle}>
          <Link
            to="/profile"
            style={{ ...navLinkStyle, ...profileContentStyle }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={profileImageContainerStyle}>
              {(role === 'organization' && userDetails?.image) || (role === 'manager' && userDetails?.organization?.image) ? (
                <img
                  src={role === 'organization' ? userDetails.image : userDetails.organization.image}
                  alt="profile"
                  style={profileImageStyle}
                />
              ) : (
                <i
                  className="mdi mdi-account-circle"
                  style={{
                    ...profileImageStyle,
                    fontSize: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                ></i>
              )}
              <span style={onlineStatusStyle}></span>
            </div>
            <div style={userDetailsStyle}>
              <span style={userNameStyle}>
                {role === 'organization' ? userDetails?.name : userDetails?.manager?.name || 'User'} <br />
                {/* {role === 'manager' && (
                  <span style={{ ...userRoleStyle, fontSize: '14px' }} className='pt-0'>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                )} */}
              </span>
              <span style={userRoleStyle}>
                {role === 'organization' ? userDetails?.email : userDetails?.manager?.email || 'Organization'}
              </span>
            </div>
          </Link>
        </li>

        {/* Common for all roles: Dashboard */}
        <li
          className="nav-item"
          style={isPathActive(role === 'organization' ? '/dashboard' : '/dashboard/orgmanager') ? activeNavItemStyle : navItemStyle}
        >
          <Link
            className="nav-link"
            to={role === 'organization' ? '/dashboard' : '/dashboard/orgmanager'}
            style={navLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
              e.currentTarget.style.transform = navItemHoverStyle.transform;
              e.currentTarget.style.color = navLinkHoverStyle.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.color = navLinkStyle.color;
            }}
          >
            <i className="mdi mdi-view-dashboard" style={menuIconStyle}></i>
            <span className="menu-title">Dashboard</span>
          </Link>
        </li>

        {(role === 'organization' || role === 'manager' || role === 'orgadmin') && (
          <li
            className="nav-item"
            style={isPathActive('/subscription-budget-analysis/overview') ? activeNavItemStyle : navItemStyle}
          >
            <Link
              className="nav-link"
              to="/subscription-budget-analysis/overview"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                e.currentTarget.style.transform = navItemHoverStyle.transform;
                e.currentTarget.style.color = navLinkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = navLinkStyle.color;
              }}
            >
              <i className="mdi mdi-chart-line" style={menuIconStyle}></i>
              <span className="menu-title">Earnings</span>
            </Link>
          </li>
        )}

        {(role === 'organization' || role === 'orgadmin' || role === 'manager') && (
          <li
            className="nav-item"
            style={isPathActive('/subscription-management/organization_portal') ? activeNavItemStyle : navItemStyle}
          >
            <Link
              className="nav-link"
              to="/subscription-management/organization_portal"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                e.currentTarget.style.transform = navItemHoverStyle.transform;
                e.currentTarget.style.color = navLinkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = navLinkStyle.color;
              }}
            >
              <i className="mdi mdi-card-account-details" style={menuIconStyle}></i>
              <span className="menu-title">Subscriptions</span>
            </Link>
          </li>
        )}

        {role === 'organization' && (
          <li
            className="nav-item"
            style={isPathActive('/packages/view') ? activeNavItemStyle : navItemStyle}
          >
            <Link
              className="nav-link"
              to="/packages/view"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                e.currentTarget.style.transform = navItemHoverStyle.transform;
                e.currentTarget.style.color = navLinkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = navLinkStyle.color;
              }}
            >
              <i className="mdi mdi-clipboard-list-outline" style={menuIconStyle}></i>
              <span className="menu-title">Plan Management</span>
            </Link>
          </li>
        )}

        {(role === 'organization' || role === 'orgadmin') && (
          <li
            className="nav-item"
            style={isPathActive('/managers-management/view') ? activeNavItemStyle : navItemStyle}
          >
            <Link
              className="nav-link"
              to="/managers-management/view"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                e.currentTarget.style.transform = navItemHoverStyle.transform;
                e.currentTarget.style.color = navLinkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = navLinkStyle.color;
              }}
            >
              <i className="mdi mdi-account-tie" style={menuIconStyle}></i>
              <span className="menu-title">Managers</span>
            </Link>
          </li>
        )}

        {(role === 'organization' || role === 'orgadmin' || role === 'manager') && (
          <li
            className="nav-item"
            style={isPathActive('/clinician-management/view') ? activeNavItemStyle : navItemStyle}
          >
            <Link
              className="nav-link"
              to="/clinician-management/view"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = navItemHoverStyle.backgroundColor;
                e.currentTarget.style.transform = navItemHoverStyle.transform;
                e.currentTarget.style.color = navLinkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
                e.currentTarget.style.color = navLinkStyle.color;
              }}
            >
              <i className="mdi mdi-doctor" style={menuIconStyle}></i>
              <span className="menu-title">Clinician</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
