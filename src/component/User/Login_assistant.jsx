import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../../assets/logo.svg';
import bg from '../../assets/bg-3.png';
import { Link, useNavigate } from 'react-router-dom';
import BaseUrl from '../../api';


const apiUrl = `${BaseUrl}/api/assistant/login`;

const AssistantLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(apiUrl, { email, password });
      
      if (response.data.status === 'success') {
        // Store token and role in sessionStorage
        sessionStorage.setItem('token', response.data.body.token);
        sessionStorage.setItem('role', response.data.body.role);
        sessionStorage.setItem('assistantPortal', 'true');
        
        // Show success message
        toast.success(response.data.message || 'Login successful!');
        
        // Navigate after delay
        setTimeout(() => {
          navigate('/dashboard/ifeelincolor');
        }, 2000);
      }
    } catch (err) {
      // Handle error cases
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Left side: Description */}
      <div className="col-lg-7 p-0 d-none d-lg-block">
        <div
          className="h-100 d-flex flex-column justify-content-center p-5"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h1 className="display-4 text-white mb-4" style={{ fontWeight: 300 }}>Welcome to IFEELINCOLOR Assistant Portal</h1>
          <p className="lead text-white-50 mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Join our community of color psychology experts. Help businesses and individuals harness the power of color to create meaningful and impactful experiences through our innovative platform.
          </p>
        </div>
      </div>
      
      {/* Right side: Login form */}
      <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white">
        <div className="w-75">
          <div className="text-center mb-5">
            <img src={Logo} alt="IFEELINCOLOR logo" className="mb-4" style={{ maxWidth: '300px' }} />
            <h2 style={{ fontWeight: 300, color: '#333', letterSpacing: '1px' }}>IFEELINCOLOR Assistant Sign In</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Access your IFEELINCOLOR Assistant dashboard</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control-lg"
                disabled={loading}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="password">
              <Form.Label style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control-lg"
                disabled={loading}
              />
            </Form.Group>
            <div className="d-flex justify-content-end align-items-center mb-4">
              <Link to='/assistant-forget' style={{ fontSize: '0.9rem', color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
            </div>
            <Button
              type="submit"
              className="btn btn-primary btn-lg w-100"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'SIGN IN'}
            </Button>
            <ToastContainer />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AssistantLogin;
