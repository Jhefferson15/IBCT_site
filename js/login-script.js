

// Função de callback para o login com Google
function handleGoogleLogin(response) {
    console.log("Login com Google bem-sucedido. Recebido o token.");
    const userObject = JSON.parse(atob(response.credential.split('.')[1]));
    const rememberMe = document.getElementById('remember-me').checked;

    const result = IBCT_Backend.loginWithGoogle(userObject, rememberMe);

    if (result.success) {
        window.location.href = 'membros.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Guarda de rota: se já estiver logado, redireciona para a área de membros
    if (IBCT_Backend.checkSession()) {
        window.location.href = 'membros.html';
        return; // Impede a execução do resto do script
    }

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none'; // Esconde mensagens de erro antigas

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        const result = IBCT_Backend.login(email, password, rememberMe);

        if (result.success) {
            window.location.href = 'membros.html';
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
        }
    });
});