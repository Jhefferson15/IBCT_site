import { RunFiveMinuteUpdateUseCase } from "../src/usecases/RunFiveMinuteUpdateUseCase";
import { UpdateRepository } from "../src/domain/repositories/UpdateRepository";
import { SystemUpdate } from "../src/domain/entities/SystemUpdate";

class MockUpdateRepository implements UpdateRepository {
    public savedUpdate: SystemUpdate | null = null;

    async saveUpdateRecord(update: SystemUpdate): Promise<void> {
        this.savedUpdate = update;
    }
}

describe("Integração dos Cron Jobs - Clean Architecture", () => {
    it("Deve escrever no Firestore os dados do cron de 5 minutos (Mock)", async () => {
        const mockRepo = new MockUpdateRepository();
        const usecase = new RunFiveMinuteUpdateUseCase(mockRepo);

        await usecase.execute();

        expect(mockRepo.savedUpdate).not.toBeNull();
        expect(mockRepo.savedUpdate?.type).toBe("5_MINUTES");
        expect(mockRepo.savedUpdate?.description).toBe("Rotina executada a cada 5 minutos.");
    });
});
