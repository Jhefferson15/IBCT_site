import { BaseEntity } from '../../../../core/domain/entities/BaseEntity.js';

export class Event extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.title = data.title || 'Evento sem título';
        this.date = data.date || '';
        this.location = data.location || '';
        this.type = data.type || '';
        this.cardContentHTML = data.cardContentHTML || null;
        this.cardClass = data.cardClass || '';
        this.externalPage = data.externalPage || '';
        this.departmentId = data.departmentId || '';
    }

    get isFuture() {
        if (!this.date) return false;
        const today = new Date().toISOString().split('T')[0];
        return this.date >= today;
    }

    get formattedMonth() {
        if (!this.date) return '';
        const dateObj = new Date(this.date + 'T00:00:00');
        return dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    }

    get formattedDay() {
        if (!this.date) return '';
        const dateObj = new Date(this.date + 'T00:00:00');
        return String(dateObj.getDate()).padStart(2, '0');
    }
}



