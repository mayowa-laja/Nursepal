import { useEffect, useState } from "react";
import { getAllPatients } from "../api";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { AdmissionForm } from "../AdmissionForm";
import '../../css/patientPage.css'

export const PatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('loggedIn') === null){
            window.location.href = '/login';
        }
        getAllPatients(localStorage.getItem('nurseID'))
            .then(data => {
                setPatients(data);
                setLoading(false);
                console.log(patients)
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
                setLoading(false);
            });
    }, []);

    const handleAdmissionSuccess = () => {
        getAllPatients(localStorage.getItem('nurseID'))
            .then(data => {
                setPatients(data);
            })
            .catch(error => {
                console.error('Error re-fetching patients:', error);
            });
    };

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col">
                    <h1 id="title">Patients Page</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h3>Patients:</h3>
                    <div className="legend-item me-2">
                        <div className="legend-square bg-success"></div>
                        <span>Patients assigned to you</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-square bg-secondary"></div>
                        <span>Other patients</span>
                    </div>
                    {loading ? (
                        <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faSpinner} spin size="lg" />
                            <span className="ms-2">Loading...</span>
                        </div>
                    ): (
                        <ul className="list-unstyled">
                            {patients?.length > 0
                                ? ( 
                                    patients.map((patient) => (
                                        <li key={patient.patientID}>
                                            <Link to="/patient"
                                                state={patient}>
                                                <div className={`container-fluid rounded text-white border ${localStorage.getItem('nurseID') == patient.nurse ? 'bg-success' : 'bg-secondary'}`}>
                                                    {patient.name}
                                                </div>
                                            </Link>
                                        </li>
                                    ))           
                                ) : (
                                    <li>
                                        <div className="container-fluid rounded bg-success text-white border">
                                            No patients found
                                        </div>
                                    </li>
                            )}
                        </ul>
                    )}
                </div>
                <div className="col-md-6 text-center">
                    <AdmissionForm handleAdmissionSuccess={handleAdmissionSuccess}/>
                </div>
            </div>
        </div>
    );
}