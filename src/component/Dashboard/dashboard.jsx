import React, { Component } from 'react';
import axios from 'axios';
import ApexCharts from 'react-apexcharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Icon from '@mdi/react';
import { mdiHome, mdiDoctor, mdiAlertCircleOutline, mdiAccount, mdiDiamond, mdiCashMultiple, mdiDownload, mdiEye } from '@mdi/js';
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
    Backdrop,
    Typography,
    Box, Tooltip
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import './Dashboard_organization.css';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import BaseUrl from '../../api';


// Add these styled components at the top of your file, after the imports
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 10px 30px 0 rgba(0,0,0,0.1)',
    borderRadius: theme.shape.borderRadius * 3,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
}));

const StyledTable = styled(Table)({
    minWidth: 700,
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    // background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    background: theme.palette.grey[200],

}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
    // color: theme.palette.common.white,
    color: theme.palette.common.black,

    fontWeight: '500',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
    lineHeight: '1.5rem',
    letterSpacing: '0.05em',
    padding: theme.spacing(2),
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(odd)': {
//         backgroundColor: alpha(theme.palette.primary.light, 0.05),
//     },
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.primary.light, 0.1),
//         transform: 'translateY(-2px)',
//         boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
//     },
//     transition: 'all 0.3s ease',
// }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: 'white',
    '&:nth-of-type(odd)': {
    },
    '&:hover': {
        backgroundColor: 'white',
        transform: 'translateY(-2px)',
        // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    },
    transition: 'all 0.3s ease',
}));

const DownloadButton = styled(Button)(({ theme }) => ({
    borderRadius: '15px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    color: 'white',
    '&:hover': {
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        transform: 'translateY(-2px)',
    },
    transition: 'all 0.3s ease'
}));

const StyledTableCell = styled(TableCell)({
    fontSize: '0.875rem',
    lineHeight: '1.43',
    padding: '16px',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.15)',
    border: `2px solid ${theme.palette.background.paper}`,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
    fontWeight: 'bold',
    borderRadius: '20px',
    padding: '0 10px',
    height: 28,
    fontSize: '0.75rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
}));

const TableHeaderBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
}));

// Define MetricCard component
const MetricCard = ({ title, value, icon, gradient, percentage, onClick }) => (
    <Card
        className="card-trendy text-white"
        style={{
            height: '160px',
            background: gradient,
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
        }}
        onClick={onClick}
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
                    color: 'white',  // Changed to white
                    opacity: 0.8
                }}>
                    {percentage}
                </p>
            </div>
        </Card.Body>
    </Card>
);

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
                                    filename: 'Earning Analysis Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Earnings',
                                },
                                svg: {
                                    filename: 'Earning Analysis Chart',
                                },
                                png: {
                                    filename: 'Earning Analysis Chart',
                                }
                            },
                            autoSelected: 'download'
                        }
                    },
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                        },
                    },
                    xaxis: {
                        categories: [],
                    },
                    yaxis: {
                        title: {
                            text: 'Earnings ($)'
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    dataLabels: {
                        enabled: false
                    },
                    // title: {
                    //     text: 'Monthly Earnings',
                    //     align: 'center'
                    // },
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: []
                }]
            },
            patientDetails: [
                { id: 1, name: 'John Doe', issue: 'Anxiety disorders', subscriptionType: 'Portal', startDate: '2023-01-10', endDate: '2024-01-10', assignedDoctor: 'Dr. Smith', status: 'Healthy' },
                { id: 2, name: 'Jane Roe', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                { id: 3, name: 'Sam Green', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
                { id: 4, name: 'Jamie', issue: 'Depression', subscriptionType: 'Clinician', startDate: '2023-03-15', endDate: '2024-03-15', assignedDoctor: 'Dr. Brown', status: 'At Risk' },
                { id: 5, name: 'Sersi', issue: 'Paranoia', subscriptionType: 'Portal', startDate: '2023-06-20', endDate: '2024-06-20', assignedDoctor: 'Dr. Taylor', status: 'Critical' },
            ],
            // Dummy data for admins and managers
            // admins: [
            //     {
            //         organization: "Tech Innovators",
            //         name: "John Doe",
            //         email: "john.doe@techinnovators.com",
            //         avatar: "https://randomuser.me/api/portraits/men/1.jpg" // Sample avatar URL
            //     },
            //     {
            //         organization: "Creative Solutions",
            //         name: "Jane Smith",
            //         email: "jane.smith@creativesolutions.com",
            //         avatar: "https://randomuser.me/api/portraits/women/2.jpg"
            //     },
            //     {
            //         organization: "Health Corp",
            //         name: "Robert Johnson",
            //         email: "robert.johnson@healthcorp.com",
            //         avatar: "https://randomuser.me/api/portraits/men/3.jpg"
            //     },
            //     {
            //         organization: "Health Corp",
            //         name: " Johnson",
            //         email: "johnson@healthcorp.com",
            //         avatar: "https://randomuser.me/api/portraits/men/4.jpg"
            //     }
            // ],
            managers: [],
            isLoading: true,
            error: null,
            subscriptionData: {
                options: {
                    chart: {
                        type: 'area',
                        height: 350,
                        toolbar: {
                            show: true,
                            tools: {
                                // download: true,
                                download: `<i class="mdi mdi-download fs-4 "></i>`,
                                selection: true,
                                zoom: true,
                                zoomin: true,
                                zoomout: true,
                                pan: true,
                                reset: true
                            },
                            export: {
                                csv: {
                                    filename: 'Subscription Trends Data',
                                    columnDelimiter: ',',
                                    headerCategory: 'Month',
                                    headerValue: 'Subscriptions',
                                },
                                svg: {
                                    filename: 'Subscription Trends Chart',
                                },
                                png: {
                                    filename: 'Subscription Trends Chart',
                                }
                            },
                            autoSelected: 'zoom'
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 3
                    },
                    colors: ['#4CAF50'],
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                            stops: [0, 90, 100]
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: [],
                        axisBorder: {
                            show: false
                        },
                        axisTicks: {
                            show: false
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Number of Subscriptions',
                            style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                fontFamily: 'Roboto, sans-serif'
                            }
                        }
                    },
                    grid: {
                        borderColor: '#f1f1f1',
                    },
                    tooltip: {
                        theme: 'dark'
                    }
                },
                series: [{
                    name: 'Subscriptions',
                    data: []
                }]
            },
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
            previousPeriodData: {
                patientCount: 0,
                clinicianCount: 0,
                subscriptionCount: 0,
                earnings: 0
            }
        };
        // Refs for charts and table
        this.clinicianStatusChartRef = React.createRef();
        this.subscriptionTrendsChartRef = React.createRef();
        this.subscriptionComparisonChartRef = React.createRef();
        this.budgetAnalysisChartRef = React.createRef();
        this.patientStatusTableRef = React.createRef();
        this.tooltipDescriptions = {
            patients: "Track the total number of registered patients in your organization. Monitor patient growth trends and demographics.",
            clinicians: "View comprehensive details about your medical staff, including active and inactive clinicians, specializations, and performance metrics.",
            subscriptions: "Monitor all subscription plans, including active subscriptions, renewal rates, and subscription type distribution.",
            earnings: "Track financial metrics including total revenue, monthly earnings, and payment analytics across different subscription types.",
            charts: {
                subscriptionTrends: "Visualize subscription growth patterns over time. Analyze monthly subscription rates and identify seasonal trends.",
                clinicianStatus: "Get a quick overview of your medical staff distribution between active and inactive status. Monitor staffing levels and availability.",
                earningAnalysis: "Detailed breakdown of revenue streams, including monthly comparisons and growth patterns in organizational earnings."
            }
        };
    }

    componentDidMount() {
        this.fetchAllData();
        this.fetchPreviousPeriodData();
    }

    fetchAllData = async () => {
        this.setState({ isLoading: true });
        try {
            await Promise.all([
                this.fetchManagers(),
                this.fetchSubscriptions(),
                this.fetchClinicians(),
                this.fetchEarnings(),
                this.fetchCounts()
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

    fetchSubscriptions = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/organization/subscriptions`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processSubscriptionData(response.data.body);
            } else {
                throw new Error("Failed to fetch subscription data");
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            this.setState({ error: error.message, isLoading: false });
        }
    }

    processSubscriptionData = (data) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const subscriptionCounts = new Array(12).fill(0);

        data.forEach(subscription => {
            const date = new Date(subscription.createdAt);
            const month = date.getMonth();
            subscriptionCounts[month]++;
        });

        this.setState(prevState => ({
            subscriptionData: {
                ...prevState.subscriptionData,
                options: {
                    ...prevState.subscriptionData.options,
                    xaxis: {
                        categories: monthNames
                    }
                },
                series: [{
                    name: 'Subscriptions',
                    data: subscriptionCounts
                }]
            },
            isLoading: false
        }));
    }

    fetchClinicians = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const url = `${BaseUrl}/api/organization/doctors`;

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
        const activeClinicians = data.filter(clinician => clinician.Active === "yes").length;
        const inactiveClinicians = data.length - activeClinicians;

        // Check if both values are 0
        const noData = activeClinicians === 0 && inactiveClinicians === 0;

        this.setState(prevState => ({
            clinicianStatusData: {
                ...prevState.clinicianStatusData,
                options: {
                    ...prevState.clinicianStatusData.options,
                    labels: noData ? ['N/A'] : ['Active', 'Inactive'],
                    colors: noData ? ['#E0E0E0'] : ["#10b981", "#DC526C"],
                    dataLabels: {
                        enabled: true,
                        formatter: function (val, opts) {
                            return noData ? 'No Data' : opts.w.config.series[opts.seriesIndex];
                        }
                    },
                    tooltip: {
                        enabled: !noData
                    }
                },
                series: noData ? [1] : [activeClinicians, inactiveClinicians]
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

            const response = await axios.get(`${BaseUrl}/api/organization/earnings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                this.processEarningsData(response.data.body);
            } else {
                throw new Error("Failed to fetch earnings data");
            }
        } catch (error) {
            this.setState({ earningsError: error.message, isLoadingEarnings: false });
        }
    }

    processEarningsData = (data) => {
        const { monthlyEarnings, periodTotal, allTimeTotal, currentYearTotal } = data;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const months = Object.keys(monthlyEarnings).map(key => {
            const [year, month] = key.split('-');
            return `${monthNames[parseInt(month) - 1]} `;
        });
        const earnings = Object.values(monthlyEarnings);

        this.setState(prevState => ({
            budgetAnalysisData: {
                ...prevState.budgetAnalysisData,
                options: {
                    ...prevState.budgetAnalysisData.options,
                    xaxis: {
                        categories: months
                    }
                },
                series: [{
                    name: 'Monthly Earnings',
                    data: earnings
                }]
            },
            totalEarnings: {
                periodTotal,
                allTimeTotal,
                currentYearTotal
            },
            isLoadingEarnings: false
        }));
    }

    fetchCounts = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No authorization token found");
            }

            const [doctorsResponse, subscriptionsResponse, earningsResponse, patientsResponse] = await Promise.all([
                axios.get(`${BaseUrl}/api/organization/doctors/count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/organization/subscriptions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/organization/earnings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/organization/patients`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            this.setState({
                counts: {
                    totalPatients: patientsResponse.data.body.length, // Assuming the API returns an array of patients
                    totalDoctors: doctorsResponse.data.body.total,
                    totalSubscriptions: subscriptionsResponse.data.body.length, // Assuming this returns an array of subscriptions
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
        this.props.navigate('/subscription-management/clinician');
    }

    handleViewClinicians = () => {
        this.props.navigate('/clinician-management/view');
    }

    handleViewBudget = () => {
        this.props.navigate('/subscription-budget-analysis/overview');
    }

    calculatePercentageChange = (current, previous) => {
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
                axios.get(`${BaseUrl}/api/organization/patients`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/organization/doctors/count`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/organization/subscriptions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${BaseUrl}/api/organization/earnings`, {
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

            this.setState({ previousPeriodData: previousData });
        } catch (error) {
            console.error('Error fetching previous period data:', error);
        }
    };

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

    downloadManagersCSV = () => {
        const { managers } = this.state;

        // Define CSV headers
        const headers = ['Name', 'Email', 'Mobile', 'Joined Date', 'Status'];

        // Convert managers data to CSV format
        const csvData = managers.map(manager => [
            manager.name,
            manager.email,
            manager.mobile || 'N/A',
            new Date(manager.createdAt).toLocaleDateString(),
            manager.Active === 'yes' ? 'Active' : 'Inactive'
        ]);

        // Combine headers and data
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'recent_managers.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    render() {
        const { managers, isLoading, error, subscriptionData, clinicianStatusData, isLoadingClinicians, clinicianError, budgetAnalysisData, isLoadingEarnings, earningsError, totalEarnings, counts, isLoadingCounts, countsError, userRole, previousPeriodData } = this.state;

        // Sort managers by joined date (most recent first) and take the top 5
        const recentManagers = [...managers]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const cardHeaderStyle = {
            background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
            color: 'white',
        };

        // Calculate percentage changes
        const patientChange = this.calculatePercentageChange(counts.totalPatients, previousPeriodData.patientCount);
        const clinicianChange = this.calculatePercentageChange(counts.totalDoctors, previousPeriodData.clinicianCount);
        const subscriptionChange = this.calculatePercentageChange(counts.totalSubscriptions, previousPeriodData.subscriptionCount);
        const earningsChange = this.calculatePercentageChange(counts.totalEarnings, previousPeriodData.earnings);

        return (
            <div className='p-3'>
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
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                            Dashboard Overview
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1.5 }}>
                                            <strong>Key Metrics:</strong>
                                        </Typography>
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.patients}</li>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.clinicians}</li>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.subscriptions}</li>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.earnings}</li>
                                        </ul>
                                        <Typography variant="body2" sx={{ mt: 1.5, mb: 1 }}>
                                            <strong>Charts:</strong>
                                        </Typography>
                                        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.charts.subscriptionTrends}</li>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.charts.clinicianStatus}</li>
                                            <li style={{ marginBottom: '0.5rem' }}>{this.tooltipDescriptions.charts.earningAnalysis}</li>
                                        </ul>
                                    </Box>
                                }
                                arrow
                                placement="bottom-end"
                                sx={{
                                    '& .MuiTooltip-tooltip': {
                                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                                        color: '#1e293b',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        maxWidth: 400
                                    },
                                    '& .MuiTooltip-arrow': {
                                        color: 'rgba(255, 255, 255, 0.95)',
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
                                        color: '#1434A4',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.5px'
                                    }}>
                                        Overview
                                    </Typography>
                                    <Icon
                                        path={mdiAlertCircleOutline}
                                        size={0.8}
                                        color="#1434A4"
                                        style={{
                                            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                                            animation: 'pulse 2s infinite'
                                        }}
                                    />
                                </Box>
                            </Tooltip>
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
                                    value={counts.totalDoctors}
                                    icon={mdiDoctor}
                                    gradient="linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)"
                                    percentage={clinicianChange}
                                    onClick={this.handleClinicianCardClick}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <MetricCard
                                    title="Total Subscriptions"
                                    value={counts.totalSubscriptions}
                                    icon={mdiDiamond}
                                    gradient="linear-gradient(135deg, #134E5E 0%, #71B280 100%)"
                                    percentage={subscriptionChange}
                                    onClick={this.handleSubscriptionCardClick}
                                />
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3 stretch-card grid-margin">
                                <MetricCard
                                    title="Total Earnings"
                                    value={`$${counts.totalEarnings.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}`}
                                    icon={mdiCashMultiple}
                                    gradient="linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)"
                                    percentage={earningsChange}
                                    onClick={this.handleEarningsCardClick}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-lg-7 grid-margin stretch-card">
                                <Card>
                                    <Card.Header style={cardHeaderStyle} className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">Subscription Trends</h4>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            startIcon={<Icon path={mdiEye} size={0.8} />}
                                            onClick={this.handleViewSubscriptions}
                                        >
                                            View All
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center">
                                                <CircularProgress />
                                            </div>
                                        ) : error ? (
                                            <p>Error: {error}</p>
                                        ) : (
                                            <div ref={this.subscriptionTrendsChartRef}>
                                                <ApexCharts
                                                    options={subscriptionData.options}
                                                    series={subscriptionData.series}
                                                    type="area"
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
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
                                                    height={380}
                                                />
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>

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
                                        >
                                            View All
                                        </Button>
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

                        {userRole !== 'manager' && (
                            <div className="row">
                                <div className="col-12 mb-4">
                                    <StyledTableContainer component={Paper} elevation={3}>
                                        <TableHeaderBox>
                                            <Typography variant="h6" component="h2" style={{ color: 'white', fontWeight: 'bold' }}>
                                                Recent Managers
                                            </Typography>
                                            <div>
                                                <DownloadButton
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    startIcon={<Icon path={mdiDownload} size={0.8} />}
                                                    onClick={this.downloadManagersCSV}
                                                    style={{ marginRight: '8px' }}
                                                >
                                                    Download CSV
                                                </DownloadButton>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    startIcon={<Icon path={mdiEye} size={0.8} />}
                                                    onClick={this.handleViewAllClick}
                                                >
                                                    View All
                                                </Button>
                                            </div>
                                        </TableHeaderBox>
                                        {isLoading ? (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : error ? (
                                            <Box sx={{ p: 3 }}>
                                                <Typography color="error">Error: {error}</Typography>
                                            </Box>
                                        ) : (
                                            <StyledTable>
                                                <StyledTableHead>
                                                    <TableRow>
                                                        <StyledHeaderCell align="center">S.No</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Name</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Email</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Mobile</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Joined Date</StyledHeaderCell>
                                                        <StyledHeaderCell align="center">Status</StyledHeaderCell>
                                                    </TableRow>
                                                </StyledTableHead>
                                                <TableBody>
                                                    {recentManagers.map((manager, index) => (
                                                        <StyledTableRow key={manager._id}>
                                                            <StyledTableCell align="center">{index + 1}</StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                                    <StyledAvatar
                                                                        src={manager.image}
                                                                        alt={manager.name}
                                                                    >
                                                                        {manager.name.charAt(0)}
                                                                    </StyledAvatar>
                                                                    <Typography variant="body1" style={{ marginLeft: '10px' }}>
                                                                        {manager.name}
                                                                    </Typography>
                                                                </Box>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center" className='text-primary'>{manager.email}</StyledTableCell>
                                                            <StyledTableCell align="center">{manager.mobile || 'N/A'}</StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                {new Date(manager.createdAt).toLocaleDateString()}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <StyledChip
                                                                    label={manager.Active === 'yes' ? 'Active' : 'Inactive'}
                                                                    color={manager.Active === 'yes' ? 'success' : 'error'}
                                                                    variant="outlined"
                                                                />
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </StyledTable>
                                        )}
                                    </StyledTableContainer>
                                </div>
                            </div>
                        )}
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