export class GetEventsUseCase {
    constructor(eventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    async execute(count, departmentFilter = null) {
        return await this.eventsRepository.getNextEvents(count, departmentFilter);
    }
}



