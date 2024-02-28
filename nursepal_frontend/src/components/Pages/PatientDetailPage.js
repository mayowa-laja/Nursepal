import React from 'react';
import { useLocation } from 'react-router-dom';
import image from '../../Images/johnDoe.png';
import '../../css/patientDetailPage.css';
import { VitalsInput } from '../VitalsInput';
import { PatientInput } from '../PatientInput';
import { VitalsCharts } from './VitalCharts';

export const PatientDetailPage = () => {
    const patient = useLocation().state;
    console.log(patient);

    return (
        <div className="container-fluid">
            <div className="row">
              <div className="col">
                <h1 id="title">{patient.name}</h1>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 m-3">
                <img src={image} alt="Picture of patient"/>
              </div>
            </div>

            <div className="row m-3">
              <div className="col-6 col-md-3 mb-5">
                Name: {patient.name}
              </div>
              <div className="col-6 col-md-3 mb-5">
                Age: {patient.age}
              </div>
              <div className="col-6 col-md-3 mb-5">
                Date Of Birth: {patient.dateOfBirth}
              </div>
              <div className="col-6 col-md-3 mb-5">
                Address: {patient.address}
              </div>
              <div className="col-6 col-md-3 mb-5">
                Sex: {patient.sex}
              </div>
              <div className="col-6 col-md-3 mb-5">
                Blood Type: {patient.bloodType}
              </div>
            </div>
            
            <div className="row">
              <VitalsInput patient={patient} />
            </div>

            <div className="row">
              <PatientInput patient={patient} />
            </div>
            
            <div className="row">
              <VitalsCharts patient={patient} />
            </div>
        </div>
    );
};