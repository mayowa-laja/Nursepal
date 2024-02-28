from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Nurse(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nurseID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.TextField()


class Patient(models.Model):
    patientID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    dateOfBirth = models.DateField()
    address = models.TextField()
    sex = models.CharField(max_length=10)
    bloodType = models.CharField(max_length=5)
    nurse = models.ForeignKey(Nurse, on_delete=models.SET_NULL, null=True)


class Admission(models.Model):
    admissionID = models.AutoField(primary_key=True)
    admissionReason = models.TextField()
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE)
    admissionDateTime = models.DateTimeField()
    dischargeDateTime = models.DateTimeField(null=True)
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('patient', 'admissionDateTime')


class Vitals(models.Model):
    vitalID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dateTime = models.DateTimeField()
    temperature = models.DecimalField(max_digits=5, decimal_places=2)
    heartRate = models.IntegerField()
    systolicBloodPressure = models.IntegerField()
    diastolicBloodPressure = models.IntegerField()
    respiratoryRate = models.IntegerField()
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('patient', 'dateTime')


class Medication(models.Model):
    medicationID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    startDate = models.DateField()
    endDate = models.DateField()
    quantity = models.IntegerField()
    frequency = models.CharField(max_length=255)
    medication = models.CharField(max_length=255)
    prescriber = models.CharField(max_length=255)

    class Meta:
        unique_together = ('patient', 'startDate')


class Care(models.Model):
    careID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    task = models.CharField(max_length=255)
    dateTimeCompleted = models.DateTimeField()
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('patient', 'dateTimeCompleted')


class Symptoms(models.Model):
    symptomID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dateTime = models.DateTimeField()
    symptomDescripton = models.CharField(max_length=255)
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('patient', 'dateTime')


class Treatments(models.Model):
    treatmentID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dateTime = models.DateTimeField()
    treatment = models.CharField(max_length=255)

    class Meta:
        unique_together = ('patient', 'dateTime')


class Observations(models.Model):
    observationID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dateTime = models.DateTimeField()
    observationDescription = models.CharField(max_length=255)
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('patient', 'dateTime')


class Allergies(models.Model):
    allergyID = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    allergyDescription = models.CharField(max_length=255)

    class Meta:
        unique_together = ('patient', 'allergyDescription')


class LogViewing(models.Model):
    logViewingID = models.AutoField(primary_key=True)
    nurse = models.ForeignKey(Nurse, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    dateTime = models.DateTimeField()

    class Meta:
        unique_together = ('nurse', 'dateTime')


class CarePlanChecklistItem(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    checked = models.BooleanField(default=False)


class PredefinedChecklistItem(models.Model):
    name = models.CharField(max_length=255)
    group = models.CharField(max_length=255)

