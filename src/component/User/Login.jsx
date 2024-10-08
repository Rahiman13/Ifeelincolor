import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/lockscreen-bg.jpg';
import './login.scss';
import BaseUrl from '../../api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'organization', // Default role
  });

  const [loading, setLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    // Determine the API endpoint based on the selected role
    const loginUrl = role === 'organization'
      ? `${BaseUrl}/api/organization/login`
      : `${BaseUrl}/api/${role}/login`;

    setLoading(true); // Show loading spinner

    try {
      const response = await axios.post(loginUrl, { email, password });

      if (response.data.status === 'success') {
        toast.success('Login successful!');

        // Save token and organization ID based on role
        // sessionStorage.setItem('token', response.data.body.token);
        // console.log(response.data.body)
        // console.log(response.data.body._id)

        if (role === 'organization') {
          console.log(response.data.body.organization.token)
          // Save the organization ID directly
          sessionStorage.setItem('token', response.data.body.organization.token);
          sessionStorage.setItem('OrganizationId', response.data.body.organization.id);
        } else if (role === 'orgadmin') {
          // Save the organization ID of the admin or manager
          // sessionStorage.setItem('organizationId', response.data.body.Organization);
          sessionStorage.setItem('token', response.data.body.token);
          sessionStorage.setItem('OrganizationId', response.data.body.orgAdmin.organization);
        } else {
          sessionStorage.setItem('token', response.data.body.token);

          sessionStorage.setItem('OrganizationId', response.data.body.manager.organization)
        }

        setTimeout(() => {
          navigate('/dist/dashboard'); // Navigate to the dashboard
          setLoading(false); // Hide loading spinner
        }, 3000); // 3 seconds delay
      } else {
        setLoading(false); // Hide loading spinner
        toast.error('Invalid credentials');
      }
    } catch (error) {
      setLoading(false); // Hide loading spinner
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div
      className="login d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-8">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5 bg-white rounded shadow">
              <div className="brand-logo text-center mb-2">
                <img src={Logo} alt="logo" className="logo-img" />
              </div>
              <h4 className="text-center mb-2">Hello! Let's get started</h4>
              <h6 className="font-weight-light text-center mb-3">
                Sign in to continue.
              </h6>
              <Form onSubmit={handleSubmit} className="pt-3">
                <Form.Group className="mb-3" controlId="role">
                  <Form.Label>Select Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="organization">Organization</option>
                    <option value="orgadmin">Admin</option>
                    <option value="manager">Manager</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    size="lg"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </Form.Group>
                <div className="mt-3 d-flex justify-content-center">
                  <Button
                    type="submit"
                    className="btn btn-block login-btn"
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'SIGN IN'
                    )}
                  </Button>
                </div>
                <div className="my-3 d-flex justify-content-end align-items-center">
                  <Link to='/dist/forget' className="auth-link underline">Forgot password?</Link>
                </div>
                {/* <div className="text-center mt-4 font-weight-light">
                  Don't have an account?{' '}
                  <Link to="/dist/" className="text-primary">Create</Link>
                </div> */}
              </Form>
              <ToastContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
