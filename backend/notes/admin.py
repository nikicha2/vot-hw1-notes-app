from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'text', 'date_created', 'date_edited']
    list_filter = ['date_created', 'date_edited']
    search_fields = ['text', 'user__username']

