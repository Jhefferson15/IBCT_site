import { BaseEntity } from '../../../../core/domain/entities/BaseEntity.js';

export class Member extends BaseEntity {
    constructor(data = {}) {
        super(data);
        this.name = data.name || 'Membro';
        this.ministries = data.ministries || ['Visitante'];
        this.pgm = data.pgm || 'Não definido';
        this.email = data.email || '';
    }

    get firstName() {
        return this.name.split(' ')[0];
    }
}



