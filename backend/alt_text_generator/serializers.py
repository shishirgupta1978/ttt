from .models import Figure,Document
from rest_framework import serializers
from django.contrib.auth import get_user_model
from account.serializers import UserSerializer



User = get_user_model()

class FigureSerializer(serializers.ModelSerializer):
    document_name=serializers.SerializerMethodField()
    class Meta:
        model = Figure
        fields = ["id",  "alt_text1","alt_text2", "is_alt_text1_selected", "number", "document","document_name"]
    
    def get_document_name(self,obj):
        return obj.document.name


class DocumentSerializer(serializers.ModelSerializer):
    figures = FigureSerializer(many=True)
    created_by=UserSerializer()
    date_created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = Document
        fields = ["id", "source","name", "created_by","date_created","figures"]


class CreateDocumentSerializer(serializers.ModelSerializer):
    #created_by=UserSerializer()
    #date_created = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    class Meta:
        model = Document
        fields = ["id", "source","name", "created_by","date_created"]


