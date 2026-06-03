from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Para futuras rutas de la API de Django REST Framework
    # path('api/', include('inventario_app.urls')),
]
