from django.urls import path
from .views import user_login, user_logout, get_patients, admit_patient


urlpatterns = [
    path('api/login', user_login, name='user_login'),
    path('api/logout', user_logout, name='user_logout'),
    path('api/patients/<int:nurse_id>', get_patients, name='get_patients'),
    path('api/admit/<int:nurse_id>', admit_patient, name='admit_patient'),
]
