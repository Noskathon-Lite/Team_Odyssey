from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Hazard

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'firstname', 'lastname', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('firstname', 'lastname')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'firstname', 'lastname', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

# Register the models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Hazard)