from rest_framework import serializers
from .models import Board

BOARD_MAP = {
    'id': 'BOARD_ID',
    'title': 'BOARD_TITLE',
    'content': 'BOARD_CONTENT',
    'registerId': 'REGISTER_ID',
    'registerDate': 'REGISTER_DATE',
}

class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = "__all__"