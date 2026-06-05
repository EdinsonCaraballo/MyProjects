from django.db import models

class Estatus(models.Model):
    fk_estatus = models.CharField(max_length=50, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    usuario_registro = models.CharField(max_length=100, blank=True, null=True)
    usuario_modificacion = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estatus'

    def __str__(self):
        return self.fk_estatus or str(self.id)


class TypeDocument(models.Model):
    type_document = models.CharField(max_length=100)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'type_document'


class TipoComercio(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, null=True)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'tipo_comercio'


class Company(models.Model):
    fk_type_document = models.ForeignKey(TypeDocument, on_delete=models.SET_NULL, null=True, db_column='fk_type_document')
    logo = models.TextField(blank=True, null=True)
    rif_cedula = models.CharField(max_length=50, blank=True, null=True)
    logo_url = models.TextField(blank=True, null=True)
    direccion_fiscal = models.TextField(blank=True, null=True)
    nombre_comercial = models.CharField(max_length=200, blank=True, null=True)
    name_razon_social = models.CharField(max_length=200)
    tipo_comercio = models.ForeignKey(TipoComercio, on_delete=models.SET_NULL, null=True, db_column='tipo_comercio')
    sitio_web = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=500, blank=True, null=True)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'company'


class Sucursal(models.Model):
    fk_company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, db_column='fk_company')
    nombre_sucursal = models.CharField(max_length=200)
    codigo_sucursal = models.CharField(max_length=50, unique=True, blank=True, null=True)
    ind_principal = models.BooleanField(default=False)
    ind_delivery = models.BooleanField(default=False)
    location = models.TextField(blank=True, null=True)
    horario_apertura = models.TimeField(blank=True, null=True)
    horario_cierre = models.TimeField(blank=True, null=True)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'sucursal'


class Perfil(models.Model):
    nombre_perfil = models.CharField(max_length=100)
    fk_sucursal = models.ForeignKey(Sucursal, on_delete=models.SET_NULL, null=True, db_column='fk_sucursal')
    fk_compania = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, db_column='fk_compania')
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'perfil'


class Usuario(models.Model):
    numero_documento = models.CharField(max_length=50, blank=True, null=True)
    tipo_documento = models.CharField(max_length=50, blank=True, null=True)
    nombre = models.CharField(max_length=150)
    correo = models.CharField(max_length=255, unique=True)
    telefono = models.CharField(max_length=30, blank=True, null=True)
    password_hash = models.CharField(max_length=255)
    fk_estatus = models.IntegerField(db_column='fk_estatus', null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    usuario_registro = models.CharField(max_length=100, blank=True, null=True)
    usuario_modificacion = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'


class Modulos(models.Model):
    nombre_modulo = models.CharField(max_length=100)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'modulos'


class Categorias(models.Model):
    nombre = models.CharField(max_length=150)
    fk_categoria = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, db_column='fk_categoria')
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'categorias'


class CatalogoProductos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    fk_categoria = models.ForeignKey(Categorias, on_delete=models.SET_NULL, null=True, db_column='fk_categoria')
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'catalogo_productos'


class Productos(models.Model):
    codigo_barras = models.CharField(max_length=100, unique=True, blank=True, null=True)
    codigo_inventario = models.CharField(max_length=100, unique=True, blank=True, null=True) # SKU
    fk_catalogo_productos = models.ForeignKey(CatalogoProductos, on_delete=models.SET_NULL, null=True, db_column='fk_catalogo_productos')
    vence = models.BooleanField(default=False)
    stock_minimo = models.DecimalField(max_digits=15, decimal_places=4, default=0.0)
    stock_maximo = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')
    fk_compania = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, db_column='fk_compania')

    class Meta:
        managed = False
        db_table = 'productos'


class Monedas(models.Model):
    codigo_iso = models.CharField(max_length=10, unique=True)
    nombre = models.CharField(max_length=100)
    simbolo = models.CharField(max_length=10, blank=True, null=True)
    es_base = models.BooleanField(default=False)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'monedas'


class LotesInventario(models.Model):
    fk_sucursal = models.ForeignKey(Sucursal, on_delete=models.SET_NULL, null=True, db_column='fk_sucursal')
    fk_productos = models.ForeignKey(Productos, on_delete=models.SET_NULL, null=True, db_column='fk_productos')
    numero_lote = models.CharField(max_length=100, blank=True, null=True)
    cantidad_inicial = models.DecimalField(max_digits=15, decimal_places=4, default=0.0)
    cantidad_actual = models.DecimalField(max_digits=15, decimal_places=4, default=0.0)
    fk_moneda = models.ForeignKey(Monedas, on_delete=models.SET_NULL, null=True, db_column='fk_moneda')
    precio_compra = models.DecimalField(max_digits=15, decimal_places=4, blank=True, null=True)
    fecha_produccion = models.DateField(blank=True, null=True)
    fecha_vencimiento = models.DateField(blank=True, null=True)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')
    fk_compania = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, db_column='fk_compania')

    class Meta:
        managed = False
        db_table = 'lotes_inventario'
