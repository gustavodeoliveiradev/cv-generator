/**
 * Utilitários globais
 */

const Utils = {
    /**
     * Gera ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Debounce para eventos frequentes
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Mostra toast notification
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },

    /**
     * Formata data para exibição
     */
    formatDate(dateString) {
        if (!dateString) return '';
        // Implementação futura
        return dateString;
    },

    /**
     * Sanitiza input básico
     */
    sanitize(str) {
        if (!str) return '';
        return str.replace(/[<>]/g, '');
    }
};