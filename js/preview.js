/**
 * Renderização do Preview do CV
 */

const Preview = {
    container: null,

    /**
     * Inicializa
     */
    init() {
        this.container = document.getElementById('preview');
        // Inscreve-se em mudanças de estado
        State.subscribe(() => this.render());
    },

    /**
     * Renderiza o CV baseado no estado atual
     */
    render() {
        const data = State.data;
        const hasContent = this.hasContent(data);

        if (!hasContent) {
            this.renderEmpty();
            return;
        }

        this.container.innerHTML = `
            <article class="cv-document">
                ${this.renderHeader(data.personal)}
                ${data.personal.summary ? this.renderSummary(data.personal.summary) : ''}
                ${data.experience.length > 0 ? this.renderExperience(data.experience) : ''}
                ${data.education.length > 0 ? this.renderEducation(data.education) : ''}
                ${data.skills.length > 0 ? this.renderSkills(data.skills) : ''}
            </article>
        `;
    },

    /**
     * Verifica se há conteúdo
     */
    hasContent(data) {
        const p = data.personal;
        return p.fullName || 
               data.experience.length > 0 || 
               data.education.length > 0;
    },

    /**
     * Estado vazio
     */
    renderEmpty() {
        this.container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p>Seu currículo aparecerá aqui...</p>
                <small style="color: var(--text-lighter); margin-top: 10px; display: block;">
                    Comece preenchendo seus dados pessoais
                </small>
            </div>
        `;
    },

    /**
     * Cabeçalho do CV
     */
    renderHeader(personal) {
        const contact = [];
        if (personal.email) contact.push(`<span>📧 ${personal.email}</span>`);
        if (personal.phone) contact.push(`<span>📱 ${personal.phone}</span>`);
        if (personal.location) contact.push(`<span>📍 ${personal.location}</span>`);

        return `
            <header class="cv-header">
                <h1 class="cv-name">${personal.fullName || 'Seu Nome'}</h1>
                ${personal.jobTitle ? `<div class="cv-title">${personal.jobTitle}</div>` : ''}
                ${contact.length > 0 ? `<div class="cv-contact">${contact.join('')}</div>` : ''}
            </header>
        `;
    },

    /**
     * Seção de resumo
     */
    renderSummary(summary) {
        return `
            <section class="cv-section">
                <h2 class="cv-section-title">Resumo Profissional</h2>
                <p class="cv-item-desc">${summary}</p>
            </section>
        `;
    },

    /**
     * Seção de experiência
     */
    renderExperience(experience) {
        const items = experience.map(exp => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <h3 class="cv-item-title">${exp.title || 'Cargo'}</h3>
                    <time class="cv-item-date">${exp.date || ''}</time>
                </div>
                ${exp.company ? `<div class="cv-item-subtitle">${exp.company}</div>` : ''}
                ${exp.description ? `<p class="cv-item-desc">${exp.description}</p>` : ''}
            </div>
        `).join('');

        return `
            <section class="cv-section">
                <h2 class="cv-section-title">Experiência Profissional</h2>
                ${items}
            </section>
        `;
    },

    /**
     * Seção de educação
     */
    renderEducation(education) {
        const items = education.map(edu => `
            <div class="cv-item">
                <div class="cv-item-header">
                    <h3 class="cv-item-title">${edu.degree || 'Curso'}</h3>
                    <time class="cv-item-date">${edu.date || ''}</time>
                </div>
                ${edu.school ? `<div class="cv-item-subtitle">${edu.school}</div>` : ''}
            </div>
        `).join('');

        return `
            <section class="cv-section">
                <h2 class="cv-section-title">Educação</h2>
                ${items}
            </section>
        `;
    },

    /**
     * Seção de habilidades
     */
    renderSkills(skills) {
        const skillsHTML = skills
            .map(skill => `<span class="cv-skill">${skill}</span>`)
            .join('');

        return `
            <section class="cv-section">
                <h2 class="cv-section-title">Habilidades</h2>
                <div class="cv-skills">${skillsHTML}</div>
            </section>
        `;
    }
};