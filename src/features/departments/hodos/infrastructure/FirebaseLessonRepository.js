// src/infra/repositories/firebase_lesson_repository.js
import { db } from '../../../../../core/firebase/FirebaseConfig.js';
import { collection, query, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { BaseFirebaseRepository } from '../../../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Lesson } from '../domain/entities/Lesson.js';

export class FirebaseLessonRepository extends BaseFirebaseRepository {
    async getLessonsByDepartment(departmentId) {
        try {
            // Caminho: departments/{departmentId}/lessons
            const lessonsRef = collection(db, 'departments', departmentId, 'lessons');
            const q = query(lessonsRef, orderBy('date', 'asc'));
            const querySnapshot = await getDocs(q);
            return this.mapCollectionToEntities(querySnapshot, Lesson);
        } catch (error) {
            console.error(`Erro ao buscar lições no Firestore para ${departmentId}:`, error);
            throw error;
        }
    }
}



