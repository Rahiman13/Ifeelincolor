import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './AppRouter';
import Sidebar from './component/Shared/Sidebar';
import SidebarOrganization from './component/Shared/Sidebar_Organization';
import Footer from './component/Shared/Footer';
import Navbar from './component/Shared/Navbar';
import Navbar_superadmin from './component/Shared/Navbar_superadmin';
import styled from '@emotion/styled';


const App = () => {
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onRouteChanged = () => {
      console.log("ROUTE CHANGED");
      const body = document.querySelector('body');
      const pageBodyWrapper = document.querySelector('.page-body-wrapper');

      window.scrollTo(0, 0);

      const fullPageLayoutRoutes = [
        '/',
        '/landingpage',
        '/landingpage_Ifeelincolor',
        '/organization-login',
        '/organization-register',
        '/organization-forget',
        '/manager-login',
        '/manager-forget',
        '/orgadmin-login',
        '/orgadmin-forget',
        '/assistant-login',
        '/assistant-forget',
        '/login',
        '/admin',
        '/forget',
        '/user-pages/lockscreen',
        '/error-pages/error-404',
        '/error-pages/error-500',
        '/general-pages/landing-page',
        '/error-pages/error-404',
        '/error-pages/error-500',
        '/payment/stripe',
      ];

      const isFullPage = fullPageLayoutRoutes.includes(location.pathname);
      setIsFullPageLayout(isFullPage);

      if (pageBodyWrapper) {
        if (isFullPage) {
          pageBodyWrapper.classList.add('full-page-wrapper');
        } else {
          pageBodyWrapper.classList.remove('full-page-wrapper');
        }
      }
    };

    onRouteChanged();
  }, [location.pathname]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const adminPortal = sessionStorage.getItem('adminPortal');

    if (token) {
      const parsedToken = JSON.parse(atob(token.split('.')[1]));
      setUserRole(parsedToken.role);
    }
    setIsAdminPortal(adminPortal === 'true');
  }, []);

  return (
    <div className="container-scroller entire-body ">
      {!isFullPageLayout && (
        isAdminPortal ? <Navbar_superadmin /> : <Navbar />
      )}
      <div className="container-fluid page-body-wrapper d-flex">
        {!isFullPageLayout && (
          isAdminPortal ? <Sidebar /> : <SidebarOrganization />
        )}
        <div className="main-panel">
          <div className="container-scroller">
            <AppRoutes />
          </div>
          {/* <Footer /> */}
          {!isFullPageLayout && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default App;
