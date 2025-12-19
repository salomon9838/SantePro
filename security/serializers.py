from rest_framework import serializers
from .models import (
    Patient, Utilisateur, Consultation,
    Pathologie, Prescription, RegistreMaladie
)

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'


class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'


class PathologieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pathologie
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'


class RegistreMaladieSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistreMaladie
        fields = '__all__'
