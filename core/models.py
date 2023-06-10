# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Compra(models.Model):
    fecha = models.DateField(blank=True, null=True)
    detallepago_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'compra'


class DetalleCompra(models.Model):
    producto_sku = models.ForeignKey('Products', models.DO_NOTHING, db_column='producto_sku', blank=True, null=True)
    cantidad_compra = models.IntegerField(blank=True, null=True)
    compra = models.ForeignKey(Compra, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'detalle_compra'


class Galeria(models.Model):
    titulo = models.CharField(max_length=60)
    imagen = models.CharField(max_length=255)
    imagen_nombre = models.CharField(max_length=255)
    texto = models.TextField(blank=True, null=True)
    fecha = models.DateField(blank=True, null=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    autor = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'galeria'


class Products(models.Model):
    sku = models.AutoField(primary_key=True)
    nombre = models.TextField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.IntegerField(blank=True, null=True)
    descuento = models.IntegerField(blank=True, null=True)
    imagen = models.TextField(blank=True, null=True)
    stock = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'products'


""" class Users(models.Model):
    user = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    pass_field = models.CharField(db_column='pass', max_length=255, blank=True, null=True)  # Field renamed because it was a Python reserved word.

    class Meta:
        managed = False
        db_table = 'users' """
