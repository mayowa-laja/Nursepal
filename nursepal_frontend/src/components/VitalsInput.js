import { useState } from "react"
import { recordVitals } from "./api";

export const VitalsInput = ({patient}) => {
    const [formData, setFormData] = useState({
        temperature: '',
        heartRate: '',
        systolicBloodPressure: '',
        diastolicBloodPressure: '',
        respiratoryRate: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(value)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData)

        const nurseID = localStorage.getItem('nurseID');

        try {
            await recordVitals(nurseID, patient.patientID, formData);
            setSuccessMessage('Vital measurements saved successfully!');

            setFormData({
                    temperature: '',
                    heartRate: '',
                    systolicBloodPressure: '',
                    diastolicBloodPressure: '',
                    respiratoryRate: ''
            });

            setIsExpanded(!isExpanded);
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (error) {
            console.error('Error recording vitals:', error);
            setErrorMessage('An error occured while recording vitals. Please try again.');
        }

    };

    const toggleForm = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="container-fluid">
            <button className="btn btn-secondary" onClick={toggleForm}>{isExpanded ? 'Collapse Vitals Form' : 'Input Vitals'}</button>

            {isExpanded && (
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="temperature" className="form-label">Temperature</label>
                        <input type="number" id="temperature" name="temperature" className="form-control" value={formData.temperature} onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="heartRate" className="form-label">Heart Rate</label>
                        <input type="number" id="heartRate" name="heartRate" className="form-control" value={formData.heartRate} onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="systolicBloodPressure" className="form-label">Systolic Blood Pressure</label>
                        <input type="number" id="systolicBloodPressure" name="systolicBloodPressure" className="form-control" value={formData.systolicBloodPressure} onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="diastolicBloodPressure" className="form-label">Diastolic Blood Pressure</label>
                        <input type="number" id="diastolicBloodPressure" name="diastolicBloodPressure" className="form-control" value={formData.diastolicBloodPressure} onChange={handleInputChange} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="respiratoryRate" className="form-label">Respiratory Rate</label>
                        <input type="number" id="respiratoryRate" name="respiratoryRate" className="form-control" value={formData.respiratoryRate} onChange={handleInputChange} />
                    </div>

                    {errorMessage && (
                        <div className="alert alert-danger">
                            {errorMessage}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary mb-3">Submit</button>
                </form>
            )}
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
        </div>
    );
}