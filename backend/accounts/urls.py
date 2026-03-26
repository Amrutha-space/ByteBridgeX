from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, ProfileView, RegisterView

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", ProfileView.as_view(), name="profile"),
]
