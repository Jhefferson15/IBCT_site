// --- ARQUIVO: js/login-script.js (Atualizado para Promises) ---

// Função de callback para o login com Google
async function handleGoogleLogin(response) {
    console.log("Iniciando login com Google...");
    const rememberMe = document.getElementById('remember-me').checked;

    // A função de backend agora retorna uma Promise
    const result = await IBCT_Backend.loginWithGoogle(response, rememberMe);

    if (result.success) {
        window.location.href = 'membros.html';
    } else {
        // Exibe a mensagem de erro, caso exista uma
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = result.message || "Falha no login com Google.";
        errorMessage.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    // --- Guarda de Rota Assíncrona ---
    // Verifica a sessão e redireciona se o usuário já estiver logado.
    // A função checkSession agora usa um callback.
    IBCT_Backend.checkSession(user => {
        if (user) {
            console.log("Usuário já logado. Redirecionando...");
            window.location.href = 'membros.html';
        }
    });

    // --- Manipulador de Formulário Assíncrono ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = ''; // Limpa mensagens de erro antigas
        errorMessage.style.display = 'none';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        // Chama a função de login e aguarda a resolução da Promise
        const result = await IBCT_Backend.login(email, password, rememberMe);

        if (result.success) {
            window.location.href = 'membros.html';
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
        }
    });

    // --- Lógica para o botão de Login com Google ---
    // O Google Identity Services (GIS) carrega de forma assíncrona.
    // A função handleGoogleLogin será chamada automaticamente pelo script do Google.
    // Não é necessário adicionar um event listener manual para o botão do Google.
});