from django import template

register = template.Library()

@register.filter(name='add_class')
def add_class(field, css):
    """
    Adiciona classes CSS a um campo de formulário.
    Uso no template: {{ field|add_class:"form-control" }}
    """
    return field.as_widget(attrs={"class": css})