from django.urls import path
from . import views

urlpatterns = [
    path('rooms/', views.RoomListView.as_view(), name='room-list'),
    path('rooms/create/', views.CreateRoomView.as_view(), name='room-create'),
    path('rooms/join/', views.JoinRoomView.as_view(), name='room-join'),
    path('rooms/<str:room_name>/messages/', views.RoomMessagesView.as_view(), name='room-messages'),
    path('rooms/<str:room_name>/send/', views.SendMessageView.as_view(), name='room-send'),
    path('rooms/<str:room_name>/history/', views.HistoryMessagesView.as_view(), name='room-history'),
    path('rooms/<str:room_name>/members/', views.RoomMembersView.as_view(), name='room-members'),
]
