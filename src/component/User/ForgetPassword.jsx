import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import BaseUrl from '../../api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('organization'); // Default role
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const apiEndpoints = {
        organization: {
            forgotPassword: `${BaseUrl}/api/organization/forgot-password`,
            resetPassword: `${BaseUrl}/api/organization/reset-password`,
        },
        orgadmin: {
            forgotPassword: `${BaseUrl}/api/orgadmin/forgot-password`,
            resetPassword: `${BaseUrl}/api/orgadmin/reset-password`,
        },
        manager: {
            forgotPassword: `${BaseUrl}/api/manager/forgot-password`,
            resetPassword: `${BaseUrl}/api/manager/reset-password`,
        },
    };

    const validateForm = () => {
        const newErrors = {};
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

        if (showModal) {
            if (!otp) newErrors.otp = 'OTP is required';
            if (!newPassword) newErrors.newPassword = 'New password is required';
            else if (!passwordPattern.test(newPassword)) newErrors.newPassword = 'Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character';
            if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(apiEndpoints[role].forgotPassword, { email });

            if (response.status === 200) {
                toast.success('OTP sent to your email!', {
                    position: 'top-right',
                });
                setShowModal(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP', {
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post(apiEndpoints[role].resetPassword, { otp, newPassword });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Password reset successfully!',
                }).then(() => {
                    // Redirect to login page after successful reset
                    window.location.href = '/';
                });
                setShowModal(false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to reset password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '100%', maxWidth: '500px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div className="text-center mb-4">
                    <FaLock size={50} style={{ color: '#6a11cb' }} />
                </div>
                <h2 className="text-center mb-4">Forgot Password</h2>

                <Form noValidate>
                    <Form.Group controlId="roleSelection" className="mb-3">
                        <Form.Label>Role:</Form.Label>
                        <Form.Control
                            as="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{ borderRadius: '30px', padding: '10px 15px' }}
                        >
                            <option value="organization">Organization</option>
                            <option value="orgadmin">Admin</option>
                            <option value="manager">Manager</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="emailInput" className="mb-3">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            isInvalid={!!errors.email}
                            style={{ borderRadius: '30px', padding: '10px 15px' }}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        onClick={handleSendOtp}
                        disabled={loading}
                        style={{
                            backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '30px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            width: '100%',
                            marginBottom: '20px'
                        }}
                    >
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Send OTP'}
                    </Button>
                </Form>

                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Enter OTP</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="otpInput" className="mb-3">
                            <Form.Label>OTP:</Form.Label>
                            <Form.Control
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                isInvalid={!!errors.otp}
                                style={{ borderRadius: '5px' }}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.otp}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="newPasswordInput" className="mb-3">
                            <Form.Label>New Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                isInvalid={!!errors.newPassword}
                                style={{ borderRadius: '5px' }}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.newPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="confirmPasswordInput" className="mb-3">
                            <Form.Label>Confirm New Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                isInvalid={!!errors.confirmPassword}
                                style={{ borderRadius: '5px' }}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '5px' }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleResetPassword}
                            disabled={loading}
                            style={{
                                backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Reset Password'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ToastContainer />
            </Card>
        </Container>
    );
};

export default ForgotPassword;
