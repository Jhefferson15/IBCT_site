import { FirebaseAuthRepository } from '../../auth/infrastructure/FirebaseAuthRepository.js';
import { FirebaseMemberRepository } from '../infrastructure/FirebaseMemberRepository.js';
import { GetMemberDataUseCase } from '../domain/use_cases/GetMemberDataUseCase.js';
import { LogoutUseCase } from '../../auth/domain/use_cases/LogoutUseCase.js';

const authRepo = new FirebaseAuthRepository();
const memberRepo = new FirebaseMemberRepository();
const getMemberDataUseCase = new GetMemberDataUseCase(memberRepo);
const logoutUseCase = new LogoutUseCase(authRepo);

document.addEventListener('DOMContentLoaded', () => {
    // Guarda de Rota e Inicialização
    authRepo.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const { profile, notices } = await getMemberDataUseCase.execute(user.uid);
        if (!profile) {
            console.error("Não foi possível carregar o perfil do usuário.");
        }

        renderHeader(profile);
        populatePage(profile, notices);
    });

    function renderHeader(profile) {
        const header = document.querySelector('.header');
        if (!header) return;

        const firstName = profile ? profile.name.split(' ')[0] : "Membro";

        header.innerHTML = `
            <div class="container">
                <a href="index.html" class="logo-link">
                    <div class="logo">
                        <img src="img/logo.png" alt="Logo IBCT" class="header-logo-img">
                        <span>Membros</span>
                    </div>
                </a>
                <nav class="nav-links">
                    <a href="index.html">Início</a>
                    <a href="missoes.html">Missões</a>
                    <a href="ibct_tv.html">IBCT TV</a>
                    <a href="sobre_ibct.html">Sobre</a>
                </nav>
                <div id="user-session-container">
                    <span class="welcome-link">Olá, ${firstName}</span>
                    <a id="logout-button" class="logout-button">Sair</a>
                </div>
            </div>`;
        
        document.getElementById('logout-button').addEventListener('click', async () => {
            await logoutUseCase.execute();
            window.location.href = 'index.html';
        });
    }

    function populatePage(profile, notices) {
        if (profile) {
            document.getElementById('welcome-message').textContent = `Bem-vindo(a) de volta, ${profile.name}!`;
            
            const perfilContainer = document.getElementById('perfil-container');
            perfilContainer.innerHTML = `
                <div class="perfil-item">
                    <strong>Nome Completo</strong>
                    <span>${profile.name}</span>
                </div>
                <div class="perfil-item">
                    <strong>Ministérios</strong>
                    <span>${profile.ministries ? profile.ministries.join(', ') : 'Nenhum'}</span>
                </div>
                <div class="perfil-item">
                    <strong>PGM</strong>
                    <span>${profile.pgm || 'Não definido'}</span>
                </div>
            `;
        }

        const avisosContainer = document.getElementById('avisos-container');
        if (avisosContainer) {
            if (notices && notices.length > 0) {
                avisosContainer.innerHTML = notices.map(aviso => `
                    <div class="aviso-item">${aviso.content}</div>
                `).join('');
            } else {
                avisosContainer.innerHTML = '<p>Nenhum aviso no momento.</p>';
            }
        }
    }
});



