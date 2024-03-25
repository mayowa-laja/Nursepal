import React from 'react';
import moment from 'moment';

export const Care = ({ care }) => {
    return (
        <>
            <h3>Care</h3>
            <ul>
                {care.map((c) => (
                    <li key={c.careID}>{c.task} - {moment(c.dateTimeCompleted).format('Do MMMM YYYY, h:mm:ss a')}</li>
                ))}
            </ul>
        </>
    );
};
