from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from django.http import JsonResponse
from rest_framework.response import Response

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
    serializer = PatientSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
