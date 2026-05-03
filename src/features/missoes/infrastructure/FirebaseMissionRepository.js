import { db } from '../../../core/firebase/FirebaseConfig.js';
import { collection, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { BaseFirebaseRepository } from '../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Mission } from '../domain/entities/Mission.js';

export class FirebaseMissionRepository extends BaseFirebaseRepository {
    async getAllMissions() {
        try {
            const missionsRef = collection(db, "missions");
            const q = query(missionsRef, orderBy("title"));
            
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                console.warn("Nenhuma missão encontrada no Firestore. Verifique a coleção 'missions'.");
                return [];
            }

            return this.mapCollectionToEntities(querySnapshot, Mission);
        } catch (error) {
            console.error("Erro ao buscar missões no Firestore:", error);
            return [];
        }
    }
}



