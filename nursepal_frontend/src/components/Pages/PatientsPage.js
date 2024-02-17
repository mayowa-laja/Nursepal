import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

export const PatientsPage = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('loggedIn') === null){
            window.location.href = '/login';
        }
        getPatients();
    }, []);

    const getPatients = async () => {
        const nurseID = localStorage.getItem('nurseID');
        const response = await fetch(`http://localhost:8000/nursepal/api/patients/${nurseID}`);
        const data = await response.json();

        setPatients(data);
    }

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
                    <ul className="list-unstyled">
                        {patients?.length > 0
                            ? ( 
                                patients.map((patient) => (
                                    <li>
                                        <div className="container-fluid rounded bg-success text-white border" rounded>
                                        {patient.name}
                                        </div>
                                    </li>
                                ))           
                            ) : (
                                <li>
                                    <div className="container-fluid rounded bg-success text-white border" rounded>
                                        No patients found
                                    </div>
                                </li>
                        )}
                    </ul>
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