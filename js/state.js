/**
 * Gerenciamento de Estado Centralizado
 */

const State = {
    // Estado inicial
    data: {
        personal: {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            summary: ''
        },
        experience: [],
        education: [],
        skills: []
    },

    // Callbacks para notificar mudanças
    listeners: [],

    /**
     * Inscreve listener para mudanças
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    },

    /**
     * Notifica todos os listeners
     */
    notify() {
        this.listeners.forEach(callback => callback(this.data));
    },

    /**
     * Atualiza campo pessoal
     */
    updatePersonal(field, value) {
        this.data.personal[field] = Utils.sanitize(value);
        this.notify();
    },

    /**
     * Adiciona experiência
     */
    addExperience(experience) {
        this.data.experience.push({
            id: Utils.generateId(),
            ...experience
        });
        this.notify();
        return this.data.experience[this.data.experience.length - 1].id;
    },

    /**
     * Atualiza experiência
     */
    updateExperience(id, field, value) {
        const exp = this.data.experience.find(e => e.id === id);
        if (exp) {
            exp[field] = Utils.sanitize(value);
            this.notify();
        }
    },

    /**
     * Remove experiência
     */
    removeExperience(id) {
        this.data.experience = this.data.experience.filter(e => e.id !== id);
        this.notify();
    },

    /**
     * Adiciona educação
     */
    addEducation(education) {
        this.data.education.push({
            id: Utils.generateId(),
            ...education
        });
        this.notify();
        return this.data.education[this.data.education.length - 1].id;
    },

    /**
     * Atualiza educação
     */
    updateEducation(id, field, value) {
        const edu = this.data.education.find(e => e.id === id);
        if (edu) {
            edu[field] = Utils.sanitize(value);
            this.notify();
        }
    },

    /**
     * Remove educação
     */
    removeEducation(id) {
        this.data.education = this.data.education.filter(e => e.id !== id);
        this.notify();
    },

    /**
     * Atualiza skills
     */
    updateSkills(skillsString) {
        this.data.skills = skillsString
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
        this.notify();
    },

    /**
     * Reseta todo o estado
     */
    reset() {
        this.data = {
            personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', summary: '' },
            experience: [],
            education: [],
            skills: []
        };
        this.notify();
    },

    /**
     * Carrega dados externos
     */
    load(data) {
        this.data = { ...this.data, ...data };
        this.notify();
    },

    /**
     * Exporta dados atuais
     */
    export() {
        return JSON.parse(JSON.stringify(this.data));
    }
};