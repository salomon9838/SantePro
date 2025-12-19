# MonProjet/urls.py (celui qui est à la racine de votre projet)

from django.contrib import admin
from django.urls import path, include 

urlpatterns = [
    # 1. Chemin d'administration de Django
    path('admin/', admin.site.urls),
    
    # 2. Lien vers les URLs de l'application 'dossier_patient'
    # Toutes les URLs définies dans dossier_patient/urls.py seront préfixées par 'dossier/'
    path('', include('security.urls')),
    
    
]