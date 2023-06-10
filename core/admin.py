from django.contrib import admin
from .models import Products, Compra,DetalleCompra  
# Register your models here.
admin.site.register(Products)
admin.site.register(Compra)
admin.site.register(DetalleCompra)