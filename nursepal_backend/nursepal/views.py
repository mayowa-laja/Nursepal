from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import *
from rest_framework.response import Response
from django.db import IntegrityError
from django.db.models import Max

# Create your views here.


@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(username=username)
        nurse = user.nurse
        if user.check_password(password):
            data = {'message': 'Login successful', 'nurseID': nurse.nurseID}
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'message': 'User does not exists'}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print(f"An error occurred: {e}")
        return Response({'message': e}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def user_logout(request):
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_patients(request):
    patients = Patient.objects.all()

    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_assigned_patients(request, nurse_id):
    nurse = get_object_or_404(Nurse, nurseID=nurse_id)

    patients = Patient.objects.filter(nurse=nurse)

    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def admit_patient(request, nurse_id):
    patient_data = request.data.get("patient", {})
    admission_reason = request.data.get("admissionReason", "")

    serializer = PatientSerializer(data=patient_data)

    if serializer.is_valid():
        patient = Patient.objects.filter(
            name=patient_data.get('name'),
            dateOfBirth=patient_data.get('dateOfBirth'),
            address=patient_data.get('address')
        ).first()

        if patient:
            admission = Admission.objects.create(
                patient=patient,
                admissionReason=admission_reason,
                admissionDateTime=timezone.now(),  # You can adjust this according to your requirement
                nurse_id=nurse_id
            )
        else:
            patient = serializer.save()
            admission = Admission.objects.create(
                patient=patient,
                admissionReason=admission_reason,
                admissionDateTime=timezone.now(),  # You can adjust this according to your requirement
                nurse_id=nurse_id
            )

        predefined_items = PredefinedChecklistItem.objects.filter(group="Fundamental Care")

        for item in predefined_items:
            CarePlanChecklistItem.objects.create(patient=patient, predefined_item=item)

        response_data = {
            'patient': serializer.data,
            'admissionReason': admission.admissionReason
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_recent_admission(request, patient_id):
    if request.method == 'GET':
        patient = get_object_or_404(Patient, patientID=patient_id)

        most_recent_admission = Admission.objects.filter(patient=patient).order_by('-admissionDateTime').first()

        if most_recent_admission:
            serializer = AdmissionSerializer(most_recent_admission)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No recent admission found for this patient."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST', 'GET'])
def checklist(request, patient_id):
    if request.method == 'POST':
        item_id = request.data.get('item_id')
        item = get_object_or_404(CarePlanChecklistItem, id=item_id)
        item.checked = not item.checked
        item.save()

        serializer = CarePlanChecklistItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'GET':
        patient = get_object_or_404(Patient, pk=patient_id)
        checklist_items = CarePlanChecklistItem.objects.filter(patient=patient)
        checklist_data = [{
            'id': item.id,
            'name': item.predefined_item.name,
            'checked': item.checked
        } for item in checklist_items]
        return Response(checklist_data, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def vitals(request, id_):
    if request.method == 'POST':
        form_data = request.data.get("vitals")
        patient_id = request.data.get("patientID")

        patient = get_object_or_404(Patient, pk=patient_id)

        try:
            vitals_record = Vitals.objects.create(
                patient=patient,
                dateTime=timezone.now(),
                temperature=form_data.get("temperature"),
                heartRate=form_data.get("heartRate"),
                systolicBloodPressure=form_data.get("systolicBloodPressure"),
                diastolicBloodPressure=form_data.get("diastolicBloodPressure"),
                respiratoryRate=form_data.get("respiratoryRate"),
                nurse_id=id_
            )
        except IntegrityError as e:
            return Response({"message": "Failed to create Vitals record", "error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "An error occurred", "error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not vitals_record:
            return Response({"message": "Failed to create Vitals record"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Success"}, status=status.HTTP_201_CREATED)

    if request.method == "GET":
        patient = get_object_or_404(Patient, patientID=id_)

        vital_info = Vitals.objects.filter(patient=patient)

        serializer = VitalsSerializer(vital_info, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', 'GET'])
def nurse_input(request, id_):
    if request.method == 'POST':
        form_data = request.data.get("nurseInput")

        input_type = form_data.get("type")
        description = form_data.get("description")
        common_symptom = form_data.get("commonSymptom")
        patient_id = request.data.get("patientID")

        patient = get_object_or_404(Patient, pk=patient_id)

        try:
            if input_type == "symptom":
                if description != '':
                    symptom_record = Symptoms.objects.create(
                        patient=patient,
                        dateTime=timezone.now(),
                        symptomDescription=description,
                        nurse_id=id_
                    )
                else:
                    symptom_record = Symptoms.objects.create(
                        patient=patient,
                        dateTime=timezone.now(),
                        symptomDescription=common_symptom,
                        nurse_id=id_
                    )
            elif input_type == "observation":
                observation_record = Observations.objects.create(
                    patient=patient,
                    dateTime=timezone.now(),
                    observationDescription=description,
                    nurse_id=id_
                )
            elif input_type == "care":
                care_record = Care.objects.create(
                    patient=patient,
                    dateTimeCompleted=timezone.now(),
                    task=description,
                    nurse_id=id_
                )
        except IntegrityError as e:
            return Response({"message": "Failed to create nurse input record", "error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "An error occurred", "error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Success"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_symptoms(request, id_):
    if request.method == 'GET':
        patient = get_object_or_404(Patient, patientID=id_)
        symptoms = Symptoms.objects.filter(patient=patient)

        serializer = SymptomsSerializer(symptoms, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_observations(request, id_):
    if request.method == 'GET':
        patient = get_object_or_404(Patient, patientID=id_)
        observations = Observations.objects.filter(patient=patient)

        serializer = ObservationsSerializer(observations, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_care(request, id_):
    if request.method == 'GET':
        patient = get_object_or_404(Patient, patientID=id_)
        care = Care.objects.filter(patient=patient)

        serializer = CareSerializer(care, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_medications(request, id_):
    if request.method == 'GET':
        patient = get_object_or_404(Patient, patientID=id_)
        medications = Medication.objects.filter(patient=patient)

        serializer = MedicationSerializer(medications, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_assigned_patient_medication(request, id_):
    if request.method == 'GET':
        try:
            nurse = Nurse.objects.get(nurseID=id_)
            medications = Medication.objects.filter(patient__nurse=nurse)
            serializer = MedicationSerializer(medications, many=True)
        except Nurse.DoesNotExist:
            return Response({"message": "Nurse does not exist."}, status=404)
        except Exception as e:
            return Response({"message": "An error occurred", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_last_medication_administration(request, id_):
    if request.method == 'GET':
        try:
            # Get the last medication administration for each patient and medicine associated with the nurse
            last_administrations = Care.objects.filter(patient__nurse__nurseID=id_, task__in=Medication.objects.values('medication')).values('patient', 'task').annotate(last_administration=Max('dateTimeCompleted'))

            # Fetch Care objects for the last medication administrations
            last_administration_objects = Care.objects.filter(dateTimeCompleted__in=[obj['last_administration'] for obj in last_administrations])

            serializer = CareSerializer(last_administration_objects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_all_medication_administration(request, id_):
    if request.method == 'GET':
        try:
            administrations = Care.objects.filter(patient=id_, task__in=Medication.objects.values('medication'))

            serializer = CareSerializer(administrations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def administer_medication(request, id_):
    if request.method == 'POST':
        try:
            nurse = get_object_or_404(Nurse, nurseID=id_)
            patient = get_object_or_404(Patient, patientID=request.data.get('patientID'))

            care_record = Care.objects.create(
                patient=patient,
                dateTimeCompleted=timezone.now(),
                task=request.data.get('task'),
                nurse=nurse
            )
        except IntegrityError as e:
            return Response({"message": "Failed to record medicine administration", "error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"message": "An error occurred", "error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "Success"}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def log_patient_record_viewing(request, id_):
    if request.method == 'POST':
        try:
            nurse = get_object_or_404(Nurse, nurseID=id_)
            patient = get_object_or_404(Patient, patientID=request.data.get('patientID'))

            log_record = LogViewing.objects.create(
                nurse=nurse,
                patient=patient,
                dateTime=timezone.now()
            )
        except IntegrityError as e:
            print(e)
            return Response({"message": "Failed to record log", "error": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred", "error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "Success"}, status=status.HTTP_201_CREATED)
