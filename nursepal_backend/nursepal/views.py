from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from django.http import JsonResponse
from rest_framework.response import Response
from django.db import IntegrityError

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
            return JsonResponse(data, status=200)
        else:
            return JsonResponse({'message': 'Login failed'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'message': 'User does not exists'}, status=401)
    except Exception as e:
        print(f"An error occurred: {e}")
        return JsonResponse({'message': e}, status=401)


@api_view(['POST'])
def user_logout(request):
    return JsonResponse({'message': 'Logout successful'})


@api_view(['GET'])
def get_patients(request, nurse_id):
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

        response_data = {
            'patient': serializer.data,
            'admissionReason': admission.admissionReason
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'GET'])
def checklist(request, patient_id):
    if request.method == 'POST':
        item_id = request.data.get('item_id')
        item = get_object_or_404(CarePlanChecklistItem, id=item_id)
        item.checked = not item.checked
        item.save()

        serializer = CarePlanChecklistItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'GET':
        patient = get_object_or_404(Patient, pk=patient_id)
        checklist_items = CarePlanChecklistItem.objects.filter(patient=patient)
        serializer = CarePlanChecklistItemSerializer(checklist_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
        patient_id = request.data.get("patientID")

        patient = get_object_or_404(Patient, pk=patient_id)

        try:
            if input_type == "symptom":
                symptom_record = Symptoms.objects.create(
                    patient=patient,
                    dateTime=timezone.now(),
                    symptomDescripton=description,
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

