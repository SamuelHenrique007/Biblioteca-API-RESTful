// auth.js — controla login e redirecionamento

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-login");

    if (form) {
        form.addEventListener("submit", login);
    }
});

async function login(event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const alertBox = document.getElementById("alert-login");

    if (!username || !password) {
        alertBox.innerHTML = `<div class="alert alert-warning">Preencha usuário e senha.</div>`;
        return;
    }

    try {
        const resp = await fetch("/api/token/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!resp.ok) {
            alertBox.innerHTML = `<div class="alert alert-danger">Usuário ou senha incorretos.</div>`;
            return;
        }

        const data = await resp.json();

        // Salvar token
        localStorage.setItem("accessToken", data.access);

        // Redirecionar
        window.location.href = "/index.html";

    } catch (error) {
        console.error(error);
        alertBox.innerHTML = `<div class="alert alert-danger">Erro ao conectar com o servidor.</div>`;
    }
}
