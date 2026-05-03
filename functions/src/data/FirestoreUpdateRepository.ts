import * as admin from "firebase-admin";
import { SystemUpdate } from "../domain/entities/SystemUpdate";
import { UpdateRepository } from "../domain/repositories/UpdateRepository";

export class FirestoreUpdateRepository implements UpdateRepository {
    private db: admin.firestore.Firestore;

    constructor() {
        this.db = admin.firestore();
    }

    async saveUpdateRecord(update: SystemUpdate): Promise<void> {
        const docRef = this.db.collection("system_updates").doc(update.type);
        await docRef.set({
            lastUpdated: admin.firestore.Timestamp.fromDate(update.lastUpdated),
            description: update.description,
        }, { merge: true });
    }
}
