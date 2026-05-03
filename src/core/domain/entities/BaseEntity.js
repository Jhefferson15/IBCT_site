export class BaseEntity {
    constructor(data = {}) {
        this.id = data.id || null;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    toJSON() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}


