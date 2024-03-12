import React from 'react';
import moment from 'moment';

export const Symptoms = ({ symptoms }) => {
    return (
        <div>
            <h3>Symptoms</h3>
            <ul>
                {symptoms.map((symptom) => (
                    <li key={symptom.symptomID}>{symptom.symptomDescription} - {moment(symptom.dateTime).format('Do MMMM YYYY, h:mm:ss a')}</li>
                ))}
            </ul>
        </div>
    );
};
