import React from 'react';

export const Medications = ({ medications }) => {
    return (
        <>
            <h3>Medications</h3>
            <ul>
                {medications.map((medication) => (
                    <li key={medication.medicationID}>{medication.medication} - Frequency: Every {medication.frequency_hours} hours</li>
                ))}
            </ul>
        </>
    );
};
