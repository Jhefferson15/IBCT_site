import { db } from '../../firebase/FirebaseConfig.js';
import { collection, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { BaseFirebaseRepository } from './BaseFirebaseRepository.js';
import { Course, Leader, TimelineItem } from '../../domain/entities/AboutEntities.js';

export class FirebaseAboutRepository extends BaseFirebaseRepository {
    async getCourses() {
        try {
            const ref = collection(db, "uf_courses");
            const snapshot = await getDocs(ref);
            return this.mapCollectionToEntities(snapshot, Course);
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
            return [];
        }
    }

    async getLeadership() {
        try {
            const ref = collection(db, "leadership");
            const snapshot = await getDocs(ref);
            return this.mapCollectionToEntities(snapshot, Leader);
        } catch (error) {
            console.error("Erro ao buscar liderança:", error);
            return [];
        }
    }

    async getTimeline() {
        try {
            const ref = collection(db, "timeline");
            const q = query(ref, orderBy("date", "desc"));
            const snapshot = await getDocs(q);
            return this.mapCollectionToEntities(snapshot, TimelineItem);
        } catch (error) {
            console.error("Erro ao buscar linha do tempo:", error);
            return [];
        }
    }
}


