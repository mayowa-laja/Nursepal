import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { getAllMedicineAdministration } from '../api.js';

export const MedicineAdministrationChart = ({ patient, timeRange }) => {
    const [medicationData, setMedicationData] = useState(null);

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

        const filteredData = data.filter(entry => new Date(entry.dateTimeCompleted) > cutoffTime)
        .map(entry => ({ ...entry, administered: 1 }));

        return filteredData;
    };

    return (
        <>
            <h4 className="text-center">Medication Administration Chart</h4>
            <div className="d-flex justify-content-center" style={{ height: '60vh', width: '100vw' }}>
                <ResponsiveContainer width="60%" height="70%">
                    {medicationData && (
                        <LineChart data={filterMedicationData(medicationData, timeRange)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="dateTimeCompleted" 
                                tickFormatter={(tick) => moment(tick).format('DD/MM/YYYY, h:mm:ss a')}
                            />
                            <YAxis domain={[0, 2]} />
                            <Tooltip 
                                labelFormatter={(value) => moment(value).format('DD/MM/YYYY, h:mm:ss a')}
                                formatter={(value) => ['Administered']}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="administered" name="Medicine Administration" stroke="blue" />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </>
    );
};
