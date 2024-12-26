import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { Typography } from '@mui/material';
import BaseUrl from '../../api';


const ClinicianSubscriptionCharts = () => {
  const [subscriptionData, setSubscriptionData] = useState({});
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const isAdminPortal = sessionStorage.getItem('adminPortal') === 'true';

  useEffect(() => {
    fetchSubscriptionData();
  }, [selectedYear]);

  const fetchSubscriptionData = async () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    try {
      const endpoint = role === 'manager'
        ? `${BaseUrl}/api/manager/subscriptions`
        : `${BaseUrl}/api/organization/subscriptions`;

      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        const subscriptions = response.data.body;
        processSubscriptionData(subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const processSubscriptionData = (subscriptions) => {
    const yearlyData = {};
    const yearsSet = new Set();

    subscriptions.forEach(sub => {
      const createdAt = new Date(sub.createdAt);
      const year = createdAt.getFullYear();
      const month = createdAt.getMonth();

      yearsSet.add(year);

      if (!yearlyData[year]) {
        yearlyData[year] = Array(12).fill(0);
      }

      yearlyData[year][month]++;
    });

    setYears(Array.from(yearsSet).sort((a, b) => b - a));
    setSubscriptionData(yearlyData);
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          // download: true,
          download: `<i class="mdi mdi-download fs-4"></i>`,

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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Number of Subscriptions',
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    colors: ['#00acdf']
  };

  const chartSeries = [
    {
      name: 'Number of Subscriptions',
      data: subscriptionData[selectedYear] || Array(12).fill(0),
    },
  ];

  const cardHeaderStyle = {
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    color: 'white',
  };

  return (
    <Card className="mb-4">
      <Card.Header style={cardHeaderStyle} className="bg-primary text-white d-flex justify-content-between align-items-center">
        <Typography variant="h6" component="h4" style={{ color: 'white', fontWeight: 'bold' }}>
          {isAdminPortal ? 'Clinician Subscriptions' : 'Subscriptions'}
        </Typography>
        <Form.Select
          style={{ width: 'auto', color: 'black'  }}
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          <option value="" disabled>Select Year</option> {/* Default display option */}
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Card.Header>
      <Card.Body>
        <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
      </Card.Body>
    </Card>
  );
};

export default ClinicianSubscriptionCharts;






































// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { Card } from 'react-bootstrap';
// import axios from 'axios';

// const ClinicianSubscriptionCharts = () => {
//   const [subscriptionCounts, setSubscriptionCounts] = useState({
//     validSubscriptions: 0,
//     renewalSubscriptions: 0,
//     endedSubscriptions: 0
//   });

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');

//     axios.get(`${BaseUrl}/api/organization/subscription-counts`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//       .then(response => {
//         if (response.data.status === 'success') {
//           setSubscriptionCounts(response.data.body);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching subscription counts:', error);
//       });
//   }, []);

//   const chartOptions = {
//     chart: {
//       type: 'bar',
//       stacked: false,
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '55%',
//         endingShape: 'rounded'
//       },
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ['transparent']
//     },
//     xaxis: {
//       categories: ['Subscriptions'],
//     },
//     yaxis: {
//       title: {
//         text: 'Count'
//       }
//     },
//     fill: {
//       opacity: 1
//     },
//     tooltip: {
//       y: {
//         formatter: function (val) {
//           return val + " subscriptions"
//         }
//       }
//     },
//     legend: {
//       position: 'top',
//       horizontalAlign: 'center',
//     },
//     colors: ['#4CAF50', '#FFA500', '#F44336']
//   };

//   const chartSeries = [
//     {
//       name: 'Active Subscriptions',
//       data: [subscriptionCounts.validSubscriptions]
//     },
//     {
//       name: 'Renewals',
//       data: [subscriptionCounts.renewalSubscriptions]
//     },
//     {
//       name: 'Ended Subscriptions',
//       data: [subscriptionCounts.endedSubscriptions]
//     }
//   ];

//   return (
//     <Card className="mb-4">
//       <Card.Header className="bg-primary text-white">Clinician Subscription Overview</Card.Header>
//       <Card.Body>
//         <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
//       </Card.Body>
//     </Card>
//   );
// };

// export default ClinicianSubscriptionCharts;

