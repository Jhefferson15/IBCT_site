// --- ARQUIVO: js/backend-simulado.js ---
// Este arquivo SIMULA um backend para fins de demonstração.
// Em um projeto real, estas lógicas estariam em um servidor (Node.js, Firebase, etc.).

const IBCT_Backend = {
    // Simulação de uma tabela de usuários no banco de dados
    _users: [
        {
            id: 1,
            email: 'membro@ibct.com',
            passwordHash: 'senha123', // Em um ambiente real, isso seria uma hash criptográfica
            name: 'João Membro',
            ministries: ['Hodos', 'Louvor'],
            pgm: 'PGM Sião'
        },
        {
            id: 2,
            email: 'lider@ibct.com',
            passwordHash: 'lider456',
            name: 'Maria Líder',
            ministries: ['Diaconia', 'Família'],
            pgm: 'PGM Betel'
        }
    ],

    // Simulação de dados para a página de membros
    _memberData: {
        avisos: [
            "Inscrições abertas para o Acampamento Hodos 2025! Procure a liderança.",
            "Nossa campanha de doação para o Rio Grande do Sul continua. Pontos de coleta na entrada.",
            "Reunião de planejamento do Ministério Infantil nesta quarta-feira às 19h na sala 3."
        ]
    },

    // Inicia a sessão verificando se há dados no sessionStorage ou localStorage
    initSession() {
        let sessionData = sessionStorage.getItem('ibct_session');
        if (!sessionData) {
            sessionData = localStorage.getItem('ibct_session'); // Verifica "Lembrar de mim"
        }

        if (sessionData) {
            return JSON.parse(sessionData);
        }
        return null;
    },

    // Função de Login com Email e Senha
    login(email, password, rememberMe) {
        const user = this._users.find(u => u.email === email && u.passwordHash === password);
        if (user) {
            const sessionPayload = {
                userId: user.id,
                name: user.name
            };
            
            // Define onde salvar a sessão
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('ibct_session', JSON.stringify(sessionPayload));
            
            return { success: true, user: sessionPayload };
        }
        return { success: false, message: 'E-mail ou senha inválidos.' };
    },

    // Função de Login com Google (simulada)
    loginWithGoogle(googleUserObject, rememberMe) {
        // Em um app real, você validaria o token do Google no backend.
        // Aqui, vamos apenas criar uma sessão com os dados recebidos.
        const sessionPayload = {
            userId: googleUserObject.sub, // 'sub' é o ID único do Google
            name: googleUserObject.given_name
        };

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('ibct_session', JSON.stringify(sessionPayload));
        
        return { success: true, user: sessionPayload };
    },

    // Função de Logout
    logout() {
        sessionStorage.removeItem('ibct_session');
        localStorage.removeItem('ibct_session');
        console.log("Sessão encerrada no backend simulado.");
    },

    // Verifica se a sessão atual é válida
    checkSession() {
        return this.initSession();
    },

    // Busca os dados para a página de membros
    getMemberData() {
        const session = this.checkSession();
        if (!session) {
            return null;
        }

        const userProfile = this._users.find(u => u.id === session.userId) || { name: session.name, ministries: ['Visitante'], pgm: 'N/A' };

        return {
            profile: userProfile,
            notices: this._memberData.avisos
        };
    }
};