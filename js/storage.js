/**
 * Persistência com localStorage
 */

const Storage = {
    KEY: 'cvGenerator_data',

    /**
     * Salva estado atual
     */
    save() {
        try {
            const data = State.export();
            localStorage.setItem(this.KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Erro ao salvar:', e);
            return false;
        }
    },

    /**
     * Carrega dados salvos
     */
    load() {
        try {
            const saved = localStorage.getItem(this.KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Erro ao carregar:', e);
            return null;
        }
    },

    /**
     * Remove todos os dados
     */
    clear() {
        localStorage.removeItem(this.KEY);
    },

    /**
     * Auto-save com debounce
     */
    autoSave: Utils.debounce(() => {
        Storage.save();
    }, 1000),

    /**
     * Exporta para arquivo JSON
     */
    downloadJSON() {
        const data = State.export();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
};