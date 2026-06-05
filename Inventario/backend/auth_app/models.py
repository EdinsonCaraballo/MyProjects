"""
auth_app/models.py
Modelos que reflejan las tablas personalizadas del sistema de inventario.
Usamos managed=False para NO alterar las tablas ya creadas por los scripts SQL.
"""
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


class Company(models.Model):
    nombre_comercial = models.CharField(max_length=200, blank=True, null=True)
    name_razon_social = models.CharField(max_length=200)
    fk_estatus = models.ForeignKey(Estatus, on_delete=models.SET_NULL, null=True, db_column='fk_estatus')

    class Meta:
        managed = False
        db_table = 'company'


class Perfil(models.Model):
    nombre_perfil = models.CharField(max_length=100)
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
    # Use db_column to map to the actual column name (fk_estatus, not fk_estatus_id)
    fk_estatus = models.IntegerField(db_column='fk_estatus', null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    usuario_registro = models.CharField(max_length=100, blank=True, null=True)
    usuario_modificacion = models.CharField(max_length=100, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'

    def __str__(self):
        return self.correo
