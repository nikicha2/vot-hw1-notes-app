from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_edited = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')

    class Meta:
        ordering = ['-date_edited']

    def __str__(self):
        return f"Note {self.id} by {self.user.username}"

