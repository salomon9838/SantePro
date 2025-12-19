from django.contrib import admin
from .models import (
    Patient,
    Utilisateur,
    Pathologie,
    Consultation,
    Prescription,
    RegistreMaladie
)

admin.site.register(Patient)
admin.site.register(Utilisateur)
admin.site.register(Pathologie)
admin.site.register(Consultation)
admin.site.register(Prescription)
admin.site.register(RegistreMaladie)
