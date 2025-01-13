from django.db import models

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    plus_code = models.CharField(max_length=20)  

    def __str__(self):
        return f"{self.latitude}, {self.longitude} - {self.plus_code}"
