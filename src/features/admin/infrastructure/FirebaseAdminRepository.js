import { db } from '../../../core/firebase/FirebaseConfig.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export class FirebaseAdminRepository {
    async getAllFromCollection(collectionName, orderByField = 'createdAt') {
        try {
            const colRef = collection(db, collectionName);
            const q = query(colRef, orderBy(orderByField, 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error(`Erro ao buscar dados da coleção ${collectionName}:`, error);
            return [];
        }
    }

    async addDocument(collectionName, data) {
        try {
            const colRef = collection(db, collectionName);
            const docRef = await addDoc(colRef, {
                ...data,
                createdAt: serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error(`Erro ao adicionar documento na coleção ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async updateDocument(collectionName, id, data) {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error(`Erro ao atualizar documento ${id} na coleção ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    }

    async deleteDocument(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
            return { success: true };
        } catch (error) {
            console.error(`Erro ao deletar documento ${id} na coleção ${collectionName}:`, error);
            return { success: false, error: error.message };
        }
    }
}



