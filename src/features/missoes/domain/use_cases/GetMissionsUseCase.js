export class GetMissionsUseCase {
    constructor(missionRepository) {
        this.missionRepository = missionRepository;
    }

    async execute() {
        return await this.missionRepository.getAllMissions();
    }
}



