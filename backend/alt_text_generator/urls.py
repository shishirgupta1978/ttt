from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from . import views

urlpatterns = [

    path('upload-document/', views.api_upload_document, name='api_upload_document'),
    path('save-data/', views.save_data, name='api_save_data'),
    path('get-documents/', views.get_documents, name='api_get_documents'),
    path('get-document/<int:id>/', views.get_document, name='api_get_document'),

]


