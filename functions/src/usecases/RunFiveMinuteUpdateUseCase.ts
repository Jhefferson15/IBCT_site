import { UpdateRepository } from "../domain/repositories/UpdateRepository";

export class RunFiveMinuteUpdateUseCase {
    constructor(private updateRepository: UpdateRepository) {}

    async execute(): Promise<void> {
        await this.updateRepository.saveUpdateRecord({
            type: "5_MINUTES",
            lastUpdated: new Date(),
            description: "Rotina executada a cada 5 minutos."
        });
        console.log("5 minute update finished.");
    }
}
