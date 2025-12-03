
const BASE_URL = '/api';

// IDs em edição
let editingLivroId = null;
let editingAutorId = null;
let editingEditoraId = null;

// contexto de exclusão (para o modal de confirmação)
let deleteContext = { tipo: null, id: null };
let confirmDeleteModalInstance = null;

function getToken() {
    return localStorage.getItem('accessToken');
}

function authHeaders(isJson = false) {
    const token = getToken();
    const h = {};
    if (isJson) h['Content-Type'] = 'application/json';
    if (token) h['Authorization'] = 'Bearer ' + token;
    return h;
}

function showAlert(containerId, message, type = 'success') {
    const div = document.getElementById(containerId);
    if (!div) return;
    div.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function showGlobalAlert(message, type = 'info') {
    showAlert('alert-global', message, type);
}


function handle401(resp) {
    if (resp.status === 401) {
        showGlobalAlert('Sessão expirada ou não autorizada. Faça login novamente.', 'danger');
        localStorage.removeItem('accessToken');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
        return true;
    }
    return false;
}

// logout
function fazerLogout() {
    localStorage.removeItem('accessToken');
    showGlobalAlert('Você saiu do sistema.', 'info');
    setTimeout(() => {
        window.location.href = '/login.html';
    }, 500);
}


// modal de exclusão

function abrirConfirmacaoExclusao(tipo, id) {
    deleteContext = { tipo, id };

    let nomeTipo;
    if (tipo === 'livro') nomeTipo = 'este livro';
    else if (tipo === 'autor') nomeTipo = 'este autor';
    else nomeTipo = 'esta editora';

    document.getElementById('confirmDeleteText').textContent =
        `Tem certeza que deseja excluir ${nomeTipo}?`;

    const modalEl = document.getElementById('confirmDeleteModal');
    confirmDeleteModalInstance = new bootstrap.Modal(modalEl);
    confirmDeleteModalInstance.show();
}

async function confirmarExclusao() {
    if (!deleteContext.tipo || !deleteContext.id) return;

    if (deleteContext.tipo === 'livro') {
        await excluirLivro(deleteContext.id);
    } else if (deleteContext.tipo === 'autor') {
        await excluirAutor(deleteContext.id);
    } else if (deleteContext.tipo === 'editora') {
        await excluirEditora(deleteContext.id);
    }

    deleteContext = { tipo: null, id: null };
    if (confirmDeleteModalInstance) {
        confirmDeleteModalInstance.hide();
    }
}


// livros

async function carregarLivros() {
    const tbody = document.getElementById('tbody-livros');
    tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center text-muted">
                Carregando...
            </td>
        </tr>
    `;

    try {
        const resp = await fetch(BASE_URL + '/livros/', {
            headers: authHeaders()
        });

        if (handle401(resp)) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        Não autorizado. Redirecionando para login...
                    </td>
                </tr>
            `;
            return;
        }

        if (!resp.ok) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        Erro ao carregar livros.
                    </td>
                </tr>
            `;
            return;
        }

        const data = await resp.json();

        if (!data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-muted">
                        Nenhum livro cadastrado.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = '';
        data.forEach(livro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${livro.titulo}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-info text-white" onclick="detalharLivro(${livro.id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="prepararEdicaoLivro(${livro.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="abrirConfirmacaoExclusao('livro', ${livro.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-danger">
                    Erro ao conectar com a API.
                </td>
            </tr>
        `;
    }
}

async function detalharLivro(id) {
    try {
        const resp = await fetch(`${BASE_URL}/livros/${id}/`, {
            headers: authHeaders()
        });

        if (handle401(resp)) return;
        if (!resp.ok) {
            showAlert('alert-livros', 'Erro ao buscar detalhes do livro.', 'danger');
            return;
        }

        const l = await resp.json();

        const modalTitle = document.getElementById('detailModalLabel');
        const modalBody = document.getElementById('detailModalBody');

        modalTitle.textContent = 'Detalhes do Livro';
        modalBody.innerHTML = `
            <dl class="row mb-0">
                <dt class="col-4">Título</dt>
                <dd class="col-8">${l.titulo}</dd>

                <dt class="col-4">Autor</dt>
                <dd class="col-8">${l.autor ? l.autor.nome : '-'}</dd>

                <dt class="col-4">Editora</dt>
                <dd class="col-8">${l.editora ? l.editora.nome : '-'}</dd>

                <dt class="col-4">Ano</dt>
                <dd class="col-8">${l.ano_publicacao}</dd>
            </dl>
        `;

        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();

    } catch (err) {
        console.error(err);
        alert('Erro ao carregar detalhes do livro.');
    }
}

async function prepararEdicaoLivro(id) {
    try {
        const resp = await fetch(`${BASE_URL}/livros/${id}/`, {
            headers: authHeaders()
        });

        if (handle401(resp)) return;
        if (!resp.ok) {
            showAlert('alert-livros', 'Erro ao buscar dados do livro.', 'danger');
            return;
        }

        const l = await resp.json();

        editingLivroId = id;
        document.getElementById('livro-titulo').value = l.titulo;
        document.getElementById('livro-ano').value = l.ano_publicacao;
        document.getElementById('livro-autor').value = l.autor && l.autor.id ? l.autor.id : '';
        document.getElementById('livro-editora').value = l.editora && l.editora.id ? l.editora.id : '';

        document.getElementById('btn-livro-texto').textContent = 'Atualizar Livro';

        showAlert('alert-livros', 'Editando livro. Altere os campos e clique em Atualizar.', 'info');
    } catch (err) {
        console.error(err);
        showAlert('alert-livros', 'Erro ao carregar dados do livro.', 'danger');
    }
}

async function excluirLivro(id) {
    try {
        const resp = await fetch(`${BASE_URL}/livros/${id}/`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (handle401(resp)) return;

        if (!resp.ok) {
            showAlert('alert-livros', 'Erro ao excluir livro.', 'danger');
            return;
        }

        showAlert('alert-livros', 'Livro excluído com sucesso!', 'success');
        carregarLivros();

    } catch (err) {
        console.error(err);
        showAlert('alert-livros', 'Erro ao conectar com a API.', 'danger');
    }
}

async function criarLivro(event) {
    event.preventDefault();

    const titulo = document.getElementById('livro-titulo').value.trim();
    const ano = document.getElementById('livro-ano').value;
    const autorId = document.getElementById('livro-autor').value;
    const editoraId = document.getElementById('livro-editora').value || null;

    if (!titulo || !ano || !autorId) {
        showAlert('alert-livros', 'Preencha título, ano e autor.', 'warning');
        return;
    }

    const payload = {
        titulo: titulo,
        ano_publicacao: parseInt(ano),
        autor_id: parseInt(autorId),
        editora_id: editoraId ? parseInt(editoraId) : null
    };

    const url = editingLivroId
        ? `${BASE_URL}/livros/${editingLivroId}/`
        : `${BASE_URL}/livros/`;

    const method = editingLivroId ? 'PUT' : 'POST';

    try {
        const resp = await fetch(url, {
            method,
            headers: authHeaders(true),
            body: JSON.stringify(payload)
        });

        if (handle401(resp)) return;

        if (!resp.ok) {
            const erro = await resp.json().catch(() => ({}));
            console.error('Erro salvar livro', erro);
            showAlert('alert-livros', 'Erro ao salvar livro.', 'danger');
            return;
        }

        showAlert(
            'alert-livros',
            editingLivroId ? 'Livro atualizado com sucesso!' : 'Livro criado com sucesso!',
            'success'
        );

        document.getElementById('form-livro').reset();
        editingLivroId = null;
        document.getElementById('btn-livro-texto').textContent = 'Salvar Livro';

        await carregarLivros();

    } catch (err) {
        console.error(err);
        showAlert('alert-livros', 'Erro ao conectar com a API.', 'danger');
    }
}


// autores

async function carregarAutores(atualizarSelects = false) {
    const tbody = document.getElementById('tbody-autores');
    tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center text-muted">
                Carregando...
            </td>
        </tr>
    `;

    try {
        const resp = await fetch(BASE_URL + '/autores/', {
            headers: authHeaders()
        });

        if (handle401(resp)) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        Não autorizado. Redirecionando...
                    </td>
                </tr>
            `;
            return;
        }

        if (!resp.ok) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        Erro ao carregar autores.
                    </td>
                </tr>
            `;
            return;
        }

        const data = await resp.json();

        if (!data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-muted">
                        Nenhum autor cadastrado.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = '';
            data.forEach(autor => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${autor.nome}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info text-white" onclick="detalharAutor(${autor.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="prepararEdicaoAutor(${autor.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="abrirConfirmacaoExclusao('autor', ${autor.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        if (atualizarSelects) {
            const selectAutor = document.getElementById('livro-autor');
            selectAutor.innerHTML = '<option value="">Selecione um autor</option>';
            data.forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = a.nome;
                selectAutor.appendChild(opt);
            });
        }

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-danger">
                    Erro ao conectar com a API.
                </td>
            </tr>
        `;
    }
}

async function detalharAutor(id) {
    try {
        const resp = await fetch(`${BASE_URL}/autores/${id}/`, {
            headers: authHeaders()
        });

        if (handle401(resp)) return;
        if (!resp.ok) {
            showAlert('alert-autores', 'Erro ao buscar detalhes do autor.', 'danger');
            return;
        }

        const a = await resp.json();

        const modalTitle = document.getElementById('detailModalLabel');
        const modalBody = document.getElementById('detailModalBody');

        modalTitle.textContent = 'Detalhes do Autor';
        modalBody.innerHTML = `
            <dl class="row mb-0">
                <dt class="col-4">Nome</dt>
                <dd class="col-8">${a.nome}</dd>

                <dt class="col-4">Email</dt>
                <dd class="col-8">${a.email || '-'}</dd>
            </dl>
        `;

        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();

    } catch (err) {
        console.error(err);
        alert('Erro ao carregar detalhes do autor.');
    }
}

async function prepararEdicaoAutor(id) {
    try {
        const resp = await fetch(`${BASE_URL}/autores/${id}/`, {
            headers: authHeaders()
        });

        if (handle401(resp)) return;
        if (!resp.ok) {
            showAlert('alert-autores', 'Erro ao buscar dados do autor.', 'danger');
            return;
        }

        const a = await resp.json();

        editingAutorId = id;
        document.getElementById('autor-nome').value = a.nome;
        document.getElementById('autor-email').value = a.email || '';

        document.getElementById('btn-autor-texto').textContent = 'Atualizar Autor';

        showAlert('alert-autores', 'Editando autor. Altere os campos e clique em Atualizar.', 'info');
    } catch (err) {
        console.error(err);
        showAlert('alert-autores', 'Erro ao carregar dados do autor.', 'danger');
    }
}

async function excluirAutor(id) {
    try {
        const resp = await fetch(`${BASE_URL}/autores/${id}/`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (handle401(resp)) return;

        if (!resp.ok) {
            showAlert('alert-autores', 'Erro ao excluir autor.', 'danger');
            return;
        }
        showAlert('alert-autores', 'Autor excluído com sucesso!', 'success');
        carregarAutores(true);

    } catch (err) {
        console.error(err);
        showAlert('alert-autores', 'Erro ao conectar com a API.', 'danger');
    }
}

async function criarAutor(event) {
    event.preventDefault();

    const nome = document.getElementById('autor-nome').value.trim();
    const email = document.getElementById('autor-email').value.trim();

    if (!nome) {
        showAlert('alert-autores', 'O nome do autor é obrigatório.', 'warning');
        return;
    }

    const payload = { nome, email: email || null };

    const url = editingAutorId
        ? `${BASE_URL}/autores/${editingAutorId}/`
        : `${BASE_URL}/autores/`;

    const method = editingAutorId ? 'PUT' : 'POST';

    try {
        const resp = await fetch(url, {
            method,
            headers: authHeaders(true),
            body: JSON.stringify(payload)
        });

        if (handle401(resp)) return;

        if (!resp.ok) {
            const erro = await resp.json().catch(() => ({}));
            console.error('Erro salvar autor', erro);
            showAlert('alert-autores', 'Erro ao salvar autor.', 'danger');
            return;
        }

        showAlert(
            'alert-autores',
            editingAutorId ? 'Autor atualizado com sucesso!' : 'Autor criado com sucesso!',
            'success'
        );

        document.getElementById('form-autor').reset();
        editingAutorId = null;
        document.getElementById('btn-autor-texto').textContent = 'Salvar Autor';

        await carregarAutores(true);

    } catch (err) {
        console.error(err);
        showAlert('alert-autores', 'Erro ao conectar com a API.', 'danger');
    }
}


// editoras

async function carregarEditoras(atualizarSelects = false) {
    const tbody = document.getElementById('tbody-editoras');
    tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center text-muted">
                Carregando...
            </td>
        </tr>
    `;

    try {
        const resp = await fetch(BASE_URL + '/editoras/', {
            headers: authHeaders()
        });

        if (handle401(resp)) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        Não autorizado. Redirecionando...
                    </td>
                </tr>
            `;
            return;
        }

        if (!resp.ok) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-danger">
                        Erro ao carregar editoras.
                    </td>
                </tr>
            `;
            return;
        }

        const data = await resp.json();

        if (!data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center text-muted">
                        Nenhuma editora cadastrada.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = '';
            data.forEach(editora => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${editora.nome}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-info text-white" onclick="detalharEditora(${editora.id})">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="prepararEdicaoEditora(${editora.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="abrirConfirmacaoExclusao('editora', ${editora.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        if (atualizarSelects) {
            const selectEditora = document.getElementById('livro-editora');
            selectEditora.innerHTML = '<option value="">Nenhuma</option>';
            data.forEach(e => {
                const opt = document.createElement('option');
                opt.value = e.id;
                opt.textContent = e.nome;
                selectEditora.appendChild(opt);
            });
        }

    } catch (err) {
        console.error(err);
        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-danger">
                    Erro ao conectar com a API.
                </td>
            </tr>
        `;
    }
}

async function detalharEditora(id) {
    try {
        const resp = await fetch(`${BASE_URL}/editoras/${id}/`, {
            headers: authHeaders()
        });

        if (handle401(resp)) return;
        if (!resp.ok) {
            showAlert('alert-editoras', 'Erro ao buscar detalhes da editora.', 'danger');
            return;
        }

        const e = await resp.json();

        const modalTitle = document.getElementById('detailModalLabel');
        const modalBody = document.getElementById('detailModalBody');

        modalTitle.textContent = 'Detalhes da Editora';
        modalBody.innerHTML = `
            <dl class="row mb-0">
                <dt class="col-4">Nome</dt>
                <dd class="col-8">${e.nome}</dd>

                <dt class="col-4">Cidade</dt>
                <dd class="col-8">${e.cidade || '-'}</dd>
            </dl>
        `;

        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();

    } catch (err) {
        console.error(err);
        alert('Erro ao carregar detalhes da editora.');
    }
}

async function prepararEdicaoEditora(id) {
    try {
        const resp = await fetch(`${BASE_URL}/editoras/${id}/`, {
            headers: authHeaders()
        });

        if (handle401(resp)) return;
        if (!resp.ok) {
            showAlert('alert-editoras', 'Erro ao buscar dados da editora.', 'danger');
            return;
        }

        const e = await resp.json();

        editingEditoraId = id;
        document.getElementById('editora-nome').value = e.nome;
        document.getElementById('editora-cidade').value = e.cidade || '';

        document.getElementById('btn-editora-texto').textContent = 'Atualizar Editora';

        showAlert('alert-editoras', 'Editando editora. Altere os campos e clique em Atualizar.', 'info');
    } catch (err) {
        console.error(err);
        showAlert('alert-editoras', 'Erro ao carregar dados da editora.', 'danger');
    }
}

async function excluirEditora(id) {
    try {
        const resp = await fetch(`${BASE_URL}/editoras/${id}/`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (handle401(resp)) return;

        if (!resp.ok) {
            showAlert('alert-editoras', 'Erro ao excluir editora.', 'danger');
            return;
        }
        showAlert('alert-editoras', 'Editora excluída com sucesso!', 'success');
        carregarEditoras(true);

    } catch (err) {
        console.error(err);
        showAlert('alert-editoras', 'Erro ao conectar com a API.', 'danger');
    }
}

async function criarEditora(event) {
    event.preventDefault();

    const nome = document.getElementById('editora-nome').value.trim();
    const cidade = document.getElementById('editora-cidade').value.trim();

    if (!nome) {
        showAlert('alert-editoras', 'O nome da editora é obrigatório.', 'warning');
        return;
    }

    const payload = { nome, cidade: cidade || null };

    const url = editingEditoraId
        ? `${BASE_URL}/editoras/${editingEditoraId}/`
        : `${BASE_URL}/editoras/`;

    const method = editingEditoraId ? 'PUT' : 'POST';

    try {
        const resp = await fetch(url, {
            method,
            headers: authHeaders(true),
            body: JSON.stringify(payload)
        });

        if (handle401(resp)) return;

        if (!resp.ok) {
            const erro = await resp.json().catch(() => ({}));
            console.error('Erro salvar editora', erro);
            showAlert('alert-editoras', 'Erro ao salvar editora.', 'danger');
            return;
        }

        showAlert(
            'alert-editoras',
            editingEditoraId ? 'Editora atualizada com sucesso!' : 'Editora criada com sucesso!',
            'success'
        );

        document.getElementById('form-editora').reset();
        editingEditoraId = null;
        document.getElementById('btn-editora-texto').textContent = 'Salvar Editora';

        await carregarEditoras(true);

    } catch (err) {
        console.error(err);
        showAlert('alert-editoras', 'Erro ao conectar com a API.', 'danger');
    }
}


// inicialização

document.addEventListener('DOMContentLoaded', () => {

    if (!getToken()) {
        window.location.href = '/login.html';
        return;
    }

    // Carregar dados iniciais
    carregarLivros();
    carregarAutores(true);
    carregarEditoras(true);

    // Bind dos formulários
    document.getElementById('form-livro').addEventListener('submit', criarLivro);
    document.getElementById('form-autor').addEventListener('submit', criarAutor);
    document.getElementById('form-editora').addEventListener('submit', criarEditora);

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', fazerLogout);
    }

    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmarExclusao);
});


window.carregarLivros = carregarLivros;
window.carregarAutores = carregarAutores;
window.carregarEditoras = carregarEditoras;
window.detalharLivro = detalharLivro;
window.prepararEdicaoLivro = prepararEdicaoLivro;
window.abrirConfirmacaoExclusao = abrirConfirmacaoExclusao;
window.detalharAutor = detalharAutor;
window.prepararEdicaoAutor = prepararEdicaoAutor;
window.detalharEditora = detalharEditora;
window.prepararEdicaoEditora = prepararEdicaoEditora;
