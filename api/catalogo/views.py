from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView
from .models import Autor, Editora, Livro

#autor
class AutorListView(ListView):
    model = Autor
    template_name = 'catalogo/autor_list.html'

class AutorCreateView(CreateView):
    model = Autor
    fields = ['nome', 'email']
    template_name = 'catalogo/form.html'
    success_url = reverse_lazy('autor_list')

class AutorUpdateView(UpdateView):
    model = Autor
    fields = ['nome', 'email']
    template_name = 'catalogo/form.html'
    success_url = reverse_lazy('autor_list')

class AutorDeleteView(DeleteView):
    model = Autor
    template_name = 'catalogo/confirm_delete.html'
    success_url = reverse_lazy('autor_list')
    
class AutorDetailView(DetailView):
    model = Autor
    template_name = 'catalogo/autor_detail.html'

#editora
class EditoraListView(ListView):
    model = Editora
    template_name = 'catalogo/editora_list.html'

class EditoraCreateView(CreateView):
    model = Editora
    fields = ['nome', 'cidade']
    template_name = 'catalogo/form.html'
    success_url = reverse_lazy('editora_list')

class EditoraUpdateView(UpdateView):
    model = Editora
    fields = ['nome', 'cidade']
    template_name = 'catalogo/form.html'
    success_url = reverse_lazy('editora_list')

class EditoraDeleteView(DeleteView):
    model = Editora
    template_name = 'catalogo/confirm_delete.html'
    success_url = reverse_lazy('editora_list')

class EditoraDetailView(DetailView):
    model = Editora
    template_name = 'catalogo/editora_detail.html'

#livro
class LivroListView(ListView):
    model = Livro
    template_name = 'catalogo/livro_list.html'

class LivroCreateView(CreateView):
    model = Livro
    fields = ['titulo', 'autor', 'editora', 'ano_publicacao']
    template_name = 'catalogo/form.html'
    success_url = reverse_lazy('livro_list')

class LivroUpdateView(UpdateView):
    model = Livro
    fields = ['titulo', 'autor', 'editora', 'ano_publicacao']
    template_name = 'catalogo/form.html'
    success_url = reverse_lazy('livro_list')

class LivroDeleteView(DeleteView):
    model = Livro
    template_name = 'catalogo/confirm_delete.html'
    success_url = reverse_lazy('livro_list')

class LivroDetailView(DetailView):
    model = Livro
    template_name = 'catalogo/livro_detail.html'

