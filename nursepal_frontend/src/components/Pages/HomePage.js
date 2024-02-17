import { useEffect, useState } from "react"
import '../../css/HomePage.css';

export const HomePage = () => {
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
        console.log(data);

        setPatients(data);
    }

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
                    <ul>
                        <li>Paracetamol</li>
                        <li>Ibruprofen</li>
                        <li>Panadol</li>
                    </ul>
                </div>
                <div className="col">
                    <h3>Number of Patients Assigned to you: 3</h3>
                    <ul className="list-unstyled">
                        {patients?.length > 0
                            ? ( 
                                patients.map((patient) => (
                                    <li>
                                        <div className="container rounded bg-secondary mb-2" rounded="true">
                                            {patient.name}
                                        </div>
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
                </div>
            </div>
        </div>
    );
}