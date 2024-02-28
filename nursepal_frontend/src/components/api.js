import axios from 'axios';

const baseURL = 'http://localhost:8000/nursepal/api';

export const loginUser = async (username, password) => {
    try{
        const response = await axios.post(`${baseURL}/login`, {
            username: username,
            password: password
        });

        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const getPatients = async (nurseID) => {
    try{
        const response = await axios.get(`${baseURL}/patients/${nurseID}`);
        return response.data;
    } 
    catch (error) {
        console.error('Error fetching patients:', error);
        throw error;
    }
}

export const admitPatient = async (nurseID, formData) => {
    try {
        const payload = {
            patient: {
                name: formData.name,
                age: formData.age,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
                sex: formData.sex,
                bloodType: formData.bloodType
            },
            admissionReason: formData.admissionReason
        };

        const response = await axios.post(`${baseURL}/admit/${nurseID}`, payload)

        return response.data
    } catch (error) {
        console.error('Error admitting patient:', error);
        throw error;
    }
}

export const recordVitals = async (nurseID, patientID, formData) => {
    try {
        const payload = {
            vitals: {
                temperature: formData.temperature,
                heartRate: formData.heartRate,
                systolicBloodPressure: formData.systolicBloodPressure,
                diastolicBloodPressure: formData.diastolicBloodPressure,
                respiratoryRate: formData.respiratoryRate
            },
            patientID: patientID,
        }

        const response = await axios.post(`${baseURL}/vitals/${nurseID}`, payload)

        return response.data
    } catch (error) {
        console.error('Error recording vitals:', error);
        throw error;
    }
}

export const getVitals = async (patientID) => {
    try{
        const response = await axios.get(`${baseURL}/vitals/${patientID}`);
        return response.data;
    } 
    catch (error) {
        console.error('Error fetching vitals information:', error);
        throw error;
    }
}

export const recordNurseInput = async (nurseID, patientID, formData) => {
    try {
        const payload = {
            nurseInput: {
                type: formData.type,
                description: formData.description,
            },
            patientID: patientID,
        }

        const response = await axios.post(`${baseURL}/nurse_input/${nurseID}`, payload)

        return response.data
    } catch (error) {
        console.error('Error recording nurse input:', error);
        throw error;
    }
}

export const fetchChecklist = async (patientID) => {
    try{
        const response = await axios.get(`${baseURL}/checklist/${patientID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching checklist:', error);
        throw error;
    }
}

export const updateChecklistItem = async (patientID, itemID) => {
    try{
        const payload = {
            item_id: itemID
        }

        const response = await axios.post(`${baseURL}/checklist/${patientID}`, payload);
        return response.data
    } catch (error) {
        console.error('Error updating checklist item:', error);
        throw error;
    }
}