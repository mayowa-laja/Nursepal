import React, { useEffect } from 'react';
import moment from 'moment';
import { useLocation, Link } from 'react-router-dom';
import image from '../../Images/johnDoe.png';
import '../../css/patientDetailPage.css';
import { VitalsInput } from '../VitalsInput';
import { PatientInput } from '../PatientInput';
import { logPatientViewing } from '../api';

export const PatientDetailPage = () => {
    const patient = useLocation().state;

    useEffect(() => {
      const createLog = async () => {
          try {
              const data = {
                patientID: patient.patientID
              };
              await logPatientViewing(localStorage.getItem('nurseID'), data);
          } catch (error) {
              console.error('Error creating log:', error);
          }
      };
      //createLog();
  }, [patient]);

    return (
        <div className="container-fluid">
            <div className="row">
              <div className="col">
                <h1 id="title">{patient.name}</h1>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-3 m-3">
                <img src={image} alt="Picture of patient"/>
              </div>

              <div className="col-sm-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <Link to="/health"
                  state={patient}>
                  <button className="btn btn-secondary">Patient Health</button>
                </Link>
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
                Date Of Birth: {moment(patient.dateOfBirth).format('DD/MM/YYYY')}
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
              <div className="col-md-6 mt-4">
                <VitalsInput patient={patient} />
              </div>

              <div className="col-md-6">
                <PatientInput patient={patient} />
              </div>
            </div>
        </div>
    );
};