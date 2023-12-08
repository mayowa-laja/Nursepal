from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.http import JsonResponse
import json
from django.db import connection

# Create your views here.


@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(username=username)
        nurse = user.nurse
        print(nurse.nurseID)
        if user.check_password(password):
            return JsonResponse({'message': 'Login successful'}, status=200)
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
