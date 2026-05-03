/**
 * Lista estática de versículos para economia de leituras no Firestore.
 * Seleciona um versículo baseado no dia do ano (1-366).
 */
export const dailyVerses = {
    1: { text: "No princípio, criou Deus os céus e a terra.", ref: "Gênesis 1:1" },
    2: { text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" },
    3: { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...", ref: "João 3:16" },
    4: { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
    5: { text: "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho.", ref: "Salmos 119:105" },
    // ... Adicionar mais versículos conforme necessário
    123: { text: "Portanto, sejam fortes e corajosos, todos vocês que põem sua esperança no Senhor!", ref: "Salmos 31:24" },
    // Versículo padrão caso o dia não esteja mapeado
    default: { text: "O Senhor te abençoe e te guarde.", ref: "Números 6:24" }
};

export function getVerseByDay() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    return dailyVerses[dayOfYear] || dailyVerses.default;
}


