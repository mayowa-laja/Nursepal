from rest_framework.test import APITestCase, APIClient
from ..models import *
from datetime import date, datetime


class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='nurse1', email='nurse1@example.com', password='nursepass')
        self.nurse = Nurse.objects.create(
            user=self.user,
            name='Nurse Name',
            email='nurse@example.com',
            address='Nurse Address'
        )


class LoginLogoutAPITestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()

    def test_login(self):
        response = self.client.post('/nursepal/api/login', {'username': 'nurse1', 'password': 'nursepass'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], 'Login successful')
        self.assertEqual(response.data['nurseID'], self.nurse.nurseID)

    def test_logout(self):
        response = self.client.post('/nursepal/api/logout')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['message'], 'Logout successful')


class PatientAPITestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )
        patient2 = Patient.objects.create(
            name='Patient Name2',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Female',
            bloodType='AB+',
            nurse=self.nurse
        )
        patient3 = Patient.objects.create(
            name='Patient Name3',
            age=30,
            dateOfBirth=date(1992, 5, 20),
            address='Patient Address',
            sex='Male',
            bloodType='A+'
        )

    def test_get_all_patients(self):
        response = self.client.get('/nursepal/api/patients')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_get_assigned_patients(self):
        response = self.client.get(f'/nursepal/api/patients/{self.nurse.nurseID}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)


class AdmitAPITestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.patient = Patient.objects.create(
            name='Patient Name',
            age=30,
            dateOfBirth='1992-05-20',
            address='Patient Address',
            sex='Male',
            bloodType='AB+',
            nurse=self.nurse
        )

    def test_admit_existing_patient(self):
        patient_data = {
            'name': 'Patient Name',
            'age': 30,
            'dateOfBirth': '1992-05-20',
            'address': 'Patient Address',
            'sex': 'Male',
            'bloodType': 'AB+'
        }

        response = self.client.post(f'/nursepal/api/admit/{self.nurse.nurseID}', data={'patient': patient_data, 'admissionReason': 'Broken leg'}, format='json')
        patient_resp = response.data.get('patient')
        patient = Patient.objects.filter(
            name=patient_resp.get('name'),
            dateOfBirth=patient_resp.get('dateOfBirth'),
            address=patient_resp.get('address')
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(patient), 1)

    def test_admit_new_patient(self):
        patient_data = {
            'name': 'Patient Name2',
            'age': 50,
            'dateOfBirth': '1997-05-20',
            'address': 'Patient Address2',
            'sex': 'Female',
            'bloodType': 'A+'
        }

        response = self.client.post(f'/nursepal/api/admit/{self.nurse.nurseID}', data={'patient': patient_data, 'admissionReason': 'Broken leg'}, format='json')
        patient_resp = response.data.get('patient')
        patient = Patient.objects.filter(
            name=patient_resp.get('name'),
            dateOfBirth=patient_resp.get('dateOfBirth'),
            address=patient_resp.get('address')
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(patient), 1)
