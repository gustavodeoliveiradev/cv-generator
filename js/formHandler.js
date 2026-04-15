/**
 * Manipulação de eventos do formulário
 */

const FormHandler = {
    /**
     * Inicializa todos os handlers
     */
    init() {
        this.setupPersonalFields();
        this.setupSkills();
        this.setupButtons();
        this.loadSavedData();
    },

    /**
     * Campos pessoais
     */
    setupPersonalFields() {
        const fields = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'summary'];

        fields.forEach(field => {
            const element = document.getElementById(field);
            if (!element) return;

            element.addEventListener('input', (e) => {
                State.updatePersonal(field, e.target.value);
                Storage.autoSave();
            });
        });
    },

    /**
     * Campo de habilidades
     */
    setupSkills() {
        const skillsInput = document.getElementById('skills');
        if (!skillsInput) return;

        skillsInput.addEventListener('input', (e) => {
            State.updateSkills(e.target.value);
            Storage.autoSave();
        });
    },

    /**
     * Botões de ação
     */
    setupButtons() {
        document.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (!action) return;

            switch (action) {
                case 'add-experience':
                    this.addExperienceField();
                    break;
                case 'add-education':
                    this.addEducationField();
                    break;
                case 'save':
                    this.handleSave();
                    break;
                case 'reset':
                    this.handleReset();
                    break;
                case 'export':
                    this.handleExport();
                    break;
            }
        });
    },

    /**
     * Adiciona campo de experiência
     */
    addExperienceField() {
        const id = State.addExperience({ title: '', company: '', date: '', description: '' });
        const container = document.getElementById('experienceList');

        const div = document.createElement('div');
        div.className = 'list-item';
        div.dataset.id = id;
        div.innerHTML = `
            <button type="button" class="remove-btn" data-remove="experience" aria-label="Remover experiência">×</button>
            <div class="form-group">
                <input type="text" placeholder="Cargo" data-field="title" aria-label="Cargo">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="text" placeholder="Empresa" data-field="company" aria-label="Empresa">
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Período (ex: 2020 - 2023)" data-field="date" aria-label="Período">
                </div>
            </div>
            <div class="form-group">
                <textarea placeholder="Descrição das atividades" data-field="description" aria-label="Descrição"></textarea>
            </div>
        `;

        // Event listeners para os campos
        div.querySelectorAll('[data-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                State.updateExperience(id, e.target.dataset.field, e.target.value);
                Storage.autoSave();
            });
        });

        // Botão de remover
        div.querySelector('[data-remove]').addEventListener('click', () => {
            State.removeExperience(id);
            div.remove();
            Storage.autoSave();
        });

        container.appendChild(div);
    },

    /**
     * Adiciona campo de educação
     */
    addEducationField() {
        const id = State.addEducation({ degree: '', school: '', date: '' });
        const container = document.getElementById('educationList');

        const div = document.createElement('div');
        div.className = 'list-item';
        div.dataset.id = id;
        div.innerHTML = `
            <button type="button" class="remove-btn" data-remove="education" aria-label="Remover educação">×</button>
            <div class="form-group">
                <input type="text" placeholder="Curso/Grau" data-field="degree" aria-label="Curso">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <input type="text" placeholder="Instituição" data-field="school" aria-label="Instituição">
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Ano de conclusão" data-field="date" aria-label="Ano">
                </div>
            </div>
        `;

        div.querySelectorAll('[data-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                State.updateEducation(id, e.target.dataset.field, e.target.value);
                Storage.autoSave();
            });
        });

        div.querySelector('[data-remove]').addEventListener('click', () => {
            State.removeEducation(id);
            div.remove();
            Storage.autoSave();
        });

        container.appendChild(div);
    },

    /**
     * Salva manualmente
     */
    handleSave() {
        if (Storage.save()) {
            Utils.showToast('💾 Progresso salvo com sucesso!');
        } else {
            Utils.showToast('❌ Erro ao salvar dados');
        }
    },

    /**
     * Reseta tudo com confirmação modal
     */
    handleReset() {
        // Cria modal de confirmação ao invés de confirm() nativo
        const modal = document.createElement('div');
        modal.className = 'confirm-modal';
        modal.innerHTML = `
        <div class="confirm-modal-content">
            <h3>🗑️ Limpar todos os dados?</h3>
            <p>Esta ação não pode ser desfeita. Seu currículo atual será perdido.</p>
            <div class="confirm-modal-buttons">
                <button class="btn btn-secondary" data-action="cancel-reset">Cancelar</button>
                <button class="btn btn-primary" data-action="confirm-reset" style="background: #ef4444;">Sim, limpar</button>
            </div>
        </div>
    `;

        document.body.appendChild(modal);

        // Handlers dos botões
        modal.querySelector('[data-action="cancel-reset"]').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('[data-action="confirm-reset"]').addEventListener('click', () => {
            // Executa reset
            State.reset();
            Storage.clear();
            document.getElementById('cvForm').reset();
            document.getElementById('experienceList').innerHTML = '';
            document.getElementById('educationList').innerHTML = '';
            document.getElementById('skills').value = '';

            // Limpa validações visuais
            document.querySelectorAll('.input-error, .input-success').forEach(el => {
                el.classList.remove('input-error', 'input-success');
            });
            document.querySelectorAll('.error-message').forEach(el => el.remove());

            document.body.removeChild(modal);
            Utils.showToast('🗑️ Dados limpos com sucesso');
        });

        // Fecha ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    },

    /**
     * Exporta PDF (usando o módulo dedicado)
     */
    handleExport() {
        // Chama o novo módulo de exportação
        PDFExport.export();
    },

    /**
     * Carrega dados salvos e popula formulário
     */
    loadSavedData() {
        const saved = Storage.load();
        if (!saved) return;

        State.load(saved);

        // Popula campos pessoais
        Object.entries(saved.personal).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) element.value = value;
        });

        // Popula skills
        if (saved.skills.length > 0) {
            document.getElementById('skills').value = saved.skills.join(', ');
        }

        // Recria campos de experiência
        saved.experience.forEach(exp => {
            this.addExperienceField();
            const div = document.getElementById('experienceList').lastElementChild;
            div.querySelector('[data-field="title"]').value = exp.title;
            div.querySelector('[data-field="company"]').value = exp.company;
            div.querySelector('[data-field="date"]').value = exp.date;
            div.querySelector('[data-field="description"]').value = exp.description;
        });

        // Recria campos de educação
        saved.education.forEach(edu => {
            this.addEducationField();
            const div = document.getElementById('educationList').lastElementChild;
            div.querySelector('[data-field="degree"]').value = edu.degree;
            div.querySelector('[data-field="school"]').value = edu.school;
            div.querySelector('[data-field="date"]').value = edu.date;
        });
    }
};