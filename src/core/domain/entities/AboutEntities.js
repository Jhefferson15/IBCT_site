export class Course {
    constructor({ id, title, description, icon }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.icon = icon;
    }
}

export class Leader {
    constructor({ id, name, role, bio, image }) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.bio = bio;
        this.image = image;
    }
}

export class TimelineItem {
    constructor({ id, title, date, content }) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.content = content;
    }
}


