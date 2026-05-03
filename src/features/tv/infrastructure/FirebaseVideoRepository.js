import { db } from '../../../core/firebase/FirebaseConfig.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { BaseFirebaseRepository } from '../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Video } from '../domain/entities/Video.js';

export class FirebaseVideoRepository extends BaseFirebaseRepository {
    async getAllVideos() {
        try {
            const videosRef = collection(db, "videos");
            // Tenta buscar ordenado por data primeiro
            let q = query(videosRef, orderBy("date", "desc"));
            let querySnapshot;
            
            try {
                querySnapshot = await getDocs(q);
            } catch (e) {
                console.warn("Falha ao buscar vídeos ordenados (provavelmente falta de índice ou campo 'date'):", e);
                // Fallback: busca sem ordenação
                querySnapshot = await getDocs(videosRef);
            }

            return this.mapCollectionToEntities(querySnapshot, Video);
        } catch (error) {
            console.error("Erro fatal ao buscar vídeos no Firestore:", error);
            return [];
        }
    }
}



