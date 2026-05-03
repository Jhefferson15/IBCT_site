import { FirebaseAuthRepository } from '../infrastructure/FirebaseAuthRepository.js';
import { LoginUseCase } from '../domain/use_cases/LoginUseCase.js';
import { LoginWithGoogleUseCase } from '../domain/use_cases/LoginWithGoogleUseCase.js';

const authRepo = new FirebaseAuthRepository();
const loginUseCase = new LoginUseCase(authRepo);
const loginWithGoogleUseCase = new LoginWithGoogleUseCase(authRepo);

// Função de callback para o login com Google (exposta para o objeto window)
window.handleGoogleLogin = async (response) => {
    console.log("Login com Google bem-sucedido. Processando credencial...");
    const result = await loginWithGoogleUseCase.execute(response.credential);

    if (result.success) {
        window.location.href = 'membros.html';
    } else {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = "Falha no login com Google: " + result.message;
            errorMessage.style.display = 'block';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Guarda de rota: se já estiver logado, redireciona para a área de membros
    authRepo.onAuthStateChanged((user) => {
        if (user) {
            window.location.href = 'membros.html';
        }
    });

    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            // O Firebase Auth gerencia a persistência automaticamente com base nas configurações iniciais,
            // mas podemos expandir isso no futuro se necessário.

            const result = await loginUseCase.execute(email, password);

            if (result.success) {
                window.location.href = 'membros.html';
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.display = 'block';
            }
        });
    }
});



