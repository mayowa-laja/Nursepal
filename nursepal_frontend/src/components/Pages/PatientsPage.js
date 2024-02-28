import { useEffect, useState } from "react";
import { getPatients } from "../api";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export const PatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('loggedIn') === null){
            window.location.href = '/login';
        }
        getPatients(localStorage.getItem('nurseID'))
            .then(data => {
                setPatients(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col">
                    <h1 id="title">Patients Page</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6879">
                    <h3>Patients:</h3>
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
                                                <div className="container-fluid rounded bg-success text-white border">
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
            </div>
            <div className="row">
                <Link to="/admission">
                    <button className="btn btn-primary">Admit a Patient</button>
                </Link>
            </div>
        </div>
    );
}