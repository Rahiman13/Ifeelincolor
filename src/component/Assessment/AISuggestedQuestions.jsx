import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { alpha, ThemeProvider, createTheme, } from '@mui/material/styles';
// import { Box, Button, TextField, Typography, Tooltip } from '@mui/material';
import { Card, Typography, Box, Tabs, Tab, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Modal, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, TablePagination, useMediaQuery, useTheme, CircularProgress, Paper, Chip, Tooltip, LinearProgress, Badge } from '@mui/material';

import Icon from '@mdi/react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { mdiRobot, mdiAlertCircleOutline } from '@mdi/js';


// Add new styled components
const TypingIndicator = styled(motion.div)`
  padding: 12px 16px;
  background: #F3F4F6;
  border-radius: 16px;
  align-self: flex-start;
  display: flex;
  gap: 4px;
  
  span {
    width: 8px;
    height: 8px;
    background: #6366F1;
    border-radius: 50%;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 24px;
  color: white;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 70%);
  }
`;

const MessageWrapper = styled(motion.div)`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: ${props => props.$isBot ? '0 auto 0 0' : '0 0 0 auto'};
  max-width: 80%;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isBot ? '#4F46E5' : '#6366F1'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Timestamp = styled.span`
  font-size: 10px;
  color: #9CA3AF;
  ${props => props.$isBot ? 'margin-left: 8px;' : 'margin-right: 8px; text-align: right;'}
`;

const QuickReplies = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const QuickReply = styled.button`
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #E2E8F0;
  
  &:hover {
    background: rgba(79, 70, 229, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  }
`;

const FileUploadWrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.button`
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  color: #4F46E5;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh; // Fixed height
  min-height: 600px; // Minimum height
  max-height: 800px; // Maximum height
  width: 100%;
  background: linear-gradient(135deg, #1a1c1e 0%, #2c3e50 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  margin: 5px;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(26, 28, 30, 0.8);
  
  /* Fancy scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      135deg,
      rgba(79, 70, 229, 0.4) 0%,
      rgba(124, 58, 237, 0.4) 100%
    );
    border-radius: 4px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    
    &:hover {
      background: linear-gradient(
        135deg,
        rgba(79, 70, 229, 0.6) 0%,
        rgba(124, 58, 237, 0.6) 100%
      );
    }
  }

  /* Ensure messages stay at bottom when new ones arrive */
  & > *:last-child {
    margin-top: auto;
  }
`;

const Message = styled.div`
  padding: 16px 20px;
  background: ${props => props.$isBot
    ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
    : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'};
  color: ${props => props.$isBot ? '#E2E8F0' : '#FFFFFF'};
  border-radius: 20px;
  max-width: 100%;
  border: 1px solid ${props => props.$isBot
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.2)'};
  box-shadow: ${props => props.$isBot
    ? '0 2px 10px rgba(0, 0, 0, 0.1)'
    : '0 4px 15px rgba(79, 70, 229, 0.3)'};
  
  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  background: rgba(26, 28, 30, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 16px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  outline: none;
  font-size: 15px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  color: #E2E8F0;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: white;
  border: none;
  padding: 16px 28px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    background: linear-gradient(135deg, #5D54E3 0%, #8A48EB 100%);
  }
`;

const StyledDashboard = styled('div')(({ theme }) => ({
  background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  fontFamily: "'Poppins', sans-serif",
  color: '#1a365d',
  position: 'relative',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '220px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    zIndex: 0,
    borderRadius: '0 0 50px 50px',
  }
}));

const StyledPageHeader = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  // marginBottom: theme.spacing(3),
  // background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  // padding: theme.spacing(1),
  // boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  // border: '1px solid rgba(255, 255, 255, 0.2)',
  '.page-title': {
    fontSize: '3rem',
    fontWeight: 700,
    // background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'white',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  '.page-title-icon': {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '16px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)',
    // transform: 'rotate(-10deg)',
    width: '48px',
    height: '48px',
  }
}));

// Create a complete theme with all necessary configurations
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#7C3AED',
    },
    background: {
      default: '#1a1c1e',
      paper: '#2c3e50',
    },
  },
  typography: {
    body1: {
      fontSize: '1rem',
    },
    // Add other typography variants as needed
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          color: '#fff',
          fontSize: '0.875rem',
        },
      },
    },
  },
});

const AISuggestedQuestions = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you today?",
      isBot: true,
      timestamp: new Date(),
      quickReplies: ["Tell me about your services", "How can I get started?", "Pricing information"]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickReply = (reply) => {
    setInput(reply);
    sendMessage(reply);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Add file message to chat
      setMessages(prev => [...prev, {
        text: `Uploaded: ${file.name}`,
        isBot: false,
        timestamp: new Date(),
        file: URL.createObjectURL(file)
      }]);

      // Handle file upload to server here
      // const response = await axios.post('your-upload-endpoint', formData);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage = {
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        sender: 'user',
        message: messageText
      });

      setIsTyping(false);

      if (response.data && response.data.length > 0) {
        const botMessage = {
          text: response.data[0].text,
          isBot: true,
          timestamp: new Date(),
          quickReplies: response.data[0].buttons?.map(btn => btn.title) || []
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message to Rasa:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting right now.",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledDashboard>
        {loading ? (
          <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>

            <StyledPageHeader>
              <div className="page-title">
                <div className="page-title-icon">
                  <Icon
                    path={mdiRobot}
                    size={1.5}
                    color="#ffffff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                    }}
                  />
                </div>
                <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem' }}>
                  ChatBot
                </span>
              </div>
              <Tooltip
                title={
                  <Box sx={{
                    p: 1,
                    maxHeight: '70vh', // Set maximum height
                    overflowY: 'auto', // Enable vertical scrolling
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '10px',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.4)',
                      },
                    },
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Clinician Management
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      A comprehensive platform for managing healthcare professionals:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                      <li>View and manage all clinicians in your network</li>
                      <li>Track active and inactive clinician status</li>
                      <li>Access detailed professional profiles and credentials</li>
                      <li>Monitor performance metrics and ratings</li>
                      <li>Review career history and specializations</li>
                      <li>Manage licensing and certification information</li>
                    </ul>
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                      Use the search option to efficiently manage your clinical staff.
                    </Typography>
                  </Box>
                }
                arrow
                placement="bottom-end"
                sx={{
                  '& .MuiTooltip-tooltip': {
                    bgcolor: 'rgba(30, 41, 59, 0.95)',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxWidth: 400,
                    fontSize: '0.875rem'
                  },
                  '& .MuiTooltip-arrow': {
                    color: 'rgba(30, 41, 59, 0.95)',
                  }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  // background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  // '&:hover': {
                  //     background: 'rgba(255, 255, 255, 0.2)',
                  //     transform: 'translateY(-2px)'
                  // }
                }}>
                  <Typography sx={{
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}>
                    Overview
                  </Typography>
                  <Icon
                    path={mdiAlertCircleOutline}
                    size={0.8}
                    color="#fff"
                    style={{
                      filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                </Box>
              </Tooltip>
            </StyledPageHeader>
            <ChatContainer fluid>
              <ChatHeader>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'white' }} />
                <div>
                  <h3 style={{ margin: 0 }}>AI Assistant</h3>
                  <small>Online</small>
                </div>
              </ChatHeader>

              <ChatBody ref={chatBodyRef}>
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <MessageWrapper
                      key={index}
                      $isBot={message.isBot}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Avatar isBot={message.isBot}>
                        {message.isBot ? 'AI' : 'U'}
                      </Avatar>
                      <MessageContent>
                        <Message $isBot={message.isBot}>
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                          {message.file && <img src={message.file} alt="Uploaded" style={{ maxWidth: '200px' }} />}
                          <Timestamp $isBot={message.isBot}>
                            {format(message.timestamp, 'HH:mm')}
                          </Timestamp>
                        </Message>
                        {message.quickReplies && message.quickReplies.length > 0 && (
                          <QuickReplies>
                            {message.quickReplies.map((reply, i) => (
                              <QuickReply key={i} onClick={() => handleQuickReply(reply)}>
                                {reply}
                              </QuickReply>
                            ))}
                          </QuickReplies>
                        )}
                      </MessageContent>
                    </MessageWrapper>
                  ))}
                  {isTyping && (
                    <TypingIndicator
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </TypingIndicator>
                  )}
                </AnimatePresence>
              </ChatBody>

              <InputContainer>
                <FileUploadWrapper>
                  <FileInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <FileButton onClick={() => fileInputRef.current?.click()}>
                    📎
                  </FileButton>
                </FileUploadWrapper>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                />
                <SendButton onClick={() => sendMessage()}>Send</SendButton>
              </InputContainer>
            </ChatContainer>

          </>
        )}
      </StyledDashboard>
    </ThemeProvider>
  );
};

export default AISuggestedQuestions;
