export class BaseFirebaseRepository {
    /**
     * Converte um documento do Firestore para uma instância da Entidade.
     * @param {Object} doc - Documento do Firestore Snapshot
     * @param {Class} EntityClass - Classe da Entidade para instanciar
     * @returns {Object} Instância da Entidade
     */
    mapToEntity(doc, EntityClass) {
        if (!doc.exists()) return null;
        const data = doc.data();
        return new EntityClass({
            id: doc.id,
            ...data
        });
    }

    /**
     * Converte uma lista de documentos para uma lista de instâncias de Entidades.
     * @param {Object} querySnapshot - Snapshot do Firestore
     * @param {Class} EntityClass - Classe da Entidade para instanciar
     * @returns {Array} Lista de instâncias
     */
    mapCollectionToEntities(querySnapshot, EntityClass) {
        return querySnapshot.docs.map(doc => this.mapToEntity(doc, EntityClass));
    }
}


