from django.core.mail import send_mail

from django.shortcuts import render
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.settings import DEFAULT_FROM_EMAIL
from .serializers import MyTokenObtainPairSerializer,MyTokenRefreshSerializer
from rest_framework_simplejwt.views import TokenViewBase,TokenRefreshView
from .models import Enquiry,User
from django.contrib.auth import get_user_model
from rest_framework import status

#User = get_user_model()




def index(request):
    return render(request,"index.html",{})



def catch_all(request, unknown_path):
    # Render the index page or any other page you want
    return render(request, 'index.html') 

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def send_enquiry_email(request):
    data = request.data 

    try:
        subject = data["subject"]
        name = data["name"]
        email = data["email"]
        message = data["message"]
        from_email = data["email"]
        recipient_list = [DEFAULT_FROM_EMAIL]

        send_mail(subject, message, from_email, recipient_list, fail_silently=True)

        enquiry = Enquiry(name=name, email=email, subject=subject, message=message)
        enquiry.save()

        return Response({"success": "Your Enquiry was successfully submitted"})

    except:
        return Response({"fail": "Enquiry was not sent. Please try again"})



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    data = {}
    try:
        user=User.objects.get(pkid=request.user.pk)
        user.first_name=request.data.get("first_name")
        user.last_name=request.data.get("last_name")
        user.profile_pic=request.FILES.get("profile_pic")
        user.documents=request.FILES.get("documents")
        user.save()

        return Response({"success": "Your Profile updated successfully"},status=status.HTTP_200_OK)

    except Exception as e:
        print("eeroor:"+str(e))

        return Response({"error": "Profile not updated. Please try again"},status=status.HTTP_400_BAD_REQUEST)




class MyTokenObtainPairView(TokenViewBase):
    serializer_class = MyTokenObtainPairSerializer

class MyTokenRefreshView(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer