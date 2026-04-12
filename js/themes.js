/**
 * Gerenciamento de Temas e Fontes
 */

const Themes = {
    // Configurações disponíveis
    availableThemes: [
        { id: 'minimal', name: 'Minimalista', file: 'css/themes/minimal.css' },
        { id: 'modern', name: 'Moderno', file: 'css/themes/modern.css' },
        { id: 'creative', name: 'Criativo', file: 'css/themes/creative.css' }
    ],

    availableFonts: [
        { id: 'inter', name: 'Inter', family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
        { id: 'roboto', name: 'Roboto', family: 'Roboto', url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap' },
        { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap' },
        { id: 'montserrat', name: 'Montserrat', family: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' },
        { id: 'opensans', name: 'Open Sans', family: 'Open Sans', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' }
    ],

    currentTheme: 'minimal',
    currentFont: 'inter',

    /**
     * Inicializa o sistema de temas
     */
    init() {
        this.loadSavedPreferences();
        this.injectFontLoader();
        this.createThemeControls();
        this.applyTheme(this.currentTheme);
        this.applyFont(this.currentFont);
    },

    /**
     * Cria controles de UI no editor
     */
    createThemeControls() {
        const editor = document.querySelector('.editor');
        
        // Container de personalização
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'customization-panel';
        controlsDiv.innerHTML = `
            <h2 class="section-title">🎨 Personalização</h2>
            
            <div class="form-group">
                <label for="themeSelect">Tema Visual</label>
                <select id="themeSelect" class="select-styled">
                    ${this.availableThemes.map(t => 
                        `<option value="${t.id}" ${t.id === this.currentTheme ? 'selected' : ''}>${t.name}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="fontSelect">Fonte Principal</label>
                <select id="fontSelect" class="select-styled">
                    ${this.availableFonts.map(f => 
                        `<option value="${f.id}" ${f.id === this.currentFont ? 'selected' : ''}>${f.name}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="theme-preview" id="themePreview">
                <small>Preview do tema aplicado ao seu CV →</small>
            </div>
        `;

        // Insere após o título principal
        const firstTitle = editor.querySelector('.section-title');
        firstTitle.parentNode.insertBefore(controlsDiv, firstTitle.nextSibling);

        // Event listeners
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
            this.savePreferences();
        });

        document.getElementById('fontSelect').addEventListener('change', (e) => {
            this.applyFont(e.target.value);
            this.savePreferences();
        });
    },

    /**
     * Aplica tema selecionado
     */
    applyTheme(themeId) {
        const preview = document.getElementById('preview');
        
        // Remove tema anterior
        preview.classList.remove(`theme-${this.currentTheme}`);
        
        // Aplica novo tema
        this.currentTheme = themeId;
        preview.classList.add(`theme-${themeId}`);
        
        // Atualiza preview se necessário
        Preview.render();
        
        // Feedback visual
        Utils.showToast(`🎨 Tema "${this.getThemeName(themeId)}" aplicado!`);
    },

    /**
     * Aplica fonte selecionada
     */
    applyFont(fontId) {
        const font = this.availableFonts.find(f => f.id === fontId);
        if (!font) return;

        // Carrega fonte do Google Fonts dinamicamente
        const linkId = `font-${fontId}`;
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = font.url;
            document.head.appendChild(link);
        }

        // Aplica ao preview
        const preview = document.getElementById('preview');
        preview.style.fontFamily = font.family;
        
        // Atualiza CSS variables se necessário
        document.documentElement.style.setProperty('--cv-font-heading', font.family);
        document.documentElement.style.setProperty('--cv-font-body', font.family);

        this.currentFont = fontId;
        
        // Re-renderiza para aplicar mudanças
        setTimeout(() => Preview.render(), 100);
        
        Utils.showToast(`🔤 Fonte "${font.name}" aplicada!`);
    },

    /**
     * Retorna nome do tema
     */
    getThemeName(themeId) {
        const theme = this.availableThemes.find(t => t.id === themeId);
        return theme ? theme.name : themeId;
    },

    /**
     * Salva preferências
     */
    savePreferences() {
        const prefs = {
            theme: this.currentTheme,
            font: this.currentFont
        };
        localStorage.setItem('cvGenerator_prefs', JSON.stringify(prefs));
    },

    /**
     * Carrega preferências salvas
     */
    loadSavedPreferences() {
        const saved = localStorage.getItem('cvGenerator_prefs');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.currentTheme = prefs.theme || 'minimal';
            this.currentFont = prefs.font || 'inter';
        }
    },

    /**
     * Injeta loader de fontes
     */
    injectFontLoader() {
        // Pre-carrega Inter (padrão)
        const interLink = document.createElement('link');
        interLink.rel = 'stylesheet';
        interLink.href = this.availableFonts[0].url;
        document.head.appendChild(interLink);
    },

    /**
     * Exporta configuração atual
     */
    exportConfig() {
        return {
            theme: this.currentTheme,
            font: this.currentFont
        };
    }
};