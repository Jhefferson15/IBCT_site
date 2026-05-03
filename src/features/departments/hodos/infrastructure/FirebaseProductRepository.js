import { db } from '../../../../../core/firebase/FirebaseConfig.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { BaseFirebaseRepository } from '../../../../../core/infrastructure/repositories/BaseFirebaseRepository.js';
import { Product } from '../domain/entities/Product.js';

export class FirebaseProductRepository extends BaseFirebaseRepository {
    async getProductsByDepartment(departmentId) {
        try {
            const productsRef = collection(db, "products");
            const q = query(
                productsRef, 
                where("departmentId", "==", departmentId),
                orderBy("title")
            );
            
            const querySnapshot = await getDocs(q);
            return this.mapCollectionToEntities(querySnapshot, Product);
        } catch (error) {
            console.error("Erro ao buscar produtos no Firestore:", error);
            return [];
        }
    }
}



