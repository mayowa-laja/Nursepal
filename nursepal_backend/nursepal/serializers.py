from rest_framework import serializers
from .models import *

class NurseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nurse
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    recent_admission = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = ['patientID', 'name', 'age', 'dateOfBirth', 'address', 'sex', 'bloodType', 'nurse', 'recent_admission']

    def get_recent_admission(self, obj):
        recent_admission = Admission.objects.filter(patient=obj).order_by('-admissionDateTime').first()
        if recent_admission:
            return {
                'admissionDateTime': recent_admission.admissionDateTime,
                'dischargeDateTime': recent_admission.dischargeDateTime
            }
        else:
            return None


class AdmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admission
        fields = '__all__'


class VitalsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vitals
        fields = '__all__'


class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'


class CareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Care
        fields = '__all__'


class SymptomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptoms
        fields = '__all__'


class TreatmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatments
        fields = '__all__'


class ObservationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observations
        fields = '__all__'


class AllergiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergies
        fields = '__all__'


class LogViewingSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogViewing
        fields = '__all__'


class CarePlanChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarePlanChecklistItem
        fields = '__all__'