from django.http import HttpResponse
from django.core.exceptions import ValidationError

import json
import datetime
from django.utils import timezone
from django.conf import settings
from django.shortcuts import render,redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from django.contrib import messages
from account.models import User
from django.contrib.auth.decorators import login_required
from .serializers import FigureSerializer, DocumentSerializer, CreateDocumentSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from alt_text_generator.alt_text_prediction import figure_predictions
from .models import Figure,Document



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_upload_document(request):
    data={}

    data["source"]= request.FILES['source']
    data["type"]=request.POST.get('type')
    data["created_by"]=request.user.pk
    serializer = CreateDocumentSerializer(data=data)
    try:
        serializer.is_valid(raise_exception=True)
    except ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    document=serializer.save()
    try:
        print("Processing...")
        fig_list = figure_predictions(str(settings.MEDIA_ROOT)+serializer.data['source'].replace("/media/","/"))
        print("Processing Done...")
        for figure in fig_list:
            print(figure[0])
            print(figure[1])
            Figure.objects.create(number=figure[0],alt_text1=figure[1],alt_text2=figure[2],document=document)
        serializer1=DocumentSerializer(document)
        return Response(serializer1.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print("Error in Processing")
        print(e)
        return Response({"error": "An error occurred during processing."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        


@api_view(['POST'])
def save_data(request):
    print("testing..")
    objects = request.data  # Assuming the request contains a list of objects
    
    for obj in objects:

        fig=Figure.objects.get(id=obj['id'])
        fig.alt_text1=obj['alt_text1']
        fig.alt_text2=obj['alt_text2']

        fig.save()

    json_string = json.dumps(objects, indent=4)

    # Set the appropriate content type for the response
    return Response(json_string, status=status.HTTP_200_OK)
 