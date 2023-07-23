from django.db import models
import uuid
from account.models import User


# Create your models here.
class Document(models.Model):
    
    source=models.FileField(upload_to ='uploads/')
    name=models.CharField(max_length=255)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE,related_name="created_by")
    date_created=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name +" created by " +self.created_by.username +" at "+ str(self.date_created)
    

class Figure(models.Model):
    number=models.CharField(max_length=255,default='',null=True,blank=True)
    alt_text1=models.TextField(default='',null=True,blank=True)
    alt_text2=models.TextField(default='',null=True,blank=True)
    is_alt_text1_selected=models.BooleanField(default=True)
    document=models.ForeignKey(Document,on_delete=models.CASCADE,related_name="figures")
    def __str__(self):
        return self.number
