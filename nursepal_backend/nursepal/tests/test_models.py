from django.test import TestCase
from ..models import *
from datetime import datetime, date
from decimal import Decimal
from django.utils import timezone


class NurseModelTestCase(TestCase):
        def setUp(self):
            # Create a User
            user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
            # Create a Nurse instance
            nurse = Nurse.objects.create(
                user=user,
                name='Nurse Name',
                email='nurse@example.com',
                address='Nurse Address'
            )

        def test_nurse_creation(self):
            # Retrieve the nurse from the database
            nurse_from_db = Nurse.objects.get(name='Nurse Name')
            # Assert that the nurse was created with the correct attributes
            self.assertEqual(nurse_from_db.name, 'Nurse Name')
            self.assertEqual(nurse_from_db.email, 'nurse@example.com')
            self.assertEqual(nurse_from_db.address, 'Nurse Address')


class PatientModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )

    def test_patient_creation(self):
        # Create a Patient instance
        patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )
        # Retrieve the patient from the database
        patient_from_db = Patient.objects.get(name='Patient Name')
        # Assert that the patient was created with the correct attributes
        self.assertEqual(patient_from_db.name, 'Patient Name')
        self.assertEqual(patient_from_db.age, 30)
        self.assertEqual(patient_from_db.dateOfBirth, date(1992, 5, 20))
        self.assertEqual(patient_from_db.address, 'Patient Address')
        self.assertEqual(patient_from_db.sex, 'Male')
        self.assertEqual(patient_from_db.bloodType, 'AB+')
        self.assertEqual(patient_from_db.nurse, self.nurse)


class AdmissionModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_admission_creation(self):
        # Create an Admission instance
        admission = Admission.objects.create(
            admissionReason='Test Admission',
            patient=self.patient,
            admissionDateTime=timezone.now(),
            nurse=self.nurse
        )
        # Retrieve the admission from the database
        admission_from_db = Admission.objects.get(admissionReason='Test Admission')
        # Assert that the admission was created with the correct attributes
        self.assertEqual(admission_from_db.admissionReason, 'Test Admission')
        self.assertEqual(admission_from_db.patient, self.patient)
        self.assertEqual(admission_from_db.nurse, self.nurse)


class VitalsModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_vitals_creation(self):
        # Create a Vitals instance
        vitals = Vitals.objects.create(
            patient=self.patient,
            dateTime=timezone.now(),
            temperature=Decimal('98.6'),
            heartRate=80,
            systolicBloodPressure=120,
            diastolicBloodPressure=80,
            respiratoryRate=16,
            nurse=self.nurse
        )
        # Retrieve the vitals from the database
        vitals_from_db = Vitals.objects.get(patient=self.patient)
        # Assert that the vitals were created with the correct attributes
        self.assertEqual(vitals_from_db.patient, self.patient)
        self.assertEqual(vitals_from_db.temperature, Decimal('98.6'))
        self.assertEqual(vitals_from_db.heartRate, 80)
        self.assertEqual(vitals_from_db.systolicBloodPressure, 120)
        self.assertEqual(vitals_from_db.diastolicBloodPressure, 80)
        self.assertEqual(vitals_from_db.respiratoryRate, 16)
        self.assertEqual(vitals_from_db.nurse, self.nurse)


class MedicationModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_medication_creation(self):
        # Create a Medication instance
        medication = Medication.objects.create(
            patient=self.patient,
            startDate=date.today(),
            endDate=date.today(),
            quantity=1,
            frequency_hours=5,
            medication='Test Medication',
            prescriber='Test Prescriber'
        )
        # Retrieve the medication from the database
        medication_from_db = Medication.objects.get(patient=self.patient)
        # Assert that the medication was created with the correct attributes
        self.assertEqual(medication_from_db.patient, self.patient)
        self.assertEqual(medication_from_db.quantity, 1)
        self.assertEqual(medication_from_db.frequency_hours, 5)
        self.assertEqual(medication_from_db.medication, 'Test Medication')
        self.assertEqual(medication_from_db.prescriber, 'Test Prescriber')


class CareModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_care_creation(self):
        # Create a Care instance
        care = Care.objects.create(
            patient=self.patient,
            task='Test Task',
            dateTimeCompleted=timezone.now(),
            nurse=self.nurse
        )
        # Retrieve the care from the database
        care_from_db = Care.objects.get(patient=self.patient)
        # Assert that the care was created with the correct attributes
        self.assertEqual(care_from_db.patient, self.patient)
        self.assertEqual(care_from_db.task, 'Test Task')
        self.assertEqual(care_from_db.nurse, self.nurse)


class SymptomsModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_symptoms_creation(self):
        # Create a Symptoms instance
        symptoms = Symptoms.objects.create(
            patient=self.patient,
            dateTime=timezone.now(),
            symptomDescription='Test Symptom',
            nurse=self.nurse
        )
        # Retrieve the symptoms from the database
        symptoms_from_db = Symptoms.objects.get(patient=self.patient)
        # Assert that the symptoms were created with the correct attributes
        self.assertEqual(symptoms_from_db.patient, self.patient)
        self.assertEqual(symptoms_from_db.symptomDescription, 'Test Symptom')
        self.assertEqual(symptoms_from_db.nurse, self.nurse)


class TreatmentsModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_treatments_creation(self):
        # Create a Treatments instance
        treatments = Treatments.objects.create(
            patient=self.patient,
            dateTime=timezone.now(),
            treatment='Test Treatment'
        )
        # Retrieve the treatments from the database
        treatments_from_db = Treatments.objects.get(patient=self.patient)
        # Assert that the treatments were created with the correct attributes
        self.assertEqual(treatments_from_db.patient, self.patient)
        self.assertEqual(treatments_from_db.treatment, 'Test Treatment')


class ObservationsModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_observations_creation(self):
        # Create an Observations instance
        observations = Observations.objects.create(
            patient=self.patient,
            dateTime=timezone.now(),
            observationDescription='Test Observation',
            nurse=self.nurse
        )
        # Retrieve the observations from the database
        observations_from_db = Observations.objects.get(patient=self.patient)
        # Assert that the observations were created with the correct attributes
        self.assertEqual(observations_from_db.patient, self.patient)
        self.assertEqual(observations_from_db.observationDescription, 'Test Observation')
        self.assertEqual(observations_from_db.nurse, self.nurse)


class AllergiesModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_allergies_creation(self):
        # Create an Allergies instance
        allergies = Allergies.objects.create(
            patient=self.patient,
            allergyDescription='Test Allergy'
        )
        # Retrieve the allergies from the database
        allergies_from_db = Allergies.objects.get(patient=self.patient)
        # Assert that the allergies were created with the correct attributes
        self.assertEqual(allergies_from_db.patient, self.patient)
        self.assertEqual(allergies_from_db.allergyDescription, 'Test Allergy')


class LogViewingModelTestCase(TestCase):
    def setUp(self):
        # Create a Nurse
        user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_log_viewing_creation(self):
        # Create a LogViewing instance
        log_viewing = LogViewing.objects.create(
            nurse=self.nurse,
            patient=self.patient,
            dateTime=timezone.now()
        )
        # Retrieve the log viewing from the database
        log_viewing_from_db = LogViewing.objects.get(nurse=self.nurse)
        # Assert that the log viewing was created with the correct attributes
        self.assertEqual(log_viewing_from_db.nurse, self.nurse)
        self.assertEqual(log_viewing_from_db.patient, self.patient)


class CarePlanChecklistItemModelTestCase(TestCase):
    def setUp(self):
        # Create a Patient
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+'
        )

    def test_care_plan_checklist_item_creation(self):
        # Create a CarePlanChecklistItem instance
        care_plan_checklist_item = CarePlanChecklistItem.objects.create(
            patient=self.patient,
            name='Test Checklist Item',
            checked=False
        )
        # Retrieve the care plan checklist item from the database
        care_plan_checklist_item_from_db = CarePlanChecklistItem.objects.get(patient=self.patient)
        # Assert that the care plan checklist item was created with the correct attributes
        self.assertEqual(care_plan_checklist_item_from_db.patient, self.patient)
        self.assertEqual(care_plan_checklist_item_from_db.name, 'Test Checklist Item')
        self.assertFalse(care_plan_checklist_item_from_db.checked)


class PredefinedChecklistItemModelTestCase(TestCase):
    def test_predefined_checklist_item_creation(self):
        # Create a PredefinedChecklistItem instance
        predefined_checklist_item = PredefinedChecklistItem.objects.create(
            name='Test Predefined Checklist Item',
            group='Test Group'
        )
        # Retrieve the predefined checklist item from the database
        predefined_checklist_item_from_db = PredefinedChecklistItem.objects.get(name='Test Predefined Checklist Item')
        # Assert that the predefined checklist item was created with the correct attributes
        self.assertEqual(predefined_checklist_item_from_db.name, 'Test Predefined Checklist Item')
        self.assertEqual(predefined_checklist_item_from_db.group, 'Test Group')
