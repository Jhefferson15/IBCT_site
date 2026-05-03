export class ManageCollectionUseCase {
    constructor(adminRepository, collectionName) {
        this.adminRepository = adminRepository;
        this.collectionName = collectionName;
    }

    async list(orderByField) {
        return await this.adminRepository.getAllFromCollection(this.collectionName, orderByField);
    }

    async add(data) {
        return await this.adminRepository.addDocument(this.collectionName, data);
    }

    async update(id, data) {
        return await this.adminRepository.updateDocument(this.collectionName, id, data);
    }

    async delete(id) {
        return await this.adminRepository.deleteDocument(this.collectionName, id);
    }
}


