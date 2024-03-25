import React, { useState, useEffect } from 'react';
import { getAssignedPatientMedication, getLastMedicineAdministration, administerMedication } from './api';
import ReactPaginate from 'react-paginate';
import '../css/pagination.css';

export const MedicineDue = ({ patients }) => {
    const [medications, setMedications] = useState([]);
    const [lastMedicineAdmin, setLastMedicineAdmin] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const medicationsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medicationsData, lastMedicineAdministration] = await Promise.all([
                    getAssignedPatientMedication(localStorage.getItem('nurseID')),
                    getLastMedicineAdministration(localStorage.getItem('nurseID'))
                ]);
    
                const pages = Math.ceil(medicationsData.length / medicationsPerPage);
                setPageCount(pages);
                setLastMedicineAdmin(lastMedicineAdministration);
                setMedications(prevMedications => {
                    const sortedMeds = sortMedications(medicationsData);
                    // Ensure medications are only updated if they've actually changed
                    if (JSON.stringify(sortedMeds) !== JSON.stringify(prevMedications)) {
                        return sortedMeds;
                    } else {
                        return prevMedications;
                    }
                });
            } catch (error) {
                console.error('Error fetching medication information:', error);
            }
        };
    
        fetchData();
    }, [medications]);

    const getLastAdminTimeForMedicine = (medicineName, patientID) => {
        const lastAdminForMedicine = lastMedicineAdmin.filter(admin => admin.task == medicineName && admin.patient == patientID);
        return lastAdminForMedicine.length > 0 ? new Date(lastAdminForMedicine[0].dateTimeCompleted) : null;
    }

    const calculateTimeRemaining = (medication, lastAdminTime) => {
        const currentDateTime = new Date();
        let nextDoseDateTime = new Date(medication.startDate);
        const frequencyInMilliseconds = medication.frequency_hours * 60 * 60 * 1000;
    
        if (lastAdminTime && lastAdminTime > nextDoseDateTime) {
            //nextDoseDateTime = new Date(lastAdminTime);
            nextDoseDateTime.setTime(lastAdminTime.getTime());
        }
            
        nextDoseDateTime.setTime(nextDoseDateTime.getTime() + frequencyInMilliseconds);
    
        return nextDoseDateTime.getTime() - currentDateTime.getTime();
    }

    const formatTime = (timeRemaining) => {
        if (timeRemaining >= 3600000) { // If time remaining is more than or equal to 1 hour (3600000 milliseconds)
            const hours = Math.floor(timeRemaining / 3600000);
            const minutes = Math.ceil((timeRemaining % 3600000) / 60000); // Remaining minutes after subtracting hours
            return `${hours} hour(s) ${minutes} minute(s)`;
        } else {
            return `${Math.ceil(timeRemaining / (1000 * 60))} minutes`;
        }
    }

    const getPatientName = (patientID) => {
        const patient = patients.find(patient => patient.patientID === patientID);
        return patient ? patient.name : 'Unknown';
    }

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleAdministered = async (medication) => {
        console.log('Medication administered:', medication.medication)
        const data = {
            patientID: medication.patient,
            task: medication.medication,
        }

        try{
            await administerMedication(localStorage.getItem('nurseID'), data);

            const [updatedMedications, lastMedicineAdministration] = await Promise.all([
                getAssignedPatientMedication(localStorage.getItem('nurseID')),
                getLastMedicineAdministration(localStorage.getItem('nurseID'))
            ]);
    
            setLastMedicineAdmin(lastMedicineAdministration);
            let sortedMeds = sortMedications(updatedMedications);
            setMedications(sortedMeds);
        } catch (error) {
            console.error('Error updating checklist item:', error);
        }
    }

    const displayMedications = medications
        .slice(currentPage * medicationsPerPage, (currentPage + 1) * medicationsPerPage)
        .map((medication) => {
            const lastAdminTime = getLastAdminTimeForMedicine(medication.medication, medication.patient);
            const timeRemaining = calculateTimeRemaining(medication, lastAdminTime);
            const overdue = timeRemaining < 0;
            return (
                <li key={medication.medicationID} className='list-group-item'>
                    <div>{medication.medication} - Dose: {medication.quantity} - {getPatientName(medication.patient)} (PatientID: {medication.patient})</div>
                    <div>
                        {overdue ? (
                        <span className="text-danger">Overdue by: {formatTime(-timeRemaining)}</span>
                        ) : (
                        <span>Next dose in: {formatTime(timeRemaining)}</span>
                        )}
                    </div>
                    <button onClick={() => handleAdministered(medication)}>Administer</button>
                </li>
            )
        });

    const sortMedications = (medications) => {
        // Create a new array with sorted medications
        const sortedMeds = [...medications].sort((a, b) => {
            const lastAdminTimeA = getLastAdminTimeForMedicine(a.medication, a.patient);
            const lastAdminTimeB = getLastAdminTimeForMedicine(b.medication, b.patient);
            const dueTimeA = calculateTimeRemaining(a, lastAdminTimeA);
            const dueTimeB = calculateTimeRemaining(b, lastAdminTimeB);

            // Check if either medication is overdue
            const overdueA = dueTimeA < 0;
            const overdueB = dueTimeB < 0;

            // If one medication is overdue and the other is not, sort by overdue status
            if (overdueA !== overdueB) {
                return overdueA ? -1 : 1;
            } 
            
            // If both are overdue or not overdue, sort by due time
            return dueTimeA - dueTimeB;
        });

        // Set the state with the new sorted array
        return sortedMeds;
    };

    return (
        <>
            <h3 className="mt-3">Medication Schedule</h3>
            <ul className="list-group">
                {displayMedications}
            </ul>
            <ReactPaginate
                previousLabel='&laquo;'
                nextLabel='&raquo;'
                breakLabel='...'
                pageCount={pageCount}
                //marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination-box'}
                activeClassName={'active'}
                renderOnZeroPageCount={null}
            />
        </>
    );
};
