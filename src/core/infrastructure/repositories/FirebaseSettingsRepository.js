import { db } from '../../firebase/FirebaseConfig.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FirebaseSettingsRepository {
    async getSettings() {
        try {
            const docRef = doc(db, "config", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                // Configurações padrão
                return {
                    siteTitle: "Igreja Batista Central em Taguatinga",
                    siteDescription: "Uma família para pertencer.",
                    maintenanceMode: false
                };
            }
        } catch (error) {
            console.error("Erro ao buscar configurações no Firestore:", error);
            return null;
        }
    }

    async updateSettings(settings) {
        try {
            const docRef = doc(db, "config", "general");
            await setDoc(docRef, settings, { merge: true });
            return { success: true };
        } catch (error) {
            console.error("Erro ao atualizar configurações no Firestore:", error);
            return { success: false, error: error.message };
        }
    }
}


