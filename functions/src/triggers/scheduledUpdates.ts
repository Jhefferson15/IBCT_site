import { onSchedule } from "firebase-functions/v2/scheduler";
import { FirestoreUpdateRepository } from "../data/FirestoreUpdateRepository";
import { RunFiveMinuteUpdateUseCase } from "../usecases/RunFiveMinuteUpdateUseCase";
import { RunHourlyUpdateUseCase } from "../usecases/RunHourlyUpdateUseCase";
import { RunDailyUpdateUseCase } from "../usecases/RunDailyUpdateUseCase";
import { RunYearlyUpdateUseCase } from "../usecases/RunYearlyUpdateUseCase";

// Inicializar dependências de Clean Architecture
const repository = new FirestoreUpdateRepository();

const fiveMinuteUseCase = new RunFiveMinuteUpdateUseCase(repository);
const hourlyUseCase = new RunHourlyUpdateUseCase(repository);
const dailyUseCase = new RunDailyUpdateUseCase(repository);
const yearlyUseCase = new RunYearlyUpdateUseCase(repository);

export const cronFiveMinutes = onSchedule("every 5 minutes", async (event) => {
    await fiveMinuteUseCase.execute();
});

export const cronHourly = onSchedule("every 1 hours", async (event) => {
    await hourlyUseCase.execute();
});

export const cronDaily = onSchedule("every day 00:00", async (event) => {
    await dailyUseCase.execute();
});

export const cronYearly = onSchedule("0 0 1 1 *", async (event) => {
    await yearlyUseCase.execute();
});
