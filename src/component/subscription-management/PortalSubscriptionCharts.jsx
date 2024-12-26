import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { styled } from '@mui/material/styles';
import { format, startOfYear, endOfYear } from 'date-fns';
import BaseUrl from '../../api';


const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '20px',
    background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
    border: 'none',
    color: theme.palette.common.white,
    padding: '4px 10px',
    transition: 'all 0.3s ease-in-out',
    width: '140px',
    fontSize: '0.7rem',
    fontWeight: '600',
    '&:hover': {
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transform: 'translateY(-1px)',
    },
    '&::before, &::after': {
      display: 'none',
    },
  },
  '& .MuiInputBase-input': {
    padding: '5px 12px',
    width: 'calc(100% - 60px)',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.7)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
  },
}));

const PortalSubscriptionCharts = () => {
  const [subscriptionData, setSubscriptionData] = useState({});
  const [startDate, setStartDate] = useState(startOfYear(new Date()));
  const [endDate, setEndDate] = useState(endOfYear(new Date()));
  const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

  useEffect(() => {
    if (isAdminPortal) {
      fetchSubscriptionData();
    }
  }, [startDate, endDate, isAdminPortal]);

  const fetchSubscriptionData = async () => {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('role');
    const baseUrl = `${BaseUrl}/api`;

    try {
      const endpoint = userRole === 'assistant'
        ? '/assistant/detailed-subscription-counts-month-wise'
        : '/admin/detailed-subscription-counts-month-wise';

      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });

      if (response.data.status === 'success') {
        setSubscriptionData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          // download: true,
          download: `<i class="mdi mdi-download fs-3"></i>`,

          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: Object.keys(subscriptionData).map(date => format(new Date(date), 'MMM yyyy')),
    },
    yaxis: {
      title: {
        text: 'Number of Patient Subscriptions',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    colors: ['#00acdf', '#ff6b6b', '#51cf66']
  };

  const chartSeries = [
    {
      name: 'Active',
      data: Object.values(subscriptionData).map(data => data.patientSubscription.active),
    },
    {
      name: 'Renewal',
      data: Object.values(subscriptionData).map(data => data.patientSubscription.renewal),
    },
    {
      name: 'Ended',
      data: Object.values(subscriptionData).map(data => data.patientSubscription.ended),
    },
  ];

  const cardHeaderStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    color: 'white',
    borderRadius: '20px 20px 0 0',
    border: 'none',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '1.2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
    },
    '& h4': {
        margin: 0,
        fontSize: '1.2rem',
        fontWeight: 700,
    }
};

  return (
    <Card className="mb-4">
      <Card.Header style={cardHeaderStyle} className="bg-primary text-white d-flex justify-content-between align-items-center">
        <Typography variant="h6" component="h4" style={{ color: 'white', fontWeight: 'bold' }}>
          Patient Subscription Overview
        </Typography>
        {isAdminPortal && (
          <div className="d-flex gap-2">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StyledDatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => <Form.Control {...params} />}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: {
                      width: '140px',
                      '& .MuiInputLabel-root': {
                        color: '#fff',
                        fontWeight: 600,
                      }
                    }
                  },
                  inputAdornment: {
                    style: { marginRight: '-8px' }
                  }
                }}
              />
              <StyledDatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <Form.Control {...params} />}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: {
                      width: '140px',
                      '& .MuiInputLabel-root': {
                        color: '#fff',
                        fontWeight: 600,
                      }
                    }
                  },
                  inputAdornment: {
                    style: { marginRight: '-8px' }
                  }
                }}
              />
            </LocalizationProvider>
          </div>
        )}
      </Card.Header>
      <Card.Body>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
};

export default PortalSubscriptionCharts;
