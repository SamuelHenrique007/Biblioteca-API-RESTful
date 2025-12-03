from rest_framework import serializers
from .models import Autor, Editora, Livro

class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        fields = ['id', 'nome', 'email']


class EditoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Editora
        fields = ['id', 'nome', 'cidade']


class LivroSerializer(serializers.ModelSerializer):
    autor = AutorSerializer(read_only=True)
    autor_id = serializers.PrimaryKeyRelatedField(
        queryset=Autor.objects.all(), source='autor', write_only=True
    )
    editora = EditoraSerializer(read_only=True)
    editora_id = serializers.PrimaryKeyRelatedField(
        queryset=Editora.objects.all(), source='editora', write_only=True, allow_null=True
    )

    class Meta:
        model = Livro
        fields = ['id', 'titulo', 'ano_publicacao', 'autor', 'autor_id', 'editora', 'editora_id']
