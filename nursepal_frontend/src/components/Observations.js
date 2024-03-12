import React from 'react';
import moment from 'moment';

export const Observations = ({ observations }) => {
    return (
        <div>
            <h3>Observations</h3>
            <ul>
                {observations.map((observation) => (
                    <li key={observation.observationID}>{observation.observationDescription} - {moment(observation.dateTime).format('Do MMMM YYYY, h:mm:ss a')}</li>
                ))}
            </ul>
        </div>
    );
};
