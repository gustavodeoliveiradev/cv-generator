/**
 * Import/Export de dados JSON + Drag & Drop
 * Dia 6: Portabilidade e backup de dados
 */

const DataManager = {
    /**
     * Inicializa o módulo
     */
    init() {
        this.setupUI();
        this.setupDragAndDrop();
        console.log('📦 DataManager initialized');
    },

    /**
     * Cria botões de import/export na UI
     */
    setupUI() {
        const editor = document.querySelector('.editor');
        const saveBtn = editor.querySelector('[data-action="save"]');

        // Container de ações de dados
        const dataActions = document.createElement('div');
        dataActions.className = 'data-actions';
        dataActions.innerHTML = `
            <h3 class="section-title" style="margin-top: 30px;">📦 Portabilidade</h3>
            <div class="data-buttons">
                <button class="btn btn-secondary" data-action="export-json">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar JSON
                </button>
                <button class="btn btn-secondary" data-action="import-json">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Importar JSON
                </button>
            </div>
            <input type="file" id="jsonFileInput" accept=".json" style="display: none;">
        `;

        saveBtn.parentNode.insertBefore(dataActions, saveBtn.nextSibling);

        // Event listeners
        dataActions.querySelector('[data-action="export-json"]').addEventListener('click', () => {
            this.exportJSON();
        });

        dataActions.querySelector('[data-action="import-json"]').addEventListener('click', () => {
            document.getElementById('jsonFileInput').click();
        });

        document.getElementById('jsonFileInput').addEventListener('change', (e) => {
            this.importJSON(e.target.files[0]);
        });
    },

    /**
     * Sanitiza string para prevenir XSS
     */
    sanitizeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /**
     * Valida e sanitiza dados importados
     */
    sanitizeImportedData(data) {
        const sanitized = {
            personal: {},
            experience: [],
            education: [],
            skills: [],
            meta: data.meta || {}
        };

        // Sanitiza campos pessoais
        Object.keys(data.personal || {}).forEach(key => {
            sanitized.personal[key] = this.sanitizeHTML(data.personal[key]);
        });

        // Sanitiza experiências
        (data.experience || []).forEach(exp => {
            sanitized.experience.push({
                id: exp.id || Utils.generateId(),
                title: this.sanitizeHTML(exp.title),
                company: this.sanitizeHTML(exp.company),
                date: this.sanitizeHTML(exp.date),
                description: this.sanitizeHTML(exp.description)
            });
        });

        // Sanitiza educação
        (data.education || []).forEach(edu => {
            sanitized.education.push({
                id: edu.id || Utils.generateId(),
                degree: this.sanitizeHTML(edu.degree),
                school: this.sanitizeHTML(edu.school),
                date: this.sanitizeHTML(edu.date)
            });
        });

        // Sanitiza skills
        (data.skills || []).forEach(skill => {
            sanitized.skills.push(this.sanitizeHTML(skill));
        });

        return sanitized;
    },

    /**
     * Exporta dados para JSON
     */
    exportJSON() {
        const data = {
            ...State.export(),
            meta: {
                version: '1.0.0',
                exportedAt: new Date().toISOString(),
                app: 'CV Generator'
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        const name = State.data.personal.fullName || 'curriculo';
        const cleanName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

        a.href = url;
        a.download = `CV_${cleanName}_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Utils.showToast('✅ Dados exportados para JSON!');
    },

    /**
     * Importa dados de arquivo JSON
     */
    async importJSON(file) {
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            Utils.showToast('❌ Selecione um arquivo .json válido');
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Valida estrutura
            if (!data.personal || !data.experience || !data.education) {
                throw new Error('Formato JSON inválido');
            }

            // Confirma antes de sobrescrever
            if (State.data.personal.fullName) {
                const confirm = window.confirm(
                    '⚠️ Isso substituirá seus dados atuais.\n\n' +
                    `Arquivo: ${file.name}\n` +
                    `Nome no arquivo: ${data.personal.fullName || 'N/A'}\n\n` +
                    'Deseja continuar?'
                );
                if (!confirm) return;
            }

            // 🛡️ SANITIZA dados antes de importar
            const sanitizedData = this.sanitizeImportedData(data);

            // Importa dados sanitizados
            State.load(sanitizedData);
            Storage.save();

            // Recarrega formulário
            this.populateForm(sanitizedData);

            Utils.showToast('✅ Dados importados com sucesso!');

        } catch (error) {
            console.error('Erro ao importar:', error);
            Utils.showToast('❌ Erro ao importar: ' + error.message);
        }

        // Limpa input para permitir reimportar mesmo arquivo
        document.getElementById('jsonFileInput').value = '';
    },

    /**
     * Popula formulário com dados importados
     */
    populateForm(data) {
        // Campos pessoais
        Object.entries(data.personal).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) element.value = value || '';
        });

        // Skills
        if (data.skills?.length) {
            document.getElementById('skills').value = data.skills.join(', ');
        }

        // Limpa e recria experiências
        document.getElementById('experienceList').innerHTML = '';
        data.experience.forEach(exp => {
            document.querySelector('[data-action="add-experience"]').click();

            const items = document.querySelectorAll('#experienceList .list-item');
            const lastItem = items[items.length - 1];
            if (lastItem) {
                lastItem.querySelector('[data-field="title"]').value = exp.title || '';
                lastItem.querySelector('[data-field="company"]').value = exp.company || '';
                lastItem.querySelector('[data-field="date"]').value = exp.date || '';
                lastItem.querySelector('[data-field="description"]').value = exp.description || '';
            }
        });

        // Limpa e recria educação
        document.getElementById('educationList').innerHTML = '';
        data.education.forEach(edu => {
            document.querySelector('[data-action="add-education"]').click();

            const items = document.querySelectorAll('#educationList .list-item');
            const lastItem = items[items.length - 1];
            if (lastItem) {
                lastItem.querySelector('[data-field="degree"]').value = edu.degree || '';
                lastItem.querySelector('[data-field="school"]').value = edu.school || '';
                lastItem.querySelector('[data-field="date"]').value = edu.date || '';
            }
        });

        // Atualiza preview
        Preview.render();
    },

    /**
     * Setup de Drag & Drop para reordenar
     */
    setupDragAndDrop() {
        this.makeSortable('experienceList');
        this.makeSortable('educationList');
    },

    /**
     * Torna uma lista ordenável
     */
    makeSortable(listId) {
        const list = document.getElementById(listId);
        if (!list) return;

        let draggedItem = null;

        list.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('list-item')) {
                draggedItem = e.target;
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        list.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('list-item')) {
                e.target.style.opacity = '1';
                draggedItem = null;

                // Atualiza estado com nova ordem
                this.updateOrderFromDOM(listId);
            }
        });

        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(list, e.clientY);
            if (draggedItem && afterElement) {
                list.insertBefore(draggedItem, afterElement);
            } else if (draggedItem) {
                list.appendChild(draggedItem);
            }
        });

        // Adiciona atributo draggable aos itens existentes
        this.enableDragging(list);

        // Observer para novos itens
        const observer = new MutationObserver(() => {
            this.enableDragging(list);
        });
        observer.observe(list, { childList: true });
    },

    /**
     * Habilita dragging nos itens da lista
     */
    enableDragging(list) {
        list.querySelectorAll('.list-item').forEach(item => {
            item.setAttribute('draggable', 'true');
            item.style.cursor = 'move';

            // Adiciona handle visual
            if (!item.querySelector('.drag-handle')) {
                const handle = document.createElement('div');
                handle.className = 'drag-handle';
                handle.innerHTML = '⋮⋮';
                handle.style.cssText = `
                    position: absolute;
                    left: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #ccc;
                    font-size: 12px;
                    cursor: move;
                    padding: 5px;
                `;
                item.style.position = 'relative';
                item.style.paddingLeft = '30px';
                item.insertBefore(handle, item.firstChild);
            }
        });
    },

    /**
     * Encontra elemento após o qual inserir
     */
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.list-item:not([style*="opacity: 0.5"])')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    },

    /**
     * Atualiza ordem no State baseado no DOM
     */
    updateOrderFromDOM(listId) {
        const list = document.getElementById(listId);
        const items = list.querySelectorAll('.list-item');
        const newOrder = [];

        items.forEach(item => {
            const id = item.dataset.id || item.id.replace(/^(exp|edu)-/, '');
            newOrder.push(id);
        });

        // Atualiza State
        if (listId === 'experienceList') {
            const newExperience = [];
            newOrder.forEach(id => {
                const exp = State.data.experience.find(e => e.id === id);
                if (exp) newExperience.push(exp);
            });
            State.data.experience = newExperience;
        } else {
            const newEducation = [];
            newOrder.forEach(id => {
                const edu = State.data.education.find(e => e.id === id);
                if (edu) newEducation.push(edu);
            });
            State.data.education = newEducation;
        }

        Storage.save();
        Preview.render();

        Utils.showToast('🔄 Ordem atualizada!', 1500);
    }
};
