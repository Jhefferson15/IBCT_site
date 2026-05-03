import { UpdateRepository } from "../domain/repositories/UpdateRepository";

export class RunHourlyUpdateUseCase {
    constructor(private updateRepository: UpdateRepository) {}

    async execute(): Promise<void> {
        await this.updateRepository.saveUpdateRecord({
            type: "HOURLY",
            lastUpdated: new Date(),
            description: "Rotina executada a cada 1 hora."
        });
        console.log("Hourly update finished.");
    }
}
