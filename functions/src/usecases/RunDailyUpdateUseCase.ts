import { UpdateRepository } from "../domain/repositories/UpdateRepository";

export class RunDailyUpdateUseCase {
    constructor(private updateRepository: UpdateRepository) {}

    async execute(): Promise<void> {
        await this.updateRepository.saveUpdateRecord({
            type: "DAILY",
            lastUpdated: new Date(),
            description: "Rotina executada diariamente."
        });
        console.log("Daily update finished.");
    }
}
