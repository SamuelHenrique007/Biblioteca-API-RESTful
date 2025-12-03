// server.js – servidor Node + proxy para API Django com JWT
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Django base (SEM /api aqui)
const DJANGO_BASE = 'http://127.0.0.1:8000';

app.listen(PORT, () => {
    console.log(`🚀 Frontend rodando em http://localhost:${PORT}`);
});
