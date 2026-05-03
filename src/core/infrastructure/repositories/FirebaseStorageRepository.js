import { storage } from '../../firebase/FirebaseConfig.js';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

export class FirebaseStorageRepository {
    async uploadImage(file, path) {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return { success: true, url: downloadURL };
        } catch (error) {
            console.error("Erro no upload para o Firebase Storage:", error);
            return { success: false, error: error.message };
        }
    }

    async listImages(directory = 'images') {
        try {
            const listRef = ref(storage, directory);
            const res = await listAll(listRef);
            
            const imagePromises = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return { name: itemRef.name, url, fullPath: itemRef.fullPath };
            });
            
            return await Promise.all(imagePromises);
        } catch (error) {
            console.error("Erro ao listar imagens no Firebase Storage:", error);
            return [];
        }
    }

    async deleteImage(path) {
        try {
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
            return { success: true };
        } catch (error) {
            console.error("Erro ao excluir imagem no Firebase Storage:", error);
            return { success: false, error: error.message };
        }
    }
}


