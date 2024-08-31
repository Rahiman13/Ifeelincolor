import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard/dashboard';
import PatientPage from './component/Patient/PatientPage';
import BannerOverview from './component/banner-management/ViewBanner';
import Login from './component/User/Login';
import LoginAdmin from './component/User/Login admin';
import Register from './component/User/Register';
import Spinner from './component/Shared/Spinner';
import Error404 from './component/Error/Error_404';
import Error500 from './component/Error/Error_500';
import BudgetAnalysis from './component/Budget/BudgetOverview';
import PortalSubscriptions from './component/subscription-management/PortalSubscriptions'
import ClinicianSubscriptions from './component/subscription-management/ClinicianSubscriptions'
import OrganizationSubscriptions from './component/subscription-management/OrganizationSubscriptions'
import ManageAssessment from './component/Assessment/ManageAssessment'
import AISuggestedQuestions from './component/Assessment/AISuggestedQuestions'
import Settings from './component/Settings/Settings';
import ProfilePage from './component/Profile/Profile';
import ProtectedRoute from './component/Protected/ProtectedRoute'
import ForgetPassword from './component/User/ForgetPassword';


const AppRouter = () => {
  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/dist/" element={<Login />} />
          <Route path="/dist/register" element={<Register />} />
          <Route path="/dist/admin" element={<LoginAdmin />} />
          <Route path="/dist/forget" element={<ForgetPassword />} />
          {/* Error Pages */}
          <Route path="/dist/error-pages/error-404" element={<Error404 />} />
          <Route path="/dist/error-pages/error-500" element={<Error500 />} />

          <Route path="/dist/dashboard" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
          <Route path="/dist/patient-management/view" element={<ProtectedRoute>
            <PatientPage />
          </ProtectedRoute>} />
          <Route path="/dist/banner-management/view" element={<ProtectedRoute>
            <BannerOverview />
          </ProtectedRoute>} />
          <Route path="/dist/subscription-budget-analysis/overview" element={<ProtectedRoute>
            <BudgetAnalysis />
          </ProtectedRoute>} />
          {/*Subscriptions  */}
          <Route path="/dist/subscription-management/portal" element={<ProtectedRoute><PortalSubscriptions /> </ProtectedRoute>} />
          <Route path="/dist/subscription-management/clinician" element={<ProtectedRoute><ClinicianSubscriptions /></ProtectedRoute>} />
          <Route path="/dist/subscription-management/organization" element={<ProtectedRoute><OrganizationSubscriptions /></ProtectedRoute>} />

          {/* Test Management */}
          <Route path="/dist/test-management/manage" element={<ProtectedRoute><ManageAssessment /></ProtectedRoute>} />
          <Route path="/dist/test-management/ai-questions" element={<ProtectedRoute><AISuggestedQuestions /></ProtectedRoute>} />

          {/* Settings */}
          <Route path="/dist/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Profile */}
          <Route path="/dist/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />




          {/* Add more routes as needed */}
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRouter;
