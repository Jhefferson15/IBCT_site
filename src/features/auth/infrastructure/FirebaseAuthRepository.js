import { auth } from '../../../core/firebase/FirebaseConfig.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithCredential } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export class FirebaseAuthRepository {
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error("Erro no login Firebase:", error);
            let userMessage = "E-mail ou senha incorretos.";
            
            if (error.code === 'auth/configuration-not-found') {
                userMessage = "Configuração do Firebase pendente: Ative o método 'E-mail/Senha' no Console do Firebase.";
            } else if (error.code === 'auth/invalid-credential') {
                userMessage = "E-mail ou senha inválidos.";
            }

            return { success: false, message: userMessage };
        }
    }

    async loginWithGoogleCredential(credentialToken) {
        try {
            const credential = GoogleAuthProvider.credential(credentialToken);
            const userCredential = await signInWithCredential(auth, credential);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error("Erro no login Google Firebase:", error);
            return { success: false, message: error.message };
        }
    }

    async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error("Erro no logout Firebase:", error);
            return { success: false };
        }
    }

    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
}



