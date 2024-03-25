from django.urls import path
from .views import *


urlpatterns = [
    path('api/login', user_login, name='user_login'),
    path('api/logout', user_logout, name='user_logout'),
    path('api/patients', get_all_patients, name='get_all_patients'),
    path('api/patients/<int:nurse_id>', get_assigned_patients, name='get_assigned_patients'),
    path('api/admit/<int:nurse_id>', admit_patient, name='admit_patient'),
    path('api/admission/<int:patient_id>', get_recent_admission, name='get_recent_admission'),
    path('api/checklist/<int:patient_id>', checklist, name='checklist'),
    path('api/vitals/<int:id_>', vitals, name="vitals"),
    path('api/nurse_input/<int:id_>', nurse_input, name="nurse_input"),
    path('api/symptoms/<int:id_>', get_symptoms, name="get_symptoms"),
    path('api/observations/<int:id_>', get_observations, name="get_observations"),
    path('api/care/<int:id_>', get_care, name="get_care"),
    path('api/medications/<int:id_>', get_medications, name="get_medications"),
    path('api/assigned_patient_medications/<int:id_>', get_assigned_patient_medication, name="get_assigned_patient_medication"),
    path('api/last_med_admin/<int:id_>', get_last_medication_administration, name="get_last_medication_administration"),
    path('api/patient_med_admin/<int:id_>', get_all_medication_administration, name="get_all_medication_administration"),
    path('api/admin_med/<int:id_>', administer_medication, name="administer_medication"),
    path('api/log/<int:id_>', log_patient_record_viewing, name="log_patient_record_viewing"),
]
