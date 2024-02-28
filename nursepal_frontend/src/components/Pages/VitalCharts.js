import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getVitals } from '../api.js';
import 'chartjs-adapter-date-fns';

export const VitalsCharts = ({ patient }) => {
    const [vitalsData, setVitalsData] = useState(null);
    const [timeRange, setTimeRange] = useState('pastDay');
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchVitalsData = async () => {
            try {
                const data = await getVitals(patient.patientID);
                setVitalsData(data);
            } catch (error) {
                console.error('Error fetching vitals data:', error);
            }
        };

        fetchVitalsData();
    }, [patient]);

    useEffect(() => {
        if (vitalsData) {
            renderChart();
        }
    }, [vitalsData, timeRange]);

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = document.getElementById('vitalsChart');

        const filteredData = filterVitalsData(vitalsData, timeRange)
        filteredData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredData.map(entry => entry.dateTime),
                datasets: [
                    {
                        label: 'Temperature',
                        data: filteredData.map(entry => entry.temperature),
                        borderColor: 'red',
                        fill: false,
                    },
                    {
                        label: 'Heart Rate',
                        data: filteredData.map(entry => entry.heartRate),
                        borderColor: 'blue',
                        fill: false,
                    },
                    {
                        label: 'Respiratory Rate',
                        data: filteredData.map(entry => entry.respiratoryRate),
                        borderColor: 'yellow',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: getTimeUnit(timeRange), // Adjust the time scale as needed
                        },
                    },
                },
            },
        });
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    const filterVitalsData = (data, timeRange) => {
        const now = new Date();
        let cutoffTime = new Date();

        switch (timeRange) {
            case 'past3Hours':
                cutoffTime.setHours(now.getHours() - 3);
                break;
            case 'past6Hours':
                cutoffTime.setHours(now.getHours() - 6);
                break;
            case 'pastDay':
                cutoffTime.setDate(now.getDate() - 1);
                break;
            case 'pastMonth':
                cutoffTime.setDate(now.getDate() - 30);
                break;
            default:
                // By default, show all data
                return data;
        }

        return data.filter(entry => new Date(entry.dateTime) > cutoffTime);
    };

    const getTimeUnit = (timeRange) => {
        switch (timeRange) {
            case 'past3Hours':
            case 'past6Hours':
                return 'minute';
            case 'pastDay':
                return 'hour';
            case 'pastMonth':
                return 'day';
            default:
                return 'hour'; // Default to hour if no match
        }
    };

    return (
        <div className="container">
            <h2>Vitals Chart</h2>
            <div className="mb-3">
                <label htmlFor="timeRangeSelect" className="me-3">Select Time Range:</label>
                <select id="timeRangeSelect" value={timeRange} onChange={handleTimeRangeChange}>
                    <option value="past3Hours">Past 3 Hours</option>
                    <option value="past6Hours">Past 6 Hours</option>
                    <option value="pastDay">Past Day</option>
                    <option value="pastMonth">Past Month</option>
                </select>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="chart-container">
                        <canvas id="vitalsChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};
