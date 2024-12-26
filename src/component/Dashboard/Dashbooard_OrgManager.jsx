import React, { Component } from 'react';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Icon from '@mdi/react';
import { mdiHome, mdiDoctor, mdiAlertCircleOutline, mdiAccount, mdiDiamond, mdiCashMultiple, mdiDownload, mdiEye } from '@mdi/js';
// import Card_circle from '../../assets/circle.svg'
import Card_circle from '../../assets/circle.png'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Avatar,
    Chip,
    Button,
    Backdrop
} from "@mui/material";
import { styled } from '@mui/material/styles';
import './Dashboard_organization.css';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import moment from 'moment'; // Make sure to install and import moment.js
import BaseUrl from '../../api';


// First, add the MetricCard component at the top of your file (after imports)
const MetricCard = ({ title, value, icon, gradient, percentage, onClick }) => (
  <Card 
    className="card-trendy text-white" 
    style={{ 
      height: '160px',
      background: gradient,
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer' // Add cursor pointer to indicate clickable
    }}
    onClick={onClick} // Add onClick handler
  >
    <img 
      src={Card_circle} 
      className="trendy-card-img-absolute" 
      alt="circle" 
      style={{
        opacity: 0.8,
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    />
    <Card.Body className="d-flex flex-column justify-content-between p-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0" style={{ fontSize: '1.2rem', fontWeight: 500 }}>{title}</h5>
        <Icon path={icon} size={1.5} color="rgba(255,255,255,0.8)" />
      </div>
      <div>
        <h2 className="mb-1" style={{ fontSize: '1.8rem', fontWeight: 600 }}>{value}</h2>
        <p className="mb-0" style={{ 
          fontSize: '0.8rem', 
          opacity: 0.8,
          color: percentage.includes('↑') ? '#4CAF50' : 
                 percentage.includes('↓') ? '#FF5252' : 
                 'inherit'
        }}>
          {percentage}
        </p>
      </div>
    </Card.Body>
  </Card>
);

// Styled components for a fancier table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    '&.MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    '&.MuiTableCell-body': {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    },
}));

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Existing data
            // visitSaleData: {
            //     options: {
            //         chart: {
            //             type: 'line',
            //             height: 350,
            //             zoom: {
            //                 enabled: true
            //             },
            //         },
            //         stroke: {
            //             curve: 'smooth'
            //         },
            //         fill: {
            //             type: 'gradient',
            //             gradient: {
            //                 shade: 'dark',
            //                 type: "vertical",
            //                 shadeIntensity: 1,
            //                 gradientToColors: ['#4CAF50', '#FF9800', '#F44336'],
            //                 opacityFrom: 0.7,
            //                 opacityTo: 0.9,
            //             }
            //         },
            //         xaxis: {
            //             categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG']
            //         },
            //         legend: {
            //             position: 'top',
            //         },
            //         responsive: [{
            //             breakpoint: 480,
            //             options: {
            //                 chart: {
            //                     width: '100%',
            //                     height: 300
            //                 },
            //                 legend: {
            //                     position: 'bottom'
            //                 }
            //             }
            //         }]
            //     },
            //     series: [{
            //         name: 'Subscriptions',
            //         data: [20, 40, 15, 35, 25, 50, 30, 20]
            //     }]
            // },
            clinicianStatusData: {
                options: {
                    chart: {
                        type: 'donut',
                        height: 380,
                        toolbar: {
                            show: true,
                            tools: {
                                // download: true,
                                download: `<i class="mdi mdi-download fs-4"></i>`,

                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            export: {
                                csv: {
                                    filename: 'Clinician Status Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Status',
                                    headerValue: 'Value',
                                },
                                svg: {
                                    filename: 'Clinician Status Chart',
                                },
                                png: {
                                    filename: 'Clinician Status Chart',
                                }
                            },
                            autoSelected: 'download'
                        }
                    },
                    labels: ['Active', 'Inactive'],
                    colors: ["#10b981", "#DC526C"],
                    dataLabels: {
                        enabled: true,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
                series: [0, 0], // Initialize with zeros
            },
            subscriptionComparisonData: {
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'dark',
                            type: "vertical",
                            shadeIntensity: 1,
                            gradientToColors: ['#36A2EB', '#FF6384'],
                            opacityFrom: 0.7,
                            opacityTo: 0.9,
                        }
                    },
                    xaxis: {
                        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG']
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
                series: [
                    // {
                    //     name: 'Portal Subscriptions',
                    //     data: [30, 50, 25, 45, 35, 60, 40, 30],
                    // },
                    {
                        name: 'Clinician Subscriptions',
                        data: [20, 40, 15, 35, 25, 50, 30, 20],
                    }
                ],
            },
            budgetAnalysisData: {
                options: {
                    chart: {
                        type: 'bar',
                        height: 350,
                        zoom: {
                            enabled: true,
                            type: 'x',
                            autoScaleYaxis: true,
                            zoomedArea: {
                                fill: {
                                    color: '#90CAF9',
                                    opacity: 0.4
                                },
                                stroke: {
                                    color: '#0D47A1',
                                    opacity: 0.4,
                                    width: 1
                                }
                            }
                        },
                        toolbar: {
                            show: true,
                            tools: {
                                // download: true,
                                download: `<i class="mdi mdi-download fs-4"></i>`,

                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            export: {
                                csv: {
                                    filename: 'Earnings Analysis Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Earnings',
                                },
                                svg: {
                                    filename: 'Earnings Analysis Chart',
                                },
                                png: {
                                    filename: 'Earnings Analysis Chart',
                                }
                            },
                            autoSelected: 'download'
                        }
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 8,
                            columnWidth: '60%',
                            distributed: true,
                            rangeBarOverlap: true,
                            colors: {
                                ranges: [{
                                    from: 0,
                                    to: Infinity,
                                    color: '#4CAF50'  // Base color for positive values
                                }]
                            }
                        }
                    },
                    colors: ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800'],  // Multiple colors for distributed bars
                    xaxis: {
                        categories: [],
                        labels: {
                            rotate: -45,
                            rotateAlways: true,
                            style: {
                                fontSize: '12px'
                            }
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Earnings ($)',
                            style: {
                                fontSize: '14px'
                            }
                        },
                        labels: {
                            formatter: (value) => `$${value.toFixed(2)}`
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: (value) => `$${value.toFixed(2)}`,
                        style: {
                            fontSize: '12px',
                            colors: ['#fff']
                        },
                        offsetY: -20
                    },
                    grid: {
                        show: true,
                        borderColor: '#90A4AE',
                        strokeDashArray: 4,
                        opacity: 0.2
                    },
                    theme: {
                        mode: 'light',
                        palette: 'palette1'
                    }
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: []
                }]
            },
            // patientDetails: [
            //     { id: 1, name: 'John Doe', issue: 'Anxiety disorders', subscriptionType: 'Portal', startDate: '2023-01-10', endDate: '2024-01-10', assignedDoctor: 'Dr. Smith', status: 'Healthy' },
            //     { id: 2, name: 'Jane Roe', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
            //     { id: 3, name: 'Sam Green', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
            //     { id: 4, name: 'Jamie', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
            //     { id: 5, name: 'Sersi', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
            // ],

            managers: [],
            isLoading: true,
            error: null,
            isLoadingClinicians: true,
            clinicianError: null,
            isLoadingEarnings: true,
            earningsError: null,
            totalEarnings: {
                periodTotal: 0,
                allTimeTotal: 0,
                currentYearTotal: 0
            },
            counts: {
                totalPatients: 0,
                totalDoctors: 0,
                totalSubscriptions: 0,
                totalEarnings: 0
            },
            isLoadingCounts: true,
            countsError: null,
            userRole: sessionStorage.getItem('role') || '',
            subscriptionCounts: {
                activeSubscriptions: 0,
                renewalSubscriptions: 0,
                endedSubscriptions: 0,
                totalSubscriptions: 0
            },
            isLoadingSubscriptionCounts: true,
            subscriptionCountsError: null,
            clinicianCounts: {
                totalClinicians: 0,
                activeClinicians: 0,
                inactiveClinicians: 0
            },
            isLoadingClinicianCounts: true,
            clinicianCountsError: null,
            earningsData: {
                monthlyEarnings: {},
                totalEarningsThisYear: 0,
                allTimeEarnings: 0
            },
            subscriptionTrendsData: {
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                        zoom: {
                            enabled: true
                        },
                        toolbar: {
                            show: true,
                            tools: {
                                download: `<i class="mdi mdi-download fs-4"></i>`,
                            },
                        }
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'category',
                        categories: [],
                        tickAmount: 12,
                        labels: {
                            // rotate: -45,
                            rotateAlways: true,
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of Subscriptions'
                        }
                    },
                    // title: {
                    //     text: 'Subscription Trends (Last 12 Months)',
                    //     align: 'left'
                    // },
                },
                series: [{
                    name: 'Subscriptions',
                    data: []
                }]
            },
            isLoadingSubscriptionTrends: true,
            subscriptionTrendsError: null,
            previousCounts: {
                previousTotalPatients: 0,
                previousTotalClinicians: 0,
                previousTotalSubscriptions: 0,
                previousTotalEarnings: 0
            },
            previousPeriodData: {
                patientCount: 0,
                clinicianCount: 0,
                subscriptionCount: 0,
                earnings: 0
            }
        };
        // Refs for charts and table
        this.clinicianStatusChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
        this.subscriptionTrendsChartRef = React.createRef();
    }

    componentDidMount() {
        this.fetchAllData();
        this.fetchPreviousPeriodData();
    }

    fetchAllData = async () => {
        this.setState({ isLoading: true });
        try {
            await Promise.all([
                // this.fetchManagers(),
                this.fetchClinicians(),
                this.fetchEarnings(),
                this.fetchCounts(),
                this.fetchSubscriptionCounts(),
                this.fetchClinicianCounts(),
                this.fetchSubscriptionTrends(),
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    fetchManagers = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Get the token from session storage
            if (!token) {
                throw new Error("No authorization token found");
            }

            const response = await axios.get(`${BaseUrl}/api/organization/managers`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include the token in the request headers
                }
            });

            if (response.data.status === "success") {
                this.setState({ managers: response.data.body, isLoading: false });
            } else {
                throw new Error("Failed to fetch managers");
            }
        } catch (error) {
            this.setState({ error: error.message, isLoading: false });
        }
    }

    fetchClinicians = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/manager/clinicians-created`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processClinicianData(response.data.body);
            } else {
                throw new Error("Failed to fetch clinician data");
            }
        } catch (error) {
            this.setState({ clinicianError: error.message, isLoadingClinicians: false });
        }
    }

    processClinicianData = (data) => {
        console.log('Clinician Data:', data);

        // Check if data exists and is an array
        if (!data || !Array.isArray(data) || data.length === 0) {
            // Set default empty state with "No Data" message
            this.setState(prevState => ({
                clinicianStatusData: {
                    options: {
                        ...prevState.clinicianStatusData.options,
                        chart: {
                            ...prevState.clinicianStatusData.options.chart,
                            type: 'donut',
                        },
                        labels: ['No Data'],
                        colors: ["#E0E0E0"], // Gray color for empty state
                        dataLabels: {
                            enabled: true,
                        },
                        legend: {
                            position: 'bottom',
                        },
                        noData: {
                            text: 'No Clinician Data Available',
                            align: 'center',
                            verticalAlign: 'middle',
                            style: {
                                fontSize: '16px',
                                color: '#666'
                            }
                        },
                        responsive: [{
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200
                                },
                                legend: {
                                    position: 'bottom'
                                }
                            }
                        }]
                    },
                    series: [1] // Single value for empty state
                },
                isLoadingClinicians: false
            }));
            return;
        }

        // Process data if it exists
        const activeClinicians = data.filter(clinician => clinician.Active === "yes").length;
        const inactiveClinicians = data.length - activeClinicians;

        console.log('Active:', activeClinicians, 'Inactive:', inactiveClinicians);

        this.setState(prevState => ({
            clinicianStatusData: {
                options: {
                    ...prevState.clinicianStatusData.options,
                    chart: {
                        ...prevState.clinicianStatusData.options.chart,
                        type: 'donut',
                    },
                    labels: ['Active', 'Inactive'],
                    colors: ["#10b981", "#DC526C"],
                    dataLabels: {
                        enabled: true,
                    },
                    legend: {
                        position: 'bottom',
                    },
                    noData: {
                        text: 'No Clinician Data Available',
                        align: 'center',
                        verticalAlign: 'middle',
                        style: {
                            fontSize: '16px',
                            color: '#666'
                        }
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                },
                series: [activeClinicians, inactiveClinicians]
            },
            isLoadingClinicians: false
        }));
    };

    fetchEarnings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/manager/earnings`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                const { monthlyEarnings, currentYearTotal, allTimeTotal } = response.data.body;

                this.setState({
                    earningsData: {
                        monthlyEarnings,
                        totalEarningsThisYear: currentYearTotal,
                        allTimeEarnings: allTimeTotal
                    },
                    isLoadingEarnings: false
                });

                this.updateBudgetAnalysisChart(monthlyEarnings);
            } else {
                throw new Error("Failed to fetch earnings data");
            }
        } catch (error) {
            console.error('Error fetching earnings:', error);
            this.setState({
                earningsError: error.message,
                isLoadingEarnings: false
            });
        }
    };

    updateBudgetAnalysisChart = (monthlyEarnings) => {
        const monthsArray = [];
        const earningsArray = [];
        const currentDate = moment();
        const startDate = moment().subtract(11, 'months').startOf('month');

        // Generate array of last 12 months
        for (let i = 0; i < 12; i++) {
            const month = moment(startDate).add(i, 'months');
            const monthKey = month.format('YYYY-MM');
            monthsArray.push(month.format('MMM YYYY'));
            earningsArray.push(monthlyEarnings[monthKey] || 0);
        }

        this.setState(prevState => ({
            budgetAnalysisData: {
                ...prevState.budgetAnalysisData,
                options: {
                    chart: {
                        type: 'line',
                        height: 350,
                        zoom: {
                            enabled: true
                        },
                        toolbar: {
                            show: true,
                            tools: {
                                download: `<i class="mdi mdi-download fs-4"></i>`,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true,
                                customIcons: []
                            },
                            export: {
                                csv: {
                                    filename: 'Monthly_Earnings_Analysis',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Earnings',
                                },
                                svg: {
                                    filename: 'Monthly_Earnings_Chart',
                                },
                                png: {
                                    filename: 'Monthly_Earnings_Chart',
                                }
                            },
                            autoSelected: 'zoom'
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 1
                    },
                    dataLabels: {
                        enabled: true
                    },
                    markers: {
                        size: 4,
                        colors: ['#007bff'],
                        strokeColors: '#fff',
                        strokeWidth: 2,
                        hover: {
                            size: 7,
                        }
                    },
                    grid: {
                        show: true,
                        borderColor: '#90A4AE',
                        strokeDashArray: 0,
                        position: 'back',
                        xaxis: {
                            lines: {
                                show: false
                            }
                        },
                        yaxis: {
                            lines: {
                                show: true
                            }
                        },
                        padding: {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        },
                    },
                    xaxis: {
                        type: 'category',
                        categories: monthsArray,
                        tickAmount: 12,
                        labels: {
                            rotateAlways: true,
                            style: {
                                fontSize: '12px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                            }
                        },
                        axisBorder: {
                            show: true,
                            color: '#78909C',
                            height: 1,
                            width: '100%',
                            offsetX: 0,
                            offsetY: 0
                        },
                        axisTicks: {
                            show: true,
                            borderType: 'solid',
                            color: '#78909C',
                            height: 6,
                            offsetX: 0,
                            offsetY: 0
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Earnings ($)',
                            style: {
                                fontSize: '14px',
                                fontWeight: 500,
                                fontFamily: 'Helvetica, Arial, sans-serif',
                            }
                        },
                        labels: {
                            formatter: (value) => `$${value.toFixed(2)}`,
                            style: {
                                fontSize: '12px',
                                fontFamily: 'Helvetica, Arial, sans-serif',
                            }
                        }
                    }
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: earningsArray
                }]
            }
        }));
    };

    getMonthName = (monthNumber) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[monthNumber - 1];
    };

    fetchCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const [doctorsResponse, subscriptionsResponse, earningsResponse, patientsResponse] = await Promise.all([
                axios.get(`${BaseUrl}/api/manager/clinicians-counts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/manager/subscriptions-counts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/manager/earnings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/manager/subscribed-patients`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            this.setState({
                counts: {
                    totalPatients: patientsResponse.data.body.length,
                    totalDoctors: doctorsResponse.data.body.total,
                    totalSubscriptions: subscriptionsResponse.data.body.length,
                    totalEarnings: earningsResponse.data.body.allTimeTotal
                },
                isLoadingCounts: false
            });
        } catch (error) {
            console.error('Error fetching counts:', error);
            this.setState({
                countsError: "Failed to fetch some data. Please try again later.",
                isLoadingCounts: false
            });
        }
    }

    fetchSubscriptionCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/manager/subscriptions-counts`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                const { validSubscriptions, renewalSubscriptions, endedSubscriptions } = response.data.body;
                const totalSubscriptions = validSubscriptions + endedSubscriptions;

                this.setState({
                    subscriptionCounts: {
                        activeSubscriptions: validSubscriptions,
                        renewalSubscriptions,
                        endedSubscriptions,
                        totalSubscriptions
                    },
                    isLoadingSubscriptionCounts: false
                });
            } else {
                throw new Error("Failed to fetch subscription counts");
            }
        } catch (error) {
            console.error('Error fetching subscription counts:', error);
            this.setState({
                subscriptionCountsError: error.message,
                isLoadingSubscriptionCounts: false
            });
        }
    };

    fetchClinicianCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/manager/clinicians-counts`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                const { totalClinisists, activeClinisists, inactiveClinisists } = response.data.body;
                this.setState({
                    clinicianCounts: {
                        totalClinicians: totalClinisists,
                        activeClinicians: activeClinisists,
                        inactiveClinicians: inactiveClinisists
                    },
                    isLoadingClinicianCounts: false
                });
            } else {
                throw new Error("Failed to fetch clinician counts");
            }
        } catch (error) {
            console.error('Error fetching clinician counts:', error);
            this.setState({
                clinicianCountsError: error.message,
                isLoadingClinicianCounts: false
            });
        }
    };

    fetchSubscriptionTrends = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/manager/subscriptions`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processSubscriptionTrendsData(response.data.body);
            } else {
                throw new Error("Failed to fetch subscription trends data");
            }
        } catch (error) {
            console.error('Error fetching subscription trends:', error);
            this.setState({
                subscriptionTrendsError: error.message,
                isLoadingSubscriptionTrends: false
            });
        }
    };

    processSubscriptionTrendsData = (data) => {
        const endDate = moment();
        const startDate = moment().subtract(11, 'months').startOf('month');
        const monthsArray = [];
        const subscriptionCounts = new Array(12).fill(0);

        // Generate array of last 12 months
        for (let i = 0; i < 12; i++) {
            monthsArray.push(moment(startDate).add(i, 'months').format('MMM YYYY'));
        }

        data.forEach(subscription => {
            const createdDate = moment(subscription.createdAt);
            if (createdDate.isBetween(startDate, endDate, null, '[]')) {
                const monthIndex = createdDate.diff(startDate, 'months');
                subscriptionCounts[monthIndex]++;
            }
        });

        this.setState(prevState => ({
            subscriptionTrendsData: {
                ...prevState.subscriptionTrendsData,
                options: {
                    ...prevState.subscriptionTrendsData.options,
                    xaxis: {
                        ...prevState.subscriptionTrendsData.options.xaxis,
                        categories: monthsArray
                    }
                },
                series: [{
                    name: 'Subscriptions',
                    data: subscriptionCounts
                }]
            },
            isLoadingSubscriptionTrends: false
        }));
    };

    // statusMappings = {
    //   'Healthy': { percentage: 100, color: '#4CAF50' }, // Green
    //   'At Risk': { percentage: 50, color: '#FF9800' }, // Orange
    //   'Critical': { percentage: 25, color: '#F44336' } // Red
    // };

    handleViewAllClick = () => {
        this.props.navigate('/managers-management/view');
    }

    downloadChart = (chartRef, fileName) => {
        const chartElement = chartRef.current.querySelector('.apexcharts-canvas');
        html2canvas(chartElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10);
            pdf.save(`${fileName}.pdf`);
        });
    };

    handleViewSubscriptions = () => {
        this.props.navigate('/subscription-management/organization_portal');
    }

    handleViewClinicians = () => {
        this.props.navigate('/clinician-management/view');
    }

    handleViewBudget = () => {
        this.props.navigate('/subscription-budget-analysis/overview');
    }

    handleViewPatients = () => {
        this.props.navigate('');
    }

    fetchPreviousPeriodData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            
            // Get the first day of previous month
            const today = new Date();
            const firstDayPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);

            // Format dates for API
            const startDate = firstDayPrevMonth.toISOString().split('T')[0];
            const endDate = lastDayPrevMonth.toISOString().split('T')[0];

            // Fetch previous period data
            const [patientsResponse, cliniciansResponse, subscriptionsResponse, earningsResponse] = await Promise.all([
                axios.get(`${BaseUrl}/api/manager/subscribed-patients`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/manager/clinicians-counts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/manager/subscriptions-counts`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/manager/earnings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            // Get previous month's data
            const previousData = {
                patientCount: patientsResponse.data.body.length || 0,
                clinicianCount: cliniciansResponse.data.body.total || 0,
                subscriptionCount: subscriptionsResponse.data.body.length || 0,
                earnings: earningsResponse.data.body.periodTotal || 0
            };

            console.log('Previous Period Data:', previousData);
            
            this.setState({ previousPeriodData: previousData });
        } catch (error) {
            console.error('Error fetching previous period data:', error);
        }
    };

    calculatePercentageChange = (current, previous) => {
        console.log('Calculating percentage:', { current, previous }); // Debug log
        
        if (previous === 0) {
            if (current === 0) {
                return '0% of total';
            }
            return `↑ 100% of total`;
        }
        
        const change = ((current - previous) / Math.abs(previous)) * 100;
        const formattedValue = Math.abs(change).toFixed(1);
        
        if (change === 0) {
            return '0% of total';
        } else if (change > 0) {
            return `↑ ${formattedValue}% of total`;
        } else {
            return `↓ ${formattedValue}% of total`;
        }
    };

    // Add navigation handlers for metric cards
    handlePatientCardClick = () => {
        this.props.navigate('/subscription-budget-analysis/overview');
    }

    handleClinicianCardClick = () => {
        this.props.navigate('/clinician-management/view');
    }

    handleSubscriptionCardClick = () => {
        this.props.navigate('/subscription-management/organization_portal');
    }

    handleEarningsCardClick = () => {
        this.props.navigate('/subscription-budget-analysis/overview');
    }

    render() {
        const { isLoading, error, clinicianStatusData, isLoadingClinicians, clinicianError, budgetAnalysisData, isLoadingEarnings, earningsError, counts, isLoadingCounts, countsError, subscriptionCounts, isLoadingSubscriptionCounts, subscriptionCountsError, clinicianCounts, isLoadingClinicianCounts, clinicianCountsError, earningsData, subscriptionTrendsData, isLoadingSubscriptionTrends, subscriptionTrendsError, previousCounts, previousPeriodData } = this.state;
        const cardHeaderStyle = {
            background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
            color: 'white',
        };

        // Calculate percentage changes
        const patientChange = this.calculatePercentageChange(counts.totalPatients, previousPeriodData.patientCount);
        const clinicianChange = this.calculatePercentageChange(clinicianCounts.totalClinicians, previousPeriodData.clinicianCount);
        const subscriptionChange = this.calculatePercentageChange(subscriptionCounts.totalSubscriptions, previousPeriodData.subscriptionCount);
        const earningsChange = this.calculatePercentageChange(earningsData.allTimeEarnings, previousPeriodData.earnings);

        return (
            <div className='p-3 '>
                {isLoading ? (
                    <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                ) : (
                    <>
                        <div className="page-header d-flex flex-wrap justify-content-between align-items-center">
                            <h3 className="page-title d-flex align-items-center">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home fs-3"></i>
                                </span> Dashboard
                            </h3>
                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb mb-0">
                                    {/* <li className="breadcrumb-item active" aria-current="page">
                                        <span></span>Overview <Icon path={mdiAlertCircleOutline} size={0.6} className="float-right icon-hover" />
                                    </li> */}
                                </ul>
                            </nav>
                        </div>

                        <div className="row">
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <MetricCard
                                    title="Total Patients"
                                    value={counts.totalPatients}
                                    icon={mdiAccount}
                                    gradient="linear-gradient(135deg, #3A1C71 0%, #D76D77 50%, #FFAF7B 100%)"
                                    percentage={patientChange}
                                    onClick={this.handlePatientCardClick}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <MetricCard
                                    title="Total Clinicians"
                                    value={clinicianCounts.totalClinicians}
                                    icon={mdiDoctor}
                                    gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                                    percentage={clinicianChange}
                                    onClick={this.handleClinicianCardClick}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <MetricCard
                                    title="Total Subscriptions"
                                    value={subscriptionCounts.totalSubscriptions}
                                    icon={mdiDiamond}
                                    gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                                    percentage={subscriptionChange}
                                    onClick={this.handleSubscriptionCardClick}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <MetricCard
                                    title="Total Earnings"
                                    value={`$${earningsData.allTimeEarnings ? 
                                        earningsData.allTimeEarnings.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }) : 
                                        '0.00'}`}
                                    icon={mdiCashMultiple}
                                    gradient="linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)"
                                    percentage={earningsChange}
                                    onClick={this.handleEarningsCardClick}
                                />
                            </div>
                        </div>

                        <div className="row">
                            {/* Subscription Trends */}
                            <div className="col-12 col-lg-7 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Subscription Trends (Last 12 Months)</h4>
                                        <Button
                                            // className='d-flex justify-content-center m-0 px-0'
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            // startIcon={<Icon path={mdiEye} size={1.0} />}
                                            onClick={this.handleViewSubscriptions}
                                        >View All</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingSubscriptionTrends ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : subscriptionTrendsError ? (
                                            <p>Error: {subscriptionTrendsError}</p>
                                        ) : (
                                            <div ref={this.subscriptionTrendsChartRef}>
                                                <ApexCharts
                                                    options={subscriptionTrendsData.options}
                                                    series={subscriptionTrendsData.series}
                                                    type="line"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* Clinician Status */}
                            <div className="col-12 col-lg-5 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Clinician Status Overview</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={this.handleViewClinicians}
                                        >
                                            View All
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingClinicians ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : clinicianError ? (
                                            <p>Error: {clinicianError}</p>
                                        ) : (
                                            <div ref={this.clinicianStatusChartRef}>
                                                <ApexCharts
                                                    options={clinicianStatusData.options}
                                                    series={clinicianStatusData.series}
                                                    type="donut"
                                                    width="100%"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>

                        {/* Earning Analysis */}
                        <div className="row">
                            <div className="col-12 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Earning Analysis</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={this.handleViewBudget}
                                            className=''
                                        >View All</Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoadingEarnings ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : earningsError ? (
                                            <p>Error: {earningsError}</p>
                                        ) : (
                                            <div ref={this.budgetAnalysisChartRef}>
                                                <ApexCharts
                                                    options={budgetAnalysisData.options}
                                                    series={budgetAnalysisData.series}
                                                    type="bar"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
}

// Wrapper component
function DashboardWithRouter(props) {
    let navigate = useNavigate();
    return <Dashboard {...props} navigate={navigate} />;
}

export default DashboardWithRouter;