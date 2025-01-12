from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Hazard

class CustomUserAdmin(UserAdmin):
    # Specify the fields to display in the admin panel
    list_display = ('email', 'firstname', 'lastname', 'is_active', 'is_staff')
    search_fields = ('email', 'firstname', 'lastname')
    ordering = ('email',)

    # Specify the fields to edit when adding or changing users
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('firstname', 'lastname')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'firstname', 'lastname'),
        }),
    )

# Register the models
admin.site.register(User, CustomUserAdmin)
admin.site.register(Hazard)
