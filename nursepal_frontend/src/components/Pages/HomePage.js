import { useEffect, useState } from "react"
import { getAssignedPatients } from "../api";
import { CareChecklist } from "../CareChecklist";
import { MedicineDue } from "../MedicineDue";
import { PatientsList } from "../PatientsList";
import '../../css/HomePage.css';
import image from '../../Images/stethoscope.png';

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
            <div className="row mb-3">
                <div className="col">
                    <h1 id="title">Home Page</h1>
                </div>
                <div className="col text-center">
                    <img src={image} alt="Webisite logo" style={{ width: '15vw', height: 'auto' }}/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h3>Medicine</h3>
                    <MedicineDue patients={patients}/>
                </div>
                <div className="col-md-6">
                    <h3>Assigned Patients</h3>
                    <PatientsList patients={patients}/>
                </div>
            </div>
            <div className="row text-center mt-4">
                <div className="col-md-6 mx-auto">
                    <CareChecklist patients={patients} />
                </div>
            </div>
        </div>
    );
}