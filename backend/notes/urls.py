from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import NoteViewSet, RegisterView

router = DefaultRouter()
router.register("notes", NoteViewSet, basename="note")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("", include(router.urls)),
]
