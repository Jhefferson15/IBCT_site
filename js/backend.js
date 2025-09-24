// --- ARQUIVO: js/backend.js ---
// Conecta o frontend com os serviços do Firebase (Authentication e Firestore)

// Objeto global para encapsular a lógica do backend
const IBCT_Backend = {
    // --- Inicialização ---
    // Referências para os serviços do Firebase que serão usados
    app: null,
    auth: null,
    db: null,

    // Inicializa o Firebase e os serviços
    initFirebase() {
        if (!this.app) { // Garante que a inicialização ocorra apenas uma vez
            // Validação para garantir que a configuração foi preenchida
            if (typeof firebaseConfig === 'undefined' || firebaseConfig.apiKey === "SUA_API_KEY") {
                console.error("ERRO: A configuração do Firebase não foi encontrada ou não está preenchida. Verifique o arquivo 'js/firebase-config.js'.");
                alert("Erro de configuração do Firebase. Verifique o console para mais detalhes.");
                return false;
            }

            this.app = firebase.initializeApp(firebaseConfig);
            this.auth = firebase.auth();
            this.db = firebase.firestore();
            console.log("Firebase inicializado com sucesso.");
        }
        return true;
    },

    // --- Autenticação e Sessão ---
    // Função de Login com Email e Senha
    async login(email, password, rememberMe) {
        try {
            // Define a persistência da sessão
            const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
            await this.auth.setPersistence(persistence);

            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            return { success: true, user: { uid: user.uid, name: user.displayName || 'Usuário' } };
        } catch (error) {
            console.error("Erro de login:", error);
            return { success: false, message: this.getAuthErrorMessage(error) };
        }
    },

    // Função de Login com Google
    async loginWithGoogle(rememberMe) {
        try {
            const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
            await this.auth.setPersistence(persistence);

            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await this.auth.signInWithPopup(provider);
            const user = result.user;

            // Opcional: Salvar dados do usuário no Firestore na primeira vez
            const userRef = this.db.collection('users').doc(user.uid);
            const doc = await userRef.get();
            if (!doc.exists) {
                await userRef.set({
                    name: user.displayName,
                    email: user.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            return { success: true, user: { uid: user.uid, name: user.displayName } };
        } catch (error) {
            console.error("Erro no login com Google:", error);
            return { success: false, message: this.getAuthErrorMessage(error) };
        }
    },

    // Função de Logout
    async logout() {
        try {
            await this.auth.signOut();
            console.log("Sessão encerrada com sucesso.");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    },

    // Verifica a sessão do usuário
    checkSession(callback) {
        // Adiciona uma verificação para garantir que o 'auth' foi inicializado
        if (!this.auth) {
            console.warn("Firebase Auth não foi inicializado. Verifique a configuração.");
            callback(null); // Assume que não há usuário se o auth não estiver pronto
            return;
        }

        this.auth.onAuthStateChanged(user => {
            if (user) {
                // Se o usuário tiver um nome de exibição, use-o. Caso contrário, tente extrair do e-mail.
                const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuário');
                callback({ uid: user.uid, name: name });
            } else {
                callback(null);
            }
        });
    },

    // --- Acesso a Dados (Firestore) ---
    // Busca os dados para a área de membros (avisos e perfil)
    async getMemberData() {
        const user = this.auth.currentUser;
        if (!user) return null;

        try {
            // 1. Buscar o perfil do usuário
            const userRef = this.db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            const userProfile = userDoc.exists ? userDoc.data() : { name: user.displayName, email: user.email };

            // 2. Buscar os avisos gerais
            const noticesSnapshot = await this.db.collection('notices').orderBy('createdAt', 'desc').limit(5).get();
            const notices = noticesSnapshot.docs.map(doc => doc.data().text);

            return { profile: userProfile, notices: notices };
        } catch (error) {
            console.error("Erro ao buscar dados do membro:", error);
            return null;
        }
    },

    // Busca os próximos eventos para a home
    async getUpcomingEvents() {
        try {
            const now = new Date();
            const snapshot = await this.db.collection('events')
                .where('date', '>=', now)
                .orderBy('date', 'asc')
                .limit(3)
                .get();

            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            return [];
        }
    },

    // --- Funções Auxiliares ---
    // Traduz mensagens de erro do Firebase Auth
    getAuthErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'E-mail ou senha inválidos.';
            case 'auth/invalid-email':
                return 'O formato do e-mail é inválido.';
            case 'auth/popup-closed-by-user':
                return 'A janela de login foi fechada. Tente novamente.';
            default:
                return 'Ocorreu um erro. Por favor, tente mais tarde.';
        }
    },

    // --- Configuração Inicial de Dados (Opcional) ---
    // Adiciona dados de exemplo ao Firestore para demonstração
    async setupInitialData() {
        const setupRef = this.db.collection('internal').doc('setup');
        const doc = await setupRef.get();

        if (!doc.exists || !doc.data().initialDataPopulated) {
            console.log("Executando configuração inicial de dados...");
            const batch = this.db.batch();

            // Adiciona avisos
            const noticesData = [
                { text: "Inscrições abertas para o Acampamento Hodos 2025! Procure a liderança.", createdAt: new Date() },
                { text: "Nossa campanha de doação para o Rio Grande do Sul continua. Pontos de coleta na entrada.", createdAt: new Date() },
                { text: "Reunião de planejamento do Ministério Infantil nesta quarta-feira às 19h na sala 3.", createdAt: new Date() }
            ];
            noticesData.forEach(notice => {
                const noticeRef = this.db.collection('notices').doc();
                batch.set(noticeRef, notice);
            });

            // Adiciona eventos de exemplo
            const eventsData = [
                { name: 'Culto de Oração', date: new Date(new Date().setDate(new Date().getDate() + 2)), time: '20:00', location: 'Templo Principal' },
                { name: 'Ensaio do Coral', date: new Date(new Date().setDate(new Date().getDate() + 4)), time: '19:30', location: 'Sala de Música' },
                { name: 'Escola Bíblica Dominical', date: new Date(new Date().setDate(new Date().getDate() + 6)), time: '09:00', location: 'Salas de Aula' }
            ];
            eventsData.forEach(event => {
                const eventRef = this.db.collection('events').doc();
                // Firestore armazena Timestamps, não objetos Date diretamente
                batch.set(eventRef, { ...event, date: firebase.firestore.Timestamp.fromDate(event.date) });
            });

            await batch.commit();
            await setupRef.set({ initialDataPopulated: true });
            console.log("Dados iniciais inseridos no Firestore.");
        } else {
            console.log("Configuração inicial de dados já foi executada.");
        }
    }
};

// Auto-inicializa o Firebase quando o script é carregado
IBCT_Backend.initFirebase();