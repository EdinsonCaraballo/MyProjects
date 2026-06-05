from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EstatusViewSet, TypeDocumentViewSet, TipoComercioViewSet, CompanyViewSet,
    SucursalViewSet, PerfilViewSet, UsuarioViewSet, ModulosViewSet,
    CategoriasViewSet, CatalogoProductosViewSet, ProductosViewSet,
    MonedasViewSet, LotesInventarioViewSet
)

router = DefaultRouter()
router.register(r'estatus', EstatusViewSet, basename='estatus')
router.register(r'type-document', TypeDocumentViewSet, basename='type-document')
router.register(r'tipo-comercio', TipoComercioViewSet, basename='tipo-comercio')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'sucursales', SucursalViewSet, basename='sucursal')
router.register(r'perfiles', PerfilViewSet, basename='perfil')
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'modulos', ModulosViewSet, basename='modulo')
router.register(r'categorias', CategoriasViewSet, basename='categoria')
router.register(r'catalogo-productos', CatalogoProductosViewSet, basename='catalogo-producto')
router.register(r'productos', ProductosViewSet, basename='producto')
router.register(r'monedas', MonedasViewSet, basename='moneda')
router.register(r'lotes', LotesInventarioViewSet, basename='lote')

urlpatterns = [
    path('', include(router.urls)),
]
