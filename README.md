# Documentação da API - Biblioteca RESTful

## Visão Geral

Bem-vindo à documentação da API da Biblioteca. Esta API RESTful permite gerenciar os recursos de uma biblioteca, como livros, autores e editoras. A comunicação é feita através do protocolo HTTP, e os dados são trocados no formato JSON.

## Tecnologias
- Node.js
- Python (Django Rest Framework)

## Instalação

Abra uma pasta no terminal e coloque:

```bash
git clone https://github.com/SamuelHenrique007/Biblioteca-API-RESTful.git
cd Biblioteca-API-RESTful
```
### Instalação do Venv em /API
- Linux/Mac
```bash
cd /api
python -m venv venv
source venv/bin/activate
```
> Obs.: Mude para `python3` caso essa for sua versão.

- Windows
```bash
cd api
python -m venv venv
```
Depois:

```bash
venv\Scripts\activate
```
> Obs.: Caso o `venv` não ativar adicione `Set-ExcecutionPolicy Remotesigned CurrentUser` antes.

Após instalar o `venv`, faça:

```bash
pip install -r requirements.txt
```

Depois, retorne à pasta `Biblioteca-API-RESTful` com `cd ..` .

## Uso

Abra dois terminais:

- Terminal 1(Django-RestFrameWork):

```bash
cd api
```

1. Configurar o Banco de Dados (Migrate):
```bash
python manage.py migrate
```

2. Criar um `SuperUser`:

```bash
python manage.py createsuperuser
```
Preencha o que lhe for solicitado.

3. Finalmente, inicie o projeto com:
```bash
python manage.py runserver
```

- Terminal 2(Node.js)

```bash
cd /client
```

1. Garanta que sua máquina tenha `Node.js`, caso não tenha veja a [documentação Node.js](https://nodejs.org/pt/download).

Instale as dependências (necessário ter o Node.js instalado):

```bash
npm install
```

2. Inicie o servidor:

```bash
node server.js
``` 

## Licença
MIT
