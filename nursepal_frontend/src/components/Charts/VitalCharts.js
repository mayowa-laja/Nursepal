import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import moment from 'moment';
import { getVitals } from '../api.js';

export const VitalsCharts = ({ patient, timeRange }) => {
    const [vitalsData, setVitalsData] = useState(null);
    const [showTemperature, setShowTemperature] = useState(true);
    const [showHeartRate, setShowHeartRate] = useState(true);
    const [showRespiratoryRate, setShowRespiratoryRate] = useState(true);
    const [showTemperatureThreshold, setShowTemperatureThreshold] = useState(false);
    const [showHeartRateThreshold, setShowHeartRateThreshold] = useState(false);
    const [showRespiratoryRateThreshold, setShowRespiratoryRateThreshold] = useState(false);

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

    const toggleTemperature = () => {
        setShowTemperature(!showTemperature);
    };

    const toggleHeartRate = () => {
        setShowHeartRate(!showHeartRate);
    };

    const toggleRespiratoryRate = () => {
        setShowRespiratoryRate(!showRespiratoryRate);
    };

    const toggleTemperatureThreshold = () => {
        setShowTemperatureThreshold(!showTemperatureThreshold);
    };

    const toggleHeartRateThreshold = () => {
        setShowHeartRateThreshold(!showHeartRateThreshold);
    };

    const toggleRespiratoryRateThreshold = () => {
        setShowRespiratoryRateThreshold(!showRespiratoryRateThreshold);
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

    const temperatureThreshold = 37.5; // High temperature threshold
    const temperatureLowThreshold = 36.0; // Low temperature threshold
    const heartRateHighThreshold = 100; // High heart rate threshold
    const respiratoryRateHighThreshold = 25;

    return (
        <>
            <h4 className="text-center">Vitals Chart</h4>
            <div className="col d-flex flex-column align-items-center" style={{ height: '60vh', width: '100vw' }}>
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
                            {showTemperature && <Line type="monotone" dataKey="temperature" stroke="red" />}
                            {showHeartRate && <Line type="monotone" dataKey="heartRate" stroke="blue" />}
                            {showRespiratoryRate && <Line type="monotone" dataKey="respiratoryRate" stroke="green" />}

                            {showTemperatureThreshold && <ReferenceLine y={37} stroke="black" />}
                            {showHeartRateThreshold && <ReferenceLine y={100} stroke="black"/>}
                            {showRespiratoryRateThreshold && <ReferenceLine y={20} stroke="black"/>}
                        </LineChart>
                    )}
                </ResponsiveContainer>
                <div className="d-flex justify-content-center mt-3">
                    <label style={{ marginRight: '10px' }}>
                        Temperature
                        <input
                            type="checkbox"
                            checked={showTemperature}
                            onChange={toggleTemperature}
                        />
                    </label>
                    <label style={{ marginRight: '10px' }}>
                        Heart Rate
                        <input
                            type="checkbox"
                            checked={showHeartRate}
                            onChange={toggleHeartRate}
                        />
                    </label>
                    <label style={{ marginRight: '10px' }}>
                        Respiratory Rate
                        <input
                            type="checkbox"
                            checked={showRespiratoryRate}
                            onChange={toggleRespiratoryRate}
                        />
                    </label>
                    <label style={{ marginRight: '10px' }}>
                        Temperature Threshold
                        <input
                            type="checkbox"
                            checked={showTemperatureThreshold}
                            onChange={toggleTemperatureThreshold}
                        />
                    </label>
                    <label style={{ marginRight: '10px' }}>
                        Heart Rate Threshold
                        <input
                            type="checkbox"
                            checked={showHeartRateThreshold}
                            onChange={toggleHeartRateThreshold}
                        />
                    </label>
                    <label>
                        Respiratory Rate Threshold
                        <input
                            type="checkbox"
                            checked={showRespiratoryRateThreshold}
                            onChange={toggleRespiratoryRateThreshold}
                        />
                    </label>
                </div>
            </div>
        </>
    );
};
