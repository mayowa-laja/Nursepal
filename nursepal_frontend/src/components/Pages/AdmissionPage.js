import { useState } from "react"
import axios from 'axios';

export const AdmissionPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        dateOfBirth: '',
        address: '',
        sex: '',
        bloodType: '',
        admissionReason: ''
    });

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
           const patient = {
            name: formData.name,
            age: formData.age,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            sex: formData.sex,
            bloodType: formData.bloodType
        }

            // const response = await fetch(`http://localhost:8000/nursepal/api/admit/${nurseID}`, {
            //     method: 'POST',
            //     patient,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(patient)
            // });
            const response = await axios.post(`http://localhost:8000/nursepal/api/admit/${nurseID}`, patient);

            if (!response.ok) {
                window.location.href = '/patients';
            }
            else{
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error admitting patient:', error);
        }

      };

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age:</label>
                    <input type="number" id="age" name="age" className="form-control" value={formData.age} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth:</label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address:</label>
                    <input type="text" id="address" name="address" className="form-control" value={formData.address} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="sex" className="form-label">Sex:</label>
                    <select id="sex" name="sex" className="form-select" value={formData.sex} onChange={handleInputChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="bloodType" className="form-label">Blood Type:</label>
                    <input type="text" id="bloodType" name="bloodType" className="form-control" value={formData.bloodType} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="admissionReason" className="form-label">Admission Reason:</label>
                    <input type="text" id="admissionReason" name="admissionReason" className="form-control" value={formData.admissionReason} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-primary">Admit Patient</button>
            </form>
        </div>
    );
}