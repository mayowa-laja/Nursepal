# forms.py
from django import forms
from .models import CarePlanChecklistItem, PredefinedChecklistItem
import logging

logger = logging.getLogger(__name__)

class AssignChecklistItemForm(forms.ModelForm):
    group = forms.ModelChoiceField(
        queryset=PredefinedChecklistItem.objects.all(),
        label='Predefined Checklist Group'
    )

    class Meta:
        model = CarePlanChecklistItem
        fields = ['patient', 'group']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['group'].queryset = PredefinedChecklistItem.objects.values_list('group', flat=True).distinct()

    def save(self, commit=True):
        instance = super().save(commit=False)
        group = self.cleaned_data.get('group')
        logger.debug("Selected group: %s", group)
        predefined_items = PredefinedChecklistItem.objects.filter(group=group)
        logger.debug("Predefined items for group: %s", predefined_items)
        for item in predefined_items:
            CarePlanChecklistItem.objects.create(patient=instance.patient, predefined_item=item)
        return instance
