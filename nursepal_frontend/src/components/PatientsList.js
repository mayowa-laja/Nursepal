import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';

export const PatientsList = ({ patients }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (patients && patients.length > 0) {
            setLoading(false);
        }
    }, [patients]);

    return (
        <>
            {loading ? (
                <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="lg" />
                    <span className="ms-2">Loading...</span>
                </div>
                ): (
                <div className="list-group">
                    {patients?.length > 0 ? ( 
                        patients.map((patient) => (
                            <Link 
                                key={patient.patientID}
                                className={`list-group-item list-group-item-action ${localStorage.getItem('nurseID') == patient.nurse ? 'patientListItem' : 'otherPatientListItem'}`}
                                to="/patient"
                                state={patient}>
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{patient.name}</div>
                                    {patient.recent_admission?.admissionDateTime ? (
                                        'Admission Date: ' + moment(patient.recent_admission.admissionDateTime).format('DD/MM/YYYY, h:mm:ss a')
                                    ) : (
                                        "No admission date available"
                                    )
                                    }
                                    {patient.recent_admission?.dischargeDateTime ? (
                                            ' | Expected discharge Date: ' + moment(patient.recent_admission.dischargeDateTime).format('DD/MM/YYYY, h:mm:ss a')
                                        ) : (
                                            " | No expected discharge date available"
                                        )
                                    }
                                </div>
                            </Link>
                        ))           
                        ) : (
                            <div className="list-group-item list-group-item-action patientListItem">
                                No patients found
                            </div>
                        )}
                </div>
            )}
        </>
    );
}