import { BaseEntity } from '../../../../../core/domain/entities/BaseEntity.js';

export class Product extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.title = data.title || 'Produto';
        this.price = data.price || 'R$ 0,00';
        this.img = data.img || '';
        this.desc = data.desc || '';
    }

    get whatsappMessage() {
        const message = `Olá! Tenho interesse no produto: *${this.title}*. Poderia me passar mais informações?`;
        return encodeURIComponent(message);
    }
}



