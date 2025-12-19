from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.http import JsonResponse
from .models import ThemeConfig

def get_theme(request):
    theme = ThemeConfig.objects.first() # Récupère le thème actif
    data = {
        "primary_color": theme.primary_color,
        "secondary_color": theme.secondary_color,
    }
    return JsonResponse(data)

from .models import (
    Patient, Utilisateur, Consultation,
    Pathologie, Prescription, RegistreMaladie
)

from .serializers import (
    PatientSerializer, UtilisateurSerializer,
    ConsultationSerializer, PathologieSerializer,
    PrescriptionSerializer, RegistreMaladieSerializer
)

# =========================
# PATIENTS API
# =========================
@api_view(['GET', 'POST'])
def patients_api(request):
    if request.method == 'GET':
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# CONSULTATIONS API
# =========================
@api_view(['GET', 'POST'])
def consultations_api(request):
    if request.method == 'GET':
        consultations = Consultation.objects.all()
        serializer = ConsultationSerializer(consultations, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = ConsultationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# PATHOLOGIES API
# =========================
@api_view(['GET', 'POST'])
def pathologies_api(request):
    if request.method == 'GET':
        pathologies = Pathologie.objects.all()
        serializer = PathologieSerializer(pathologies, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PathologieSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# PRESCRIPTIONS API
# =========================
@api_view(['GET', 'POST'])
def prescriptions_api(request):
    if request.method == 'GET':
        prescriptions = Prescription.objects.all()
        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# REGISTRE MALADIES API
# =========================
@api_view(['GET'])
def registre_maladies_api(request):
    registre = RegistreMaladie.objects.all()
    serializer = RegistreMaladieSerializer(registre, many=True)
    return Response(serializer.data)


# =========================
# UTILISATEUR (CREATION)
# =========================
@api_view(['POST'])

    
def creer_utilisateur(request):
    User.objects.create_user(
        username="sam",
        password="sam9838*",
        email="salomonkoumedjina@gmail.com"
    )
    return Response({"message": "Utilisateur créé avec succès"})

# Create your views here.

def solution(request):
    return render(request, 'solution.html')

def nouvelle_consultation(request):
    return render(request, 'nouvelle_consultation.html')

def ancienne_consultation(request):
    return render(request, 'ancienne_consultation.html')

def registre_medical(request):
    return render(request, 'registre_medical.html')

def parametres(request):
    return render(request, 'parametres.html')
