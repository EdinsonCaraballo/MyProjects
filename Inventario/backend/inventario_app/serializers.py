import bcrypt
from rest_framework import serializers
from .models import (
    Estatus, TypeDocument, TipoComercio, Company, Sucursal,
    Perfil, Usuario, Modulos, Categorias, CatalogoProductos, Productos, Monedas, LotesInventario
)

class EstatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estatus
        fields = '__all__'


class TypeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeDocument
        fields = '__all__'


class TipoComercioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoComercio
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    type_document_name = serializers.CharField(source='fk_type_document.type_document', read_only=True)
    tipo_comercio_name = serializers.CharField(source='tipo_comercio.nombre', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = Company
        fields = '__all__'


class SucursalSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='fk_company.name_razon_social', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = Sucursal
        fields = '__all__'


class PerfilSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='fk_compania.name_razon_social', read_only=True)
    sucursal_name = serializers.CharField(source='fk_sucursal.nombre_sucursal', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = Perfil
        fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    status_name = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id', 'numero_documento', 'tipo_documento', 'nombre',
            'correo', 'telefono', 'password', 'fk_estatus', 'status_name',
            'fecha_registro', 'usuario_registro', 'usuario_modificacion', 'fecha_actualizacion'
        ]

    def get_status_name(self, obj):
        if obj.fk_estatus == 1:
            return 'Activo'
        elif obj.fk_estatus == 2:
            return 'Inactivo'
        return 'Desconocido'

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if password:
            salt = bcrypt.gensalt(10)
            validated_data['password_hash'] = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        else:
            # Fallback or default password
            salt = bcrypt.gensalt(10)
            validated_data['password_hash'] = bcrypt.hashpw('Cambiar123*'.encode('utf-8'), salt).decode('utf-8')
        
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            salt = bcrypt.gensalt(10)
            instance.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
        return super().update(instance, validated_data)


class ModulosSerializer(serializers.ModelSerializer):
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = Modulos
        fields = '__all__'


class CategoriasSerializer(serializers.ModelSerializer):
    parent_category_name = serializers.CharField(source='fk_categoria.nombre', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = Categorias
        fields = '__all__'


class CatalogoProductosSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='fk_categoria.nombre', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = CatalogoProductos
        fields = '__all__'


class ProductosSerializer(serializers.ModelSerializer):
    catalogo_nombre = serializers.CharField(source='fk_catalogo_productos.nombre', read_only=True)
    catalogo_descripcion = serializers.CharField(source='fk_catalogo_productos.descripcion', read_only=True)
    compania_nombre = serializers.CharField(source='fk_compania.name_razon_social', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = Productos
        fields = '__all__'


class MonedasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Monedas
        fields = '__all__'


class LotesInventarioSerializer(serializers.ModelSerializer):
    sucursal_nombre = serializers.CharField(source='fk_sucursal.nombre_sucursal', read_only=True)
    producto_sku = serializers.CharField(source='fk_productos.codigo_inventario', read_only=True)
    producto_nombre = serializers.CharField(source='fk_productos.fk_catalogo_productos.nombre', read_only=True)
    moneda_simbolo = serializers.CharField(source='fk_moneda.simbolo', read_only=True)
    status_name = serializers.CharField(source='fk_estatus.fk_estatus', read_only=True)

    class Meta:
        model = LotesInventario
        fields = '__all__'
