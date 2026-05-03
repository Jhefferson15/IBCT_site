import { BaseEntity } from '../../../../core/domain/entities/BaseEntity.js';

export class Mission extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.title = data.title || '';
        this.subtitle = data.subtitle || '';
        this.image = data.image || '';
        this.shortDescription = data.shortDescription || '';
        this.detailedDescription = data.detailedDescription || '';
        this.stats = data.stats || [];
        this.link = data.link || null;
        this.linkText = data.linkText || null;
    }
}



