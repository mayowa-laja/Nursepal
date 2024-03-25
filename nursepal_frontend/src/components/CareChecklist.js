import React, { useEffect, useState } from 'react';
import { fetchChecklist, updateChecklistItem } from './api'; 

export const CareChecklist = ({patients}) => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [items, setItems] = useState([]);

    const handlePatientChange = async (patientID) => {
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

    const uncheckedItems = items.filter(item => !item.checked);
    const checkedItems = items.filter(item => item.checked);

    return (
        <>
            <div className="btn-group dropup">
                <button className="btn btn-secondary dropdown-toggle dropdown_button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Select Patient
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Select...</a></li>
                    {patients.map(patient => (
                        <li key={patient.patientID}>
                            <button className="dropdown-item" onClick={() => handlePatientChange(patient.patientID)}>
                                {patient.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>


            <div className="text-start">
                {selectedPatient && (
                    <ul className="list-group">
                        {uncheckedItems.map(item => (
                            <li className="care-checklist-item list-group-item" key={item.id}>
                                <input
                                    className="form-check-input me-1"
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => handleToggle(item.id)}
                                />
                                <label className="form-check-label">{item.name}</label>
                            </li>
                        ))}

                        {checkedItems.map(item => (
                            <li className="care-checklist-item list-group-item" key={item.id}>
                                <span>✅</span>
                                <span>{item.name}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}