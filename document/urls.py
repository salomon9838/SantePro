from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

# security/urls.py (dans votre dossier d'application)
from django.urls import path
from . import views



# document/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # On inclut les routes de l'application
    path('api/', include('security.urls')), 
    
    # OPTIONNEL : Rediriger la racine vers la page solution
     path('', include('security.urls')), 
]