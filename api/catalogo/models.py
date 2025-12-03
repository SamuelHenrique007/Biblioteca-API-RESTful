from django.db import models

class Autor(models.Model):
    nome = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.nome


class Editora(models.Model):
    nome = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nome


class Livro(models.Model):
    titulo = models.CharField(max_length=200)
    autor = models.ForeignKey(Autor, on_delete=models.CASCADE, related_name='livros')
    editora = models.ForeignKey(Editora, on_delete=models.SET_NULL, null=True, blank=True)
    ano_publicacao = models.PositiveIntegerField()

    def __str__(self):
        return self.titulo
