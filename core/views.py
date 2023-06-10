from django.shortcuts import render
from .models import Products, Compra,DetalleCompra
from django.http import HttpResponseNotAllowed
from django.http import HttpResponse
import json
from django.contrib.auth.decorators import login_required
#para usarse desde signin
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.shortcuts import render, redirect
import sweetify
#para usarse desde signup
from django.db import IntegrityError
from django.contrib.auth.models import User
#Para usarse desde el dashboard
from django.template.loader import render_to_string
#Para la compra
import datetime
from django.http import JsonResponse


def home(request):
    # Obtener todos los registros de Products    
    products = Products.objects.all()
    # Pasar los registros a la plantilla index.html como contexto
    return render(request, 'index.html', {'products': products})
    



def cart(request):
    if request.user.is_authenticated:
            # Si el usuario ya ha iniciado sesión, redirige a otra página
            return redirect('dashboard')      
    tmpl = render_to_string('base.html',context=None, request=request) 
    return render(request, 'cart.html', {'tmpl': tmpl})
    


@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

  
def get_products(request): 
    if request.method == "GET":
        products = Products.objects.all()
        response_data = json.dumps(list(products.values()))
        return HttpResponse(response_data, content_type='application/json')
    else: 
        return HttpResponseNotAllowed(['GET'])

def signin(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            # Si el usuario ya ha iniciado sesión, redirige a otra página
            return redirect('dashboard')       
        return render(request, 'login.html', {"form": AuthenticationForm})
    else:
        user = authenticate(
            request, username=request.POST['username'], password=request.POST['password'])
        if user is None:
            sweetify.error(request, 'Usuario y/o Password incorrectas')
            return render(request, 'login.html', {"form": AuthenticationForm})
        login(request, user)
        sweetify.success(request, '¡Login Exitoso!')
        return redirect('dashboard')


def signup(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            # Si el usuario ya ha iniciado sesión, redirige a otra página
            return redirect('dashboard')
        return render(request, 'register.html', {"form": UserCreationForm})
    else:
        if request.POST["password1"] == request.POST["password2"]:
            try:
                user = User.objects.create_user(
                    request.POST["username"], password=request.POST["password1"])
                user.save()
                #login(request, user) 
                sweetify.success(request,  "¡Registro exitoso!")
                return redirect('login')
            except IntegrityError:
                sweetify.error(request,  "Usuario ya existe")
                return render(request, 'register.html', {"form": UserCreationForm} )
        sweetify.error(request,  "Las contraseñas no coinciden")
        return render(request, 'register.html', {"form": UserCreationForm})

@login_required
def signout(request):
    print('logged out')
    logout(request) 
    return redirect('/')



def compra_y_detalle(request):
    if request.method == 'POST':
        nueva_compra =  json.loads(request.body.decode('utf-8'))
        try:
            funcion_compra_y_detalle()
            for producto in nueva_compra:
                detalles_compra(producto['sku'], producto['cantidad'])
            return JsonResponse({"message": "La compra ha sido exitosa"})
        except Exception as e:
           print(e)



def funcion_compra_y_detalle():
    try:
        try:
            nueva_compra = Compra.objects.latest('detallepago_id').detallepago_id
        except Compra.DoesNotExist:
            nueva_compra = 0
        max_id = nueva_compra + 1 if nueva_compra!=0 else 1
        today = datetime.date.today() 
        nuevo_detalle = Compra(fecha=today, detallepago_id=max_id)
        nuevo_detalle.save()
        
        print("La compra y el detalle han sido guardados exitosamente")
    except Exception as e:
        print("Ocurrió un error al guardar la compra y el detalle:", e)


def detalles_compra(producto_sku, cantidad):
    try:
        nueva_compra = Compra.objects.latest('id').id
        nuevo_detalle = DetalleCompra(producto_sku=Products.objects.get(sku = producto_sku), cantidad_compra=cantidad, compra_id=nueva_compra)
        nuevo_detalle.save()
        producto_encontrado = Products.objects.get(sku=producto_sku)
        producto_encontrado.stock -= cantidad
        producto_encontrado.save()
    except Exception as e:
        print(e)
