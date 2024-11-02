
from django.contrib import admin
from django.urls import path
from extractor_app.views import upload_file
urlpatterns = [
    path('admin/', admin.site.urls),
        path('api/upload/', upload_file, name='upload'),  
]
