from django.urls import path

from .views import (
    ApiLoginView, ApiLogoutView, ApiMeView, ApiOtpRequestView, ApiOtpVerifyView, HealthView,
    GameStartView, GameSubmitView, GameScoreView, LeaderboardView
)

urlpatterns = [
    path('', HealthView.as_view(), name='health'),
    path('api/login', ApiLoginView.as_view(), name='api_login'),
    path('api/otp/request', ApiOtpRequestView.as_view(), name='api_otp_request'),
    path('api/otp/verify', ApiOtpVerifyView.as_view(), name='api_otp_verify'),
    path('api/me', ApiMeView.as_view(), name='api_me'),
    path('api/logout', ApiLogoutView.as_view(), name='api_logout'),
    
    # Game APIs
    path('api/game/start', GameStartView.as_view(), name='game_start'),
    path('api/game/submit', GameSubmitView.as_view(), name='game_submit'),
    path('api/game/score', GameScoreView.as_view(), name='game_score'),
    path('api/leaderboard', LeaderboardView.as_view(), name='leaderboard'),
]
