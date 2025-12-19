"""
URL configuration for document project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views


urlpatterns = [
    path('security/patients/', views.patients_api),
    path('security/consultations/', views.consultations_api),
    path('security/pathologies/', views.pathologies_api),
    path('security/prescriptions/', views.prescriptions_api),
    path('security/registre/', views.registre_maladies_api),
    
    
   
     path('', views.solution, name='solution'),
    path('nouvelle/', views.nouvelle_consultation, name='nouvelle'),
    path('ancienne/', views.ancienne_consultation, name='ancienne'),
    path('registre/', views.registre_medical, name='registre'),
    path('parametres/', views.parametres, name='parametres'),
]

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]

