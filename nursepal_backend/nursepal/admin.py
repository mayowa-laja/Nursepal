from django.contrib import admin
from .models import *
from .forms import AssignChecklistItemForm

# Register your models here.


admin.site.register(Patient)
admin.site.register(Nurse)
admin.site.register(Admission)
admin.site.register(Vitals)
admin.site.register(Medication)
admin.site.register(Care)
admin.site.register(Symptoms)
admin.site.register(Treatments)
admin.site.register(Observations)
admin.site.register(Allergies)
admin.site.register(LogViewing)
admin.site.register(CarePlanChecklistItem)
admin.site.register(PredefinedChecklistItem)
