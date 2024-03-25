import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { getVitals } from '../api.js';

export const BloodPressureChart = ({ patient, timeRange }) => {
    const [vitalsData, setVitalsData] = useState(null);

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

    return (
        <>
            <h4 className="text-center">Blood Pressure Chart</h4>
            <div className="d-flex justify-content-center" style={{ height: '60vh', width: '100vw' }}>
                <ResponsiveContainer width="60%" height="70%">
                    {vitalsData && (
                        <LineChart data={filterVitalsData(vitalsData, timeRange)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="dateTime" 
                                tickFormatter={(tick) => moment(tick).format('DD/MM/YYYY, h:mm:ss a')}
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis />
                            <Tooltip 
                                labelFormatter={(value) => moment(value).format('Do MMMM YYYY, h:mm:ss a')}
                                tick={{ fontSize: 10 }} 
                            />
                            <Legend />
                            <Line type="monotone" dataKey="systolicBloodPressure" stroke="red" />
                            <Line type="monotone" dataKey="diastolicBloodPressure" stroke="blue" />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </>
    );
};
