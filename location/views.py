from django.shortcuts import render, redirect
from .forms import LocationForm
from .models import Location
from openlocationcode import openlocationcode as olc

def generate_plus_code(lat, lng):
    return olc.encode(lat, lng)

def add_location(request):
    if request.method == 'POST':
        form = LocationForm(request.POST)
        if form.is_valid():
            latitude = form.cleaned_data['latitude']
            longitude = form.cleaned_data['longitude']
            plus_code = generate_plus_code(latitude, longitude)

            # Save to the database
            Location.objects.create(latitude=latitude, longitude=longitude, plus_code=plus_code)
            return redirect('location:location_list')
        else:
            print(form.errors)
    else:
        form = LocationForm()

    return render(request, 'location/add_location.html', {'form': form})

def location_list(request):
    locations = Location.objects.all()
    return render(request, 'location/location_list.html', {'locations': locations})


