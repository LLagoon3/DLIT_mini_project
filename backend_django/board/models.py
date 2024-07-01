from django.db import models
from django.utils import timezone

# Create your models here.
class Board(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.TextField()
    content = models.TextField()
    registerId = models.CharField(max_length=20, null = True)
    registerDate = models.DateTimeField(auto_now=True)