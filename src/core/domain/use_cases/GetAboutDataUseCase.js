export class GetAboutDataUseCase {
    constructor(aboutRepository) {
        this.aboutRepository = aboutRepository;
    }

    async execute() {
        const [courses, leadership, timeline] = await Promise.all([
            this.aboutRepository.getCourses(),
            this.aboutRepository.getLeadership(),
            this.aboutRepository.getTimeline()
        ]);

        return {
            courses,
            leadership,
            timeline
        };
    }
}


