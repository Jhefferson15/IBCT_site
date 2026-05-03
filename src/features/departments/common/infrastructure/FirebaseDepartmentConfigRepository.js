// src/infra/repositories/firebase_department_config_repository.js
import { db } from '../../../../../core/firebase/FirebaseConfig.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export class FirebaseDepartmentConfigRepository {
    async getConfig(departmentId) {
        try {
            const configRef = doc(db, 'departments', departmentId, 'config', 'general');
            const docSnap = await getDoc(configRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (error) {
            console.error(`Erro ao buscar configurações no Firestore para ${departmentId}:`, error);
            throw error;
        }
    }
}



