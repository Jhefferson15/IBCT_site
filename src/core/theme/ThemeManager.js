/**
 * js/core/theme-manager.js
 * Gerenciador de temas seguindo princípios de Clean Architecture.
 * Isola a lógica de persistência e aplicação do tema da UI.
 */

export const ThemeManager = {
    STORAGE_KEY: 'ibct_theme_preference',
    THEMES: {
        LIGHT: 'light',
        DARK: 'dark'
    },

    /**
     * Inicializa o tema ao carregar a página.
     */
    init() {
        this.apply(this.getStoredTheme());
        // Desativado: o tema deve ser controlado apenas pelo usuário, sem seguir o sistema
        // this.listenToSystemChanges();
    },

    /**
     * Retorna o tema armazenado ou o tema padrão (claro).
     */
    getStoredTheme() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) return stored;
        
        // Retorna o tema claro como padrão, ignorando a preferência do sistema
        return this.THEMES.LIGHT;
    },

    /**
     * Salva a preferência de tema.
     */
    saveTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
    },

    /**
     * Aplica o tema ao documento.
     */
    apply(theme) {
        if (theme === this.THEMES.DARK) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    },

    /**
     * Alterna entre os temas claro e escuro.
     */
    toggle() {
        const current = this.getStoredTheme();
        const next = current === this.THEMES.LIGHT ? this.THEMES.DARK : this.THEMES.LIGHT;
        
        this.saveTheme(next);
        this.apply(next);
        return next;
    },

    /**
     * Escuta mudanças nas configurações do sistema (opcional - desativado).
     */
    listenToSystemChanges() {
        // Implementação vazia ou removida conforme necessidade de manter compatibilidade de assinatura
    }
};


