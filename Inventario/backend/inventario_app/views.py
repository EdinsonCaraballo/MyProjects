from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import (
    Estatus, TypeDocument, TipoComercio, Company, Sucursal,
    Perfil, Usuario, Modulos, Categorias, CatalogoProductos, Productos, Monedas, LotesInventario
)
from .serializers import (
    EstatusSerializer, TypeDocumentSerializer, TipoComercioSerializer, CompanySerializer,
    SucursalSerializer, PerfilSerializer, UsuarioSerializer, ModulosSerializer,
    CategoriasSerializer, CatalogoProductosSerializer, ProductosSerializer,
    MonedasSerializer, LotesInventarioSerializer
)


class EstatusViewSet(viewsets.ModelViewSet):
    queryset = Estatus.objects.all().order_by('id')
    serializer_class = EstatusSerializer
    permission_classes = [IsAuthenticated]


class TypeDocumentViewSet(viewsets.ModelViewSet):
    queryset = TypeDocument.objects.all().order_by('id')
    serializer_class = TypeDocumentSerializer
    permission_classes = [IsAuthenticated]


class TipoComercioViewSet(viewsets.ModelViewSet):
    queryset = TipoComercio.objects.all().order_by('id')
    serializer_class = TipoComercioSerializer
    permission_classes = [IsAuthenticated]


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by('id')
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


class SucursalViewSet(viewsets.ModelViewSet):
    queryset = Sucursal.objects.all().order_by('id')
    serializer_class = SucursalSerializer
    permission_classes = [IsAuthenticated]


class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all().order_by('id')
    serializer_class = PerfilSerializer
    permission_classes = [IsAuthenticated]


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().order_by('id')
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]


class ModulosViewSet(viewsets.ModelViewSet):
    queryset = Modulos.objects.all().order_by('id')
    serializer_class = ModulosSerializer
    permission_classes = [IsAuthenticated]


class CategoriasViewSet(viewsets.ModelViewSet):
    queryset = Categorias.objects.all().order_by('id')
    serializer_class = CategoriasSerializer
    permission_classes = [IsAuthenticated]


class CatalogoProductosViewSet(viewsets.ModelViewSet):
    queryset = CatalogoProductos.objects.all().order_by('id')
    serializer_class = CatalogoProductosSerializer
    permission_classes = [IsAuthenticated]


class ProductosViewSet(viewsets.ModelViewSet):
    queryset = Productos.objects.all().order_by('id')
    serializer_class = ProductosSerializer
    permission_classes = [IsAuthenticated]


class MonedasViewSet(viewsets.ModelViewSet):
    queryset = Monedas.objects.all().order_by('id')
    serializer_class = MonedasSerializer
    permission_classes = [IsAuthenticated]


class LotesInventarioViewSet(viewsets.ModelViewSet):
    queryset = LotesInventario.objects.all().order_by('id')
    serializer_class = LotesInventarioSerializer
    permission_classes = [IsAuthenticated]
