// client.js
// Aplicação em OUTRA linguagem (JavaScript/Node.js)
// que consome a API REST feita em Django.

const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:8000/api';

async function listarAutores() {
    const resp = await axios.get(`${BASE_URL}/autores/`);
    console.log('\n=== AUTORES ===');
    resp.data.forEach(a => {
        console.log(`ID: ${a.id} | Nome: ${a.nome}`);
    });
    return resp.data;
}

async function listarEditoras() {
    const resp = await axios.get(`${BASE_URL}/editoras/`);
    console.log('\n=== EDITORAS ===');
    resp.data.forEach(e => {
        console.log(`ID: ${e.id} | Nome: ${e.nome}`);
    });
    return resp.data;
}

async function listarLivros() {
    const resp = await axios.get(`${BASE_URL}/livros/`);
    console.log('\n=== LIVROS ===');
    resp.data.forEach(l => {
        console.log(`ID: ${l.id} | Título: ${l.titulo}`);
    });
    return resp.data;
}

// Cria um livro usando o primeiro autor e primeira editora encontrados
async function criarLivroExemplo(autores, editoras) {
    if (!autores.length) {
        console.log('\n⚠ Nenhum autor cadastrado. Cadastre autores na aplicação Django primeiro.');
        return null;
    }

    const autorId = autores[0].id;
    const editoraId = editoras.length ? editoras[0].id : null;

    const novoLivro = {
        titulo: 'Livro criado via Node.js',
        ano_publicacao: 2025,
        autor_id: autorId,
        editora_id: editoraId
    };

    const resp = await axios.post(`${BASE_URL}/livros/`, novoLivro);
    console.log('\n✅ Livro criado com sucesso pela aplicação Node.js:');
    console.log(resp.data);

    return resp.data;
}

async function detalharLivro(id) {
    const resp = await axios.get(`${BASE_URL}/livros/${id}/`);
    const l = resp.data;

    console.log('\n=== DETALHES DO LIVRO ===');
    console.log(`ID: ${l.id}`);
    console.log(`Título: ${l.titulo}`);
    console.log(`Ano: ${l.ano_publicacao}`);
    console.log(`Autor: ${l.autor ? l.autor.nome : '-'}`);
    console.log(`Editora: ${l.editora ? l.editora.nome : '-'}`);
}

// Função principal
async function main() {
    try {
        // 1) Lista dados existentes
        const autores = await listarAutores();
        const editoras = await listarEditoras();
        const livrosAntes = await listarLivros();

        // 2) Cria um livro novo pela API
        const livroCriado = await criarLivroExemplo(autores, editoras);
        if (!livroCriado) return;

        // 3) Lista de novo para ver o novo livro
        await listarLivros();

        // 4) Mostra detalhes do livro novo
        await detalharLivro(livroCriado.id);

    } catch (error) {
        console.error('\n❌ Erro ao consumir a API:', error.message);
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
        }
    }
}

main();
