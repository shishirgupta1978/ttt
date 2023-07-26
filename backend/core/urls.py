from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from account.views import send_enquiry_email,MyTokenObtainPairView,MyTokenRefreshView,update_profile,index,catch_all


urlpatterns = [
    path("", index, name="front"),
    path('admin/', admin.site.urls),
    path("api/send_enquery/", send_enquiry_email, name="send-enquiry"),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/auth/user-update/', update_profile ,name='user_update'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/alt-text-generator/', include('alt_text_generator.urls')),
    path('<path:unknown_path>/', catch_all, name='catch_all'),
]

urlpatterns +=  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Admin"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Welcome to the Admin Portal"

