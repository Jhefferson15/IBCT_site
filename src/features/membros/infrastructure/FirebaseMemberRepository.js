import { db, auth } from '../../../core/firebase/FirebaseConfig.js';
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { BaseFirebaseRepository } from '../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Member } from '../domain/entities/Member.js';
import { Notice } from '../domain/entities/Notice.js';

export class FirebaseMemberRepository extends BaseFirebaseRepository {
    async getProfile(userId) {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return this.mapToEntity(docSnap, Member);
            } else {
                // Perfil padrão se não existir no banco
                return new Member({
                    name: auth.currentUser?.displayName || "Membro",
                    ministries: ["Visitante"],
                    pgm: "Não definido"
                });
            }
        } catch (error) {
            console.error("Erro ao buscar perfil no Firestore:", error);
            return null;
        }
    }

    async getNotices() {
        try {
            const noticesRef = collection(db, "notices");
            const querySnapshot = await getDocs(noticesRef);
            return this.mapCollectionToEntities(querySnapshot, Notice);
        } catch (error) {
            console.error("Erro ao buscar avisos no Firestore:", error);
            return [new Notice({ content: "Campanha de doação ativa. Procure a secretaria." })]; // Fallback
        }
    }
}



