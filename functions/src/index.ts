import * as admin from "firebase-admin";

admin.initializeApp();

// Exportar os triggers
export * from "./triggers/scheduledUpdates";
