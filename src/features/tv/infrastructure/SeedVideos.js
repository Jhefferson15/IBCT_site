import { db } from '../../../core/firebase/FirebaseConfig.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Script para migrar vídeos do JSON local para o Firestore.
 * Como rodar: Importe este arquivo em uma página temporária ou execute o código no console 
 * de uma página que já tenha o Firebase configurado.
 */
export async function seedVideosFromJson(jsonData) {
    const videosRef = collection(db, "videos");
    let count = 0;

    console.log("Iniciando migração de vídeos...");

    // O JSON tem estrutura videosByYearMonth -> ano -> mes -> lista
    const years = jsonData.videosByYearMonth;
    
    for (const year in years) {
        for (const month in years[year]) {
            const videoList = years[year][month];
            
            for (const video of videoList) {
                try {
                    await addDoc(videosRef, {
                        youtubeId: video.id,
                        title: video.title,
                        description: video.description || "",
                        date: video.publishedAt,
                        category: "all", // Pode ser ajustado conforme a lógica de filtros
                        createdAt: serverTimestamp()
                    });
                    count++;
                    if (count % 10 === 0) console.log(`${count} vídeos migrados...`);
                } catch (error) {
                    console.error(`Erro ao migrar vídeo ${video.id}:`, error);
                }
            }
        }
    }

    console.log(`Migração concluída! Total: ${count} vídeos.`);
    alert(`${count} vídeos foram migrados com sucesso para o Firestore!`);
}



