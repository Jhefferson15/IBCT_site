import { Event } from './event.js';

export class Lesson extends Event {
    constructor(data = {}) {
        super(data);
        this.teacher = data.teacher || 'Professor não definido';
        this.scripture = data.scripture || '';
        this.description = data.description || '';
        this.imageText = data.imageText || '';
        this.imageClass = data.imageClass || '';
    }
}



