import { FirebaseAuthRepository } from '../../auth/infrastructure/FirebaseAuthRepository.js';
import { FirebaseAdminRepository } from '../infrastructure/FirebaseAdminRepository.js';
import { LoginUseCase } from '../../auth/domain/use_cases/LoginUseCase.js';
import { CheckAdminRoleUseCase } from '../../auth/domain/use_cases/CheckAdminRoleUseCase.js';

const authRepo = new FirebaseAuthRepository();
const adminRepo = new FirebaseAdminRepository();
const loginUseCase = new LoginUseCase(authRepo);
const checkAdminRoleUseCase = new CheckAdminRoleUseCase(authRepo, adminRepo);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorMessage.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 1. Realiza o login básico
            const loginResult = await loginUseCase.execute(email, password);

            if (loginResult.success) {
                // 2. Verifica se tem papel de administrador
                const isAdmin = await checkAdminRoleUseCase.execute(loginResult.user.uid);

                if (isAdmin) {
                    window.location.href = 'AdminDashboard.html';
                } else {
                    await authRepo.logout(); // Desloga se não for admin
                    errorMessage.textContent = "Acesso negado: Você não tem permissão de administrador.";
                    errorMessage.style.display = 'block';
                }
            } else {
                errorMessage.textContent = "Erro de login: " + loginResult.message;
                errorMessage.style.display = 'block';
            }
        });
    }
});



