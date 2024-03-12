import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getAllMedicineAdministration } from './api.js';
import 'chartjs-adapter-date-fns';

export const MedicineAdministrationChart = ({ patient, timeRange }) => {
    const [medicationData, setMedicationData] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchMedicationData = async () => {
            try {
                const data = await getAllMedicineAdministration(patient.patientID);
                setMedicationData(data);
            } catch (error) {
                console.error('Error fetching medication administration data:', error);
            }
        };

        fetchMedicationData();
    }, [patient]);

    useEffect(() => {
        if (medicationData) {
            renderChart();
        }
    }, [medicationData, timeRange]);

    const renderChart = () => {
        if (chartRef.current) {
            chartRef.current.destroy();
        }
    
        const ctx = document.getElementById('medicationAdminChart');
    
        const filteredData = filterMedicationData(medicationData, timeRange);
        filteredData.sort((a, b) => new Date(a.dateTimeCompleted) - new Date(b.dateTimeCompleted));
    
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredData.map(entry => entry.dateTimeCompleted),
                datasets: [{
                    label: 'Medicine Administration',
                    data: filteredData.map(entry => ({
                        x: new Date(entry.dateTimeCompleted),
                        y: 1, // Set y-value to 1 for each administration to show presence
                        medicineName: entry.task, // Add medicine name to each data point
                    })),
                    borderColor: 'green', // Adjust color as needed
                    fill: false,
                }]
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
                    y: {
                        title: {
                            display: true,
                            text: 'Medicine Administration',
                        },
                        ticks: {
                            display: false, // Hide y-axis ticks
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataPoint = context.dataset.data[context.dataIndex];
                                return `${dataPoint.medicineName}: Administered`;
                            }
                        }
                    }
                }
            },
        });
    };

    const filterMedicationData = (data, timeRange) => {
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

        return data.filter(entry => new Date(entry.dateTimeCompleted) > cutoffTime);
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
            <h4>Medication Administration Chart</h4>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="chart-container">
                        <canvas id="medicationAdminChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};
