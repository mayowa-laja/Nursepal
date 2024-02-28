from django.urls import path
from .views import *


urlpatterns = [
    path('api/login', user_login, name='user_login'),
    path('api/logout', user_logout, name='user_logout'),
    path('api/patients/<int:nurse_id>', get_patients, name='get_patients'),
    path('api/admit/<int:nurse_id>', admit_patient, name='admit_patient'),
    path('api/checklist/<int:patient_id>', checklist, name='checklist'),
    path('api/vitals/<int:id_>', vitals, name="vitals"),
    path('api/nurse_input/<int:id_>', nurse_input, name="nurse_input"),
]
