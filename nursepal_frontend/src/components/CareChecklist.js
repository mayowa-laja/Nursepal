import React, { useEffect, useState } from 'react';
import { fetchChecklist, updateChecklistItem } from './api'; 

export const CareChecklist = ({patients}) => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [items, setItems] = useState([]);

    const handlePatientChange = async (e) => {
        const patientID = e.target.value;
        setSelectedPatient(patientID);
        console.log(patients);
        
        try{
            const checklistItems = await fetchChecklist(patientID);
            setItems(checklistItems);
            console.log(checklistItems);
        } catch (error) {
            console.error('Error fetching checklist:', error);
        }
    }

    const handleToggle = async (itemID) => {
        try{
            await updateChecklistItem(selectedPatient, itemID);
            setItems(prevItems => prevItems.map(item => item.id === itemID ? {...item, checked: !item.checked} : item));
        } catch (error) {
            console.error('Error updating checklist item:', error);
        }
    }

    return (
        <div>
            <label>Select Patient:</label>
            <select value={selectedPatient} onChange={handlePatientChange}>
                <option value="">Select...</option>
                {patients.map(patient => (
                <option key={patient.patientID} value={patient.patientID}>{patient.name}</option>
                ))}
            </select>

            {selectedPatient && (
                <div>
                    {items.map(item => (
                        <div key={item.id}>
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggle(item.id)}
                        />
                        <label>{item.name}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}