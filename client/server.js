// server.js – servidor Node + proxy para API Django com JWT
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Django base (SEM /api aqui)
const DJANGO_BASE = 'http://127.0.0.1:8000';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper para pegar header Authorization do cliente
function buildAuthHeaders(req, isJson = false) {
    const headers = {};
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    const auth = req.headers['authorization'];
    if (auth) {
        headers['Authorization'] = auth;
    }
    return headers;
}

//
// ============= AUTH JWT =============
//

// Login: repassa para /api/token/ do Django
app.post('/api/token/', async (req, res) => {
    try {
        const r = await axios.post(`${DJANGO_BASE}/api/token/`, req.body, {
            headers: { 'Content-Type': 'application/json' },
        });
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 400)
            .json(err.response?.data || { detail: 'Erro ao obter token' });
    }
});

// Opcional: refresh de token
app.post('/api/token/refresh/', async (req, res) => {
    try {
        const r = await axios.post(`${DJANGO_BASE}/api/token/refresh/`, req.body, {
            headers: { 'Content-Type': 'application/json' },
        });
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 400)
            .json(err.response?.data || { detail: 'Erro ao renovar token' });
    }
});

//
// ============= LIVROS =============
//

// LISTAR
app.get('/api/livros/', async (req, res) => {
    try {
        const r = await axios.get(`${DJANGO_BASE}/api/livros/`, {
            headers: buildAuthHeaders(req),
        });
        res.json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || { detail: 'Erro ao buscar livros' });
    }
});

// DETALHAR
app.get('/api/livros/:id/', async (req, res) => {
    try {
        const r = await axios.get(`${DJANGO_BASE}/api/livros/${req.params.id}/`, {
            headers: buildAuthHeaders(req),
        });
        res.json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || { detail: 'Erro ao buscar livro' });
    }
});

// CRIAR
app.post('/api/livros/', async (req, res) => {
    try {
        const r = await axios.post(`${DJANGO_BASE}/api/livros/`, req.body, {
            headers: buildAuthHeaders(req, true),
        });
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

// ATUALIZAR
app.put('/api/livros/:id/', async (req, res) => {
    try {
        const r = await axios.put(
            `${DJANGO_BASE}/api/livros/${req.params.id}/`,
            req.body,
            { headers: buildAuthHeaders(req, true) },
        );
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

// EXCLUIR
app.delete('/api/livros/:id/', async (req, res) => {
    try {
        const r = await axios.delete(`${DJANGO_BASE}/api/livros/${req.params.id}/`, {
            headers: buildAuthHeaders(req),
        });
        res.status(r.status).json(r.data || {});
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

//
// ============= AUTORES =============
//

app.get('/api/autores/', async (req, res) => {
    try {
        const r = await axios.get(`${DJANGO_BASE}/api/autores/`, {
            headers: buildAuthHeaders(req),
        });
        res.json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || { detail: 'Erro ao buscar autores' });
    }
});

app.get('/api/autores/:id/', async (req, res) => {
    try {
        const r = await axios.get(`${DJANGO_BASE}/api/autores/${req.params.id}/`, {
            headers: buildAuthHeaders(req),
        });
        res.json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || { detail: 'Erro ao buscar autor' });
    }
});

app.post('/api/autores/', async (req, res) => {
    try {
        const r = await axios.post(`${DJANGO_BASE}/api/autores/`, req.body, {
            headers: buildAuthHeaders(req, true),
        });
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

app.put('/api/autores/:id/', async (req, res) => {
    try {
        const r = await axios.put(
            `${DJANGO_BASE}/api/autores/${req.params.id}/`,
            req.body,
            { headers: buildAuthHeaders(req, true) },
        );
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

app.delete('/api/autores/:id/', async (req, res) => {
    try {
        const r = await axios.delete(`${DJANGO_BASE}/api/autores/${req.params.id}/`, {
            headers: buildAuthHeaders(req),
        });
        res.status(r.status).json(r.data || {});
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

//
// ============= EDITORAS =============
app.get('/api/editoras/', async (req, res) => {
    try {
        const r = await axios.get(`${DJANGO_BASE}/api/editoras/`, {
            headers: buildAuthHeaders(req),
        });
        res.json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || { detail: 'Erro ao buscar editoras' });
    }
});

app.get('/api/editoras/:id/', async (req, res) => {
    try {
        const r = await axios.get(`${DJANGO_BASE}/api/editoras/${req.params.id}/`, {
            headers: buildAuthHeaders(req),
        });
        res.json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res
            .status(err.response?.status || 500)
            .json(err.response?.data || { detail: 'Erro ao buscar editora' });
    }
});

app.post('/api/editoras/', async (req, res) => {
    try {
        const r = await axios.post(`${DJANGO_BASE}/api/editoras/`, req.body, {
            headers: buildAuthHeaders(req, true),
        });
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

app.put('/api/editoras/:id/', async (req, res) => {
    try {
        const r = await axios.put(
            `${DJANGO_BASE}/api/editoras/${req.params.id}/`,
            req.body,
            { headers: buildAuthHeaders(req, true) },
        );
        res.status(r.status).json(r.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

app.delete('/api/editoras/:id/', async (req, res) => {
    try {
        const r = await axios.delete(`${DJANGO_BASE}/api/editoras/${req.params.id}/`, {
            headers: buildAuthHeaders(req),
        });
        res.status(r.status).json(r.data || {});
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(err.response?.status || 400).json(err.response?.data || {});
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Frontend rodando em http://localhost:${PORT}`);
});
