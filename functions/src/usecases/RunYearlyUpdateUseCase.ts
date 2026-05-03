import { UpdateRepository } from "../domain/repositories/UpdateRepository";

export class RunYearlyUpdateUseCase {
    constructor(private updateRepository: UpdateRepository) {}

    async execute(): Promise<void> {
        await this.updateRepository.saveUpdateRecord({
            type: "YEARLY",
            lastUpdated: new Date(),
            description: "Rotina executada anualmente."
        });
        console.log("Yearly update finished.");
    }
}
