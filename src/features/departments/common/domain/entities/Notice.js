import { BaseEntity } from '../../../../../core/domain/entities/BaseEntity.js';

export class Notice extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.title = data.title || '';
        this.content = data.content || data.message || '';
        this.icon = data.icon || 'fas fa-info-circle';
    }
}



