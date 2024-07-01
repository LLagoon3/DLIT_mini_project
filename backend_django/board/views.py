from django.shortcuts import render
from django.http import JsonResponse, Http404
from rest_framework.viewsets import ViewSet
from rest_framework import status

from .models import Board
from .serializers import BOARD_MAP, BoardSerializer

# Create your views here.
class BoardViewSet(ViewSet):
    
    def list(self, request):
        all_objects, objects_list = Board.objects.all(), list()
        for idx, object in enumerate(all_objects):
            serializer_data = BoardSerializer(object).data
            converted_data = dict()
            for key, val in serializer_data.items():
                converted_data[BOARD_MAP[key]] = val
            objects_list.append(converted_data)
        
        return JsonResponse(objects_list, safe = False)
    
    def create(self, request):
        serializer = BoardSerializer(data = request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'data': serializer.data}, status=status.HTTP_201_CREATED)
        print("Error : ", serializer.errors)
        return JsonResponse({'data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        
    def retrieve(self, request, pk=None):
        print(request.data, pk)
        try:
            pk_kwargs = {'id' : pk}
            instance = Board.objects.get(**pk_kwargs)
        except Board.DoesNotExist:
            raise Http404("Object does not exist")
        print(BoardSerializer(instance).data)
        response_data = [dict()]
        for key, val in BoardSerializer(instance).data.items():
            response_data[0][BOARD_MAP[key]] = val
        return JsonResponse(response_data, safe = False)

    def update(self, request, pk=None):
        try:
            pk_kwargs = {'id' : pk}
            instance = Board.objects.get(**pk_kwargs)
        except Board.DoesNotExist:
            raise Http404("Object does not exist")
        serializer = BoardSerializer(instance, request.data)
        if serializer.is_valid():
            print(BoardSerializer(instance).data)
            serializer.save()
            response_data = [dict()]
            for key, val in BoardSerializer(instance).data.items():
                response_data[0][BOARD_MAP[key]] = val
            return JsonResponse(response_data, safe = False)
        else:
            print(serializer.errors)
            return JsonResponse({'data': serializer.errors})

    def destroy(self, request, pk=None):
        try:    
            pk_kwargs = {'id' : pk}
            instance = Board.objects.get(**pk_kwargs)
        except Board.DoesNotExist:
            raise Http404("Object does not exist")
        print(BoardSerializer(instance).data)
        instance.delete()
        response_data = [dict()]
        for key, val in BoardSerializer(instance).data.items():
            response_data[0][BOARD_MAP[key]] = val
        return JsonResponse(response_data, safe = False)