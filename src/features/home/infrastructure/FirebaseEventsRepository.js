import { db } from '../../../core/firebase/FirebaseConfig.js';
import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { BaseFirebaseRepository } from '../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Event } from '../domain/entities/Event.js';

export class FirebaseEventsRepository extends BaseFirebaseRepository {
    async getNextEvents(count = 4, departmentFilter = null) {
        try {
            const eventsRef = collection(db, "events");
            let q;
            
            const today = new Date().toISOString().split('T')[0];
            
            if (departmentFilter) {
                q = query(
                    eventsRef, 
                    where("department", "==", departmentFilter),
                    where("date", ">=", today),
                    orderBy("date"),
                    limit(count)
                );
            } else {
                q = query(
                    eventsRef, 
                    where("date", ">=", today),
                    orderBy("date"),
                    limit(count)
                );
            }
            
            const querySnapshot = await getDocs(q);
            return this.mapCollectionToEntities(querySnapshot, Event);
        } catch (error) {
            console.error("Erro ao buscar eventos no Firestore:", error);
            return [];
        }
    }
}



