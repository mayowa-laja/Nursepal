import React, { useState } from 'react';
import { recordNurseInput } from './api.js';

export const PatientInput = ({ patient }) => {
    const [formData, setFormData] = useState({
        type: '',
        description: '',
        commonSymptom: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nurseID = localStorage.getItem('nurseID');

        try {
            await recordNurseInput(nurseID, patient.patientID, formData);
            setSuccessMessage('Entry recorded successfully!');

            setFormData({
                type: '',
                description: '',
                commonSymptom: '',
            });

            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (error) {
            console.error('Error recording entry:', error);
            setErrorMessage('An error occurred while recording entry. Please try again.');

            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };

    return (
        <div className="container">
            <h3 className="mt-3">Record Symptom, Observation, or Care</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select id="type" name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                        <option value="">Select type...</option>
                        <option value="symptom">Symptom</option>
                        <option value="observation">Observation</option>
                        <option value="care">Care</option>
                    </select>
                </div>

                {formData.type === 'symptom' && (
                    <div className="mb-3">
                        <label htmlFor="commonSymptom" className="form-label">Common Symptoms</label>
                        <select id="commonSymptom" name="commonSymptom" className="form-select" value={formData.commonSymptom} onChange={handleInputChange}>
                            <option value="">Select a symptom</option>
                            <option value="headache">Headache</option>
                            <option value="stomach ache">Stomach ache</option>
                        </select>
                    </div>
                )}

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea id="description" name="description" className="form-control" value={formData.description} onChange={handleInputChange} disabled={formData.commonSymptom !== ''}></textarea>
                </div>

                {errorMessage && (
                    <div className="alert alert-danger">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};
