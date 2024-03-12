import React from 'react';
import { useEffect, useState } from "react"
import { useLocation} from 'react-router-dom';
import { VitalsCharts } from '../VitalCharts';
import { BloodPressureChart} from '../BloodPressureChart';
import { MedicineAdministrationChart } from '../MedicineAdministrationChart';
import { getSymptoms, getObservations, getCare, getMedications } from '../api';
import { Symptoms } from '../Symptoms';
import { Observations } from '../Observations';
import { Care } from '../Care';
import { Medications } from '../Medications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const PatientHealthPage = () => {
    const [symptoms, setSymptoms] = useState([]);
    const [observations, setObservations] = useState([]);
    const [care, setCare] = useState([]);
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('pastDay');
    const patient = useLocation().state;

    useEffect(() => {

        if (localStorage.getItem('loggedIn') === null){
            window.location.href = '/login';
        }

        setLoading(true);

        Promise.all([
            getSymptoms(patient.patientID),
            getObservations(patient.patientID),
            getCare(patient.patientID),
            getMedications(patient.patientID)
        ])
        .then(([symptomsData, observationsData, careData, medicationsData]) => {
            setSymptoms(symptomsData);
            setObservations(observationsData);
            setCare(careData);
            setMedications(medicationsData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    }, [patient]);

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    return (
        <div className="container-fluid">
            <div className="row">
              <div className="col">
                <h1 id="title">Patient Health</h1>
              </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4">
                            <Symptoms symptoms={symptoms}/>
                        </div>
                        <div className="col-md-4">
                            <Observations observations={observations}/>
                        </div>
                        <div className="col-md-4">
                            <Care care={care}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Medications medications={medications}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h3 className="mt-4">Charts</h3>
                                <label htmlFor="timeRangeSelect" className="me-3">Select Time Range:</label>
                                <select id="timeRangeSelect" value={timeRange} onChange={handleTimeRangeChange}>
                                    <option value="past3Hours">Past 3 Hours</option>
                                    <option value="past6Hours">Past 6 Hours</option>
                                    <option value="pastDay">Past Day</option>
                                    <option value="pastMonth">Past Month</option>
                                </select>
                            </div>
                            <VitalsCharts patient={patient} timeRange={timeRange} />
                            <BloodPressureChart patient={patient} timeRange={timeRange} />
                            <MedicineAdministrationChart patient={patient} timeRange={timeRange}/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};