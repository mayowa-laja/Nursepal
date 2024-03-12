import { useEffect, useState } from "react"
import { getAssignedPatients } from "../api";
import { Link } from 'react-router-dom';
import { CareChecklist } from "../CareChecklist";
import { MedicineDue } from "../MedicineDue";
import '../../css/HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export const HomePage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('loggedIn') === null){
            window.location.href = '/login';
        }
        getAssignedPatients(localStorage.getItem('nurseID'))
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
            <div className="row">
                <div className="col">
                    <h1 id="title">Home Page</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h3>Medicine</h3>
                    <MedicineDue patients={patients}/>
                </div>
                <div className="col">
                    <h3>Number of Patients Assigned to you: 3</h3>
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
                                                <div className="container rounded bg-secondary mb-2" rounded="true">
                                                {patient.name}
                                                </div>
                                            </Link>
                                        </li>
                                    ))           
                                ) : (
                                    <li>
                                        <div className="container rounded bg-secondary mb-2" rounded="true">
                                            No patients found
                                        </div>
                                    </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
            <div className="row text-center mt-3">
                <CareChecklist patients={patients} />
            </div>
        </div>
    );
}