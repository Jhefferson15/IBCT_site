import { SystemUpdate } from "../entities/SystemUpdate";

export interface UpdateRepository {
    saveUpdateRecord(update: SystemUpdate): Promise<void>;
}
