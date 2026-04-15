/**
 * Validações em tempo real e UX polish
 * Validações avançadas
 */

const Validations = {
    rules: {
        fullName: {
            required: true,
            minLength: 3,
            message: 'Nome completo é obrigatório (mín. 3 caracteres)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email inválido (ex: nome@email.com)'
        },
        jobTitle: {
            required: false,
            minLength: 2,
            message: 'Cargo deve ter no mín. 2 caracteres'
        },
        summary: {
            required: false,
            maxLength: 500,
            message: 'Resumo deve ter no máx. 500 caracteres'
        }
    },

    init() {
        this.setupValidations();
        this.setupCharCounter();
        this.setupLoadingStates();
        console.log('✅ Validações inicializadas');
    },

    /**
     * Setup de validações em tempo real
     */
    setupValidations() {
        Object.keys(this.rules).forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (!element) return;

            // Valida no blur (quando sai do campo)
            element.addEventListener('blur', () => {
                this.validateField(fieldId, element);
            });

            // Limpa erro no focus
            element.addEventListener('focus', () => {
                this.clearError(element);
            });

            // Validação em tempo real para email
            if (fieldId === 'email') {
                element.addEventListener('input', Utils.debounce(() => {
                    this.validateField(fieldId, element);
                }, 500));
            }
        });
    },

    /**
     * Valida campo individual
     */
    validateField(fieldId, element) {
        const rule = this.rules[fieldId];
        const value = element.value.trim();
        
        let isValid = true;
        let message = '';

        // Required
        if (rule.required && !value) {
            isValid = false;
            message = rule.message;
        }
        
        // Min length
        else if (value && rule.minLength && value.length < rule.minLength) {
            isValid = false;
            message = rule.message;
        }
        
        // Max length
        else if (value && rule.maxLength && value.length > rule.maxLength) {
            isValid = false;
            message = rule.message;
        }
        
        // Pattern (regex)
        else if (value && rule.pattern && !rule.pattern.test(value)) {
            isValid = false;
            message = rule.message;
        }

        // Aplica visual
        if (isValid) {
            this.showSuccess(element);
        } else {
            this.showError(element, message);
        }

        return isValid;
    },

    /**
     * Mostra erro no campo
     */
    showError(element, message) {
        element.classList.add('input-error');
        element.classList.remove('input-success');
        
        // Remove mensagem anterior se existir
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Cria mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentNode.appendChild(errorDiv);

        // Shake animation
        element.style.animation = 'shake 0.4s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 400);
    },

    /**
     * Mostra sucesso no campo
     */
    showSuccess(element) {
        element.classList.add('input-success');
        element.classList.remove('input-error');
        
        // Remove mensagem de erro
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
    },

    /**
     * Limpa erro do campo
     */
    clearError(element) {
        element.classList.remove('input-error');
        const existingError = element.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
    },

    /**
     * Contador de caracteres para o resumo
     */
    setupCharCounter() {
        const summary = document.getElementById('summary');
        if (!summary) return;

        // Cria contador
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = '0 / 500';
        summary.parentNode.appendChild(counter);

        // Atualiza em tempo real
        summary.addEventListener('input', () => {
            const length = summary.value.length;
            counter.textContent = `${length} / 500`;
            
            // Alerta quando próximo do limite
            if (length > 450) {
                counter.classList.add('warning');
            } else {
                counter.classList.remove('warning');
            }
            
            // Bloqueia no limite
            if (length > 500) {
                summary.value = summary.value.substring(0, 500);
                counter.textContent = '500 / 500';
                counter.classList.add('limit');
            }
        });
    },

    /**
     * Loading states nos botões
     */
    setupLoadingStates() {
        // Intercepta cliques em botões de ação
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="export"], [data-action="save"]');
            if (!btn) return;

            // Adiciona estado de loading
            const originalText = btn.innerHTML;
            btn.dataset.originalText = originalText;
            btn.innerHTML = '<span class="spinner"></span> Processando...';
            btn.disabled = true;
            btn.classList.add('btn-loading');

            // Remove loading após 3 segundos (fallback)
            setTimeout(() => {
                this.removeLoading(btn);
            }, 3000);
        });
    },

    /**
     * Remove estado de loading
     */
    removeLoading(btn) {
        if (!btn.classList.contains('btn-loading')) return;
        
        btn.innerHTML = btn.dataset.originalText;
        btn.disabled = false;
        btn.classList.remove('btn-loading');
    },

    /**
     * Valida formulário completo antes de exportar
     */
    validateBeforeExport() {
        let isValid = true;
        
        ['fullName', 'email'].forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (!element) return;
            
            const fieldValid = this.validateField(fieldId, element);
            if (!fieldValid) isValid = false;
        });

        if (!isValid) {
            Utils.showToast('❌ Corrija os erros antes de exportar', 3000);
            
            // Scroll para o primeiro erro
            const firstError = document.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }

        return isValid;
    }
};