// src/infra/repositories/firebase_department_notice_repository.js
import { db } from '../../../../../core/firebase/FirebaseConfig.js';
import { collection, query, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { BaseFirebaseRepository } from '../../../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Notice } from '../domain/entities/Notice.js';

export class FirebaseDepartmentNoticeRepository extends BaseFirebaseRepository {
    async getNoticesByDepartment(departmentId) {
        try {
            // Caminho: departments/{departmentId}/notices
            const noticesRef = collection(db, 'departments', departmentId, 'notices');
            const q = query(noticesRef, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return this.mapCollectionToEntities(querySnapshot, Notice);
        } catch (error) {
            console.error(`Erro ao buscar avisos no Firestore para ${departmentId}:`, error);
            throw error;
        }
    }
}



