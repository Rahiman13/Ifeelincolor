import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import { FaEllipsisV, FaPlus, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import './TestsPage.scss'
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton, MenuItem, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import BaseUrl from '../../api';

const dummyImage = 'path/to/dummy/image.png'; // Path to your dummy image

// Styled components for the modal
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#fff',
  background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
  borderBottom: '2px solid #e0e0e0',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '20px',
  backgroundColor: '#f9f9f9',
}));

const StyledButton = styled(MuiButton)(({ theme }) => ({
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    type: 'mcq', // Default type
    score: 0,
    category: '',
    media: null,
    mcqOptions: [{ text: '', isCorrect: false }] // Default option
  });
  const [imageFiles, setImageFiles] = useState({});

  useEffect(() => {
    const fetchTests = async () => {
      const token = sessionStorage.getItem('token');
      const role = sessionStorage.getItem('role');

      if (role === 'Admin' && token) {
        try {
          // const response = await axios.get('https://rough-1-gcic.onrender.com/api/test', {
          const response = await axios.get(`${BaseUrl}/api/test`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.status === 'success') {
            setTests(response.data.body);
          }
        } catch (error) {
          console.error('Error fetching tests:', error);
        }
      }
    };

    fetchTests();
  }, []);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setFormData({
      question: '',
      answer: '',
      type: 'mcq',
      score: 0,
      category: '',
      media: null,
      mcqOptions: [{ text: '', isCorrect: false }]
    });
    setImageFiles({});
    setShowCreateModal(false);
  };

  const handleShowViewModal = async (testId) => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (role === 'Admin' && token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/test/${testId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setSelectedTest(response.data.body);
          setShowViewModal(true);
        }
      } catch (error) {
        console.error('Error fetching test details:', error);
      }
    }
  };

  const handleCloseViewModal = () => setShowViewModal(false);

  const handleShowEditModal = async (testId) => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (role === 'Admin' && token) {
      try {
        const response = await axios.get(`${BaseUrl}/api/test/${testId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setFormData(response.data.body); // Set form data for editing
          setShowEditModal(true);
        }
      } catch (error) {
        console.error('Error fetching test details for editing:', error);
      }
    }
  };

  const handleCloseEditModal = () => {
    setFormData({
      question: '',
      answer: '',
      type: 'mcq',
      score: 0,
      category: '',
      media: null,
      mcqOptions: [{ text: '', isCorrect: false }]
    });
    setImageFiles({});
    setShowEditModal(false);
  };

  const handleCreateTest = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (role === 'Admin' && token) {
      try {
        const response = await axios.post(`${BaseUrl}/api/test/create`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setTests([...tests, response.data.body]); // Add the new test to the state
          handleCloseCreateModal(); // Close the modal
          toast.success('Test created successfully!'); // Show success toast
        }
      } catch (error) {
        console.error('Error creating test:', error);
        toast.error('Error creating test!'); // Show error toast
      }
    }
  };

  const handleEditTest = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (role === 'Admin' && token) {
      try {
        const response = await axios.put(`${BaseUrl}/api/test/${formData._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status === 'success') {
          setTests(tests.map(test => (test._id === formData._id ? formData : test))); // Update the tests state
          setShowEditModal(false); // Close the modal
          toast.success('Test updated successfully!'); // Show success toast
        }
      } catch (error) {
        console.error('Error updating test:', error);
        toast.error('Error updating test!'); // Show error toast
      }
    }
  };

  const handleDeleteTest = async (testId) => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if (role === 'Admin' && token) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(`${BaseUrl}/api/test/${testId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.status === 'success') {
              setTests(tests.filter(test => test._id !== testId)); // Remove the deleted test from the state
              Swal.fire('Deleted!', 'Your test has been deleted.', 'success'); // Show success alert
            }
          } catch (error) {
            console.error('Error deleting test:', error);
            toast.error('Error deleting test!'); // Show error toast
          }
        }
      });
    }
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = formData.questions.map((q, i) =>
      i === index ? { ...q, [e.target.name]: e.target.value } : q
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = (type) => {
    const newQuestion = { type, question: '', image: '' };
    if (type === 'MCQ') { 
      newQuestion.options = ['', ''];
      newQuestion.correctAnswer = '';
    } else if (type === 'Blank') {
      newQuestion.answer = '';
    } else if (type === 'Video') {
      newQuestion.videoLink = '';
      newQuestion.options = ['', ''];
      newQuestion.correctAnswer = '';
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFiles({
          ...imageFiles,
          [index]: reader.result
        });
        const updatedQuestions = formData.questions.map((q, i) =>
          i === index ? { ...q, image: reader.result } : q
        );
        setFormData({ ...formData, questions: updatedQuestions });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleOptionChange = (qIndex, optIndex, e) => {
    const updatedQuestions = formData.questions.map((q, i) =>
      i === qIndex
        ? {
          ...q,
          options: q.options.map((opt, j) => (j === optIndex ? e.target.value : opt)),
        }
        : q
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('YOUR_API_ENDPOINT');
      if (response.status === 200) {
        // Process the response
      } else {
        console.error('Error fetching notifications:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="tests-page p-3">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-clipboard-text fs-5"></i>
          </span> Test Management </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span>
                Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <Container fluid >
        <div className='add-btn'>
          <Button variant="primary" onClick={handleShowCreateModal} className="test-btn mb-4 float-right"><FaPlus /> Create Test</Button>
        </div>
        <Row>
          {tests.map(test => (
            <Col md={4} key={test._id} className="mb-3">
              <Card style={{ height: '100%', position: 'relative' }}> {/* Ensure all cards have the same height */}
                <Card.Img variant="top" src={test.media || dummyImage} style={{ height: '200px', objectFit: 'cover' }} /> {/* Use dummy image if media is null */}
                <Dropdown className='test-dropdown' style={{ position: 'absolute', top: '10px', right: '10px', borderRadius: '50px' }}>
                  <Dropdown.Toggle variant="secondary" className='test-dropdown-toggle' style={{borderRadius: '50%', padding: '10px 10px'}} id="dropdown-basic">
                    <FaEllipsisV className='fs-7 text-dark'/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='test-dropdown-menu'>
                    <Dropdown.Item onClick={() => handleShowViewModal(test._id)}><FaEye /> View</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleShowEditModal(test._id)}><FaEdit /> Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteTest(test._id)}><FaTrashAlt /> Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Card.Body>
                  <Card.Title>{test.question}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{test.categoryModel}</Card.Subtitle>
                  <Card.Text>
                    {/* Display additional test information if needed */}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Create Test Modal */}
      <StyledDialog open={showCreateModal} onClose={handleCloseCreateModal} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          Create Test
        </StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="mcq">MCQ</MenuItem>
            <MenuItem value="blanks">Blanks</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Score"
            type="number"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Media URL"
            value={formData.media}
            onChange={(e) => setFormData({ ...formData, media: e.target.value })}
          />
          {/* MCQ Options */}
          {formData.type === 'mcq' && formData.mcqOptions.map((option, index) => (
            <div key={index} className="mb-2">
              <TextField
                fullWidth
                margin="normal"
                label={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => {
                  const updatedOptions = [...formData.mcqOptions];
                  updatedOptions[index].text = e.target.value;
                  setFormData({ ...formData, mcqOptions: updatedOptions });
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={(e) => {
                      const updatedOptions = [...formData.mcqOptions];
                      updatedOptions[index].isCorrect = e.target.checked;
                      setFormData({ ...formData, mcqOptions: updatedOptions });
                    }}
                  />
                }
                label="Correct Answer"
              />
            </div>
          ))}
          {formData.type === 'mcq' && (
            <MuiButton
              variant="outlined"
              onClick={() => setFormData({
                ...formData,
                mcqOptions: [...formData.mcqOptions, { text: '', isCorrect: false }]
              })}
            >
              Add Option
            </MuiButton>
          )}
        </StyledDialogContent>
        <DialogActions>
          <MuiButton onClick={handleCloseCreateModal}>Cancel</MuiButton>
          <StyledButton onClick={handleCreateTest} variant="contained">
            Save Test
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      {/* View Test Modal */}
      <StyledDialog open={showViewModal} onClose={handleCloseViewModal} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          View Test
        </StyledDialogTitle>
        <StyledDialogContent>
          {selectedTest && (
            <div>
              <Typography variant="h6">Question: {selectedTest.question}</Typography>
              <Typography variant="subtitle1">Answer: {selectedTest.answer}</Typography>
              <Typography variant="subtitle1">Type: {selectedTest.type}</Typography>
              <Typography variant="subtitle1">Score: {selectedTest.score}</Typography>
              <Typography variant="subtitle1">Category: {selectedTest.categoryModel}</Typography>
              {selectedTest.media && (
                <img
                  src={selectedTest.media}
                  alt="Test Media"
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', marginTop: '10px' }}
                />
              )}
            </div>
          )}
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewModal}>Close</Button>
        </DialogActions>
      </StyledDialog>

      {/* Edit Test Modal */}
      <StyledDialog open={showEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <StyledDialogTitle>
          Edit Test
        </StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Question"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Answer"
            value={formData.answer}
            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="mcq">MCQ</MenuItem>
            <MenuItem value="blanks">Blanks</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Score"
            type="number"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Media URL"
            value={formData.media}
            onChange={(e) => setFormData({ ...formData, media: e.target.value })}
          />
          {/* MCQ Options */}
          {formData.type === 'mcq' && formData.mcqOptions.map((option, index) => (
            <div key={index} className="mb-2">
              <TextField
                fullWidth
                margin="normal"
                label={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => {
                  const updatedOptions = [...formData.mcqOptions];
                  updatedOptions[index].text = e.target.value;
                  setFormData({ ...formData, mcqOptions: updatedOptions });
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={option.isCorrect}
                    onChange={(e) => {
                      const updatedOptions = [...formData.mcqOptions];
                      updatedOptions[index].isCorrect = e.target.checked;
                      setFormData({ ...formData, mcqOptions: updatedOptions });
                    }}
                  />
                }
                label="Correct Answer"
              />
            </div>
          ))}
          {formData.type === 'mcq' && (
            <MuiButton
              variant="outlined"
              onClick={() => setFormData({
                ...formData,
                mcqOptions: [...formData.mcqOptions, { text: '', isCorrect: false }]
              })}
            >
              Add Option
            </MuiButton>
          )}
        </StyledDialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <StyledButton onClick={handleEditTest} variant="contained">
            Save Changes
          </StyledButton>
        </DialogActions>
      </StyledDialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
