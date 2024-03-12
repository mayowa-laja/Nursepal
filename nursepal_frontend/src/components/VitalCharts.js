import React, { useEffect, useState, useRef } from 'react';
import {Chart} from 'chart.js';
import { getVitals } from './api.js';
import 'chartjs-adapter-date-fns';

export const VitalsCharts = ({ patient, timeRange }) => {
    const [vitalsData, setVitalsData] = useState(null);
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
                            unit: getTimeUnit(timeRange),
                        },
                    },
                },
            },
        });
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
                return 'hour';
        }
    };

    return (
        <div className="container">
            <h4>Vitals Chart</h4>
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
