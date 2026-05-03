import { BaseEntity } from '../../../../core/domain/entities/BaseEntity.js';

export class Video extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.youtubeId = data.youtubeId || data.id || '';
        this.title = data.title || 'Sem título';
        this.description = data.description || '';
        this.date = data.date || data.publishedAt || 'Data não disponível';
        this.category = data.category || 'all';
    }

    get thumbnail() {
        return `https://img.youtube.com/vi/${this.youtubeId}/mqdefault.jpg`;
    }

    get embedUrl() {
        return `https://www.youtube.com/embed/${this.youtubeId}?autoplay=1`;
    }
}



