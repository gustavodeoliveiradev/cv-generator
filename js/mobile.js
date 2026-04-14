/**
 * Mobile Navigation & Responsive Handler
 * Dia 3: Mobile-first UX
 * VERSÃO CORRIGIDA - Preview sempre acessível
 */

const Mobile = {
    isMobile: false,
    currentTab: 'editor', // 'editor' | 'preview'
    isFullscreen: false,

    /**
     * Inicializa detecção e controles mobile
     */
    init() {
        this.detectMobile();
        this.setupEventListeners();
        this.createMobileNav();
        this.setupSwipeGestures();

        // Verifica na inicialização
        if (this.isMobile) {
            this.switchTab('editor');
        }

        console.log(`📱 Mobile: ${this.isMobile ? 'ativo' : 'inativo'}`);
    },

    /**
     * Detecta se é dispositivo mobile
     */
    detectMobile() {
        const checkMobile = () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth < 768;

            if (wasMobile !== this.isMobile) {
                this.handleViewportChange();
            }
        };

        checkMobile();
        window.addEventListener('resize', Utils.debounce(checkMobile, 250));
    },

    /**
     * Cria navegação inferior (tabs)
     */
    createMobileNav() {
        // Remove nav existente se houver
        const existingNav = document.querySelector('.mobile-nav');
        if (existingNav) existingNav.remove();

        const nav = document.createElement('nav');
        nav.className = 'mobile-nav';
        nav.setAttribute('role', 'tablist');
        nav.setAttribute('aria-label', 'Navegação principal');

        nav.innerHTML = `
            <button class="mobile-nav-item active" data-tab="editor" role="tab" aria-selected="true" aria-controls="editor-panel" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Editar</span>
            </button>
            <button class="mobile-nav-item" data-tab="preview" role="tab" aria-selected="false" aria-controls="preview-panel" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Preview</span>
            </button>
        `;

        document.body.appendChild(nav);
        this.mobileNav = nav;

        // Event listeners para touch e click
        nav.querySelectorAll('.mobile-nav-item').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            }, { passive: false });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    },

    /**
     * Alterna entre abas (Editor/Preview)
     * VERSÃO CORRIGIDA - Garante que preview fique visível quando ativo
     */
    switchTab(tab) {
        if (!this.isMobile && tab === this.currentTab) return;

        this.currentTab = tab;
        const editor = document.querySelector('.editor');
        const preview = document.querySelector('.preview-container');
        const buttons = this.mobileNav?.querySelectorAll('.mobile-nav-item');

        // Atualiza botões
        buttons?.forEach(btn => {
            const isActive = btn.dataset.tab === tab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        // Mostra/esconde painéis NO MOBILE
        if (this.isMobile) {
            if (tab === 'editor') {
                // Mostra editor, esconde preview
                editor.classList.remove('hidden-mobile');
                editor.style.display = 'block';

                preview.classList.remove('active-mobile');
                preview.style.display = 'none';

                this.isFullscreen = false;
            } else {
                // Esconde editor, mostra preview
                editor.classList.add('hidden-mobile');
                editor.style.display = 'none';

                preview.classList.add('active-mobile');
                preview.style.display = 'block';
                preview.style.visibility = 'visible';
                preview.style.opacity = '1';

                // Força re-renderização do preview
                Preview.render();
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        console.log(`📱 Tab switched to: ${tab}`);
    },

    /**
     * Toggle fullscreen no preview mobile
     */
    toggleFullscreen() {
        if (!this.isMobile || this.currentTab !== 'preview') return;

        this.isFullscreen = !this.isFullscreen;
        const preview = document.querySelector('.preview-container');
        const nav = this.mobileNav;

        if (this.isFullscreen) {
            preview.classList.add('fullscreen-mobile');
            nav?.classList.add('hidden');
            Utils.showToast('📱 Tela cheia. Toque no cabeçalho para sair.', 2000);
        } else {
            preview.classList.remove('fullscreen-mobile');
            nav?.classList.remove('hidden');
        }
    },

    /**
     * Setup de event listeners
     */
    setupEventListeners() {
        // Botão fullscreen
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="fullscreen"]')) {
                this.toggleFullscreen();
            }

            if (this.isFullscreen && e.target.closest('.preview-header')) {
                this.toggleFullscreen();
            }
        });

        // Tecla ESC sai do fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });

        // Previne zoom no double-tap (iOS)
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    },

    /**
     * Gestos de swipe para alternar abas
     */
    setupSwipeGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!this.isMobile) return;

            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            // Swipe left: Editor → Preview
            if (Math.abs(diff) > minSwipeDistance && diff > 0 && this.currentTab === 'editor') {
                this.switchTab('preview');
            }

            // Swipe right: Preview → Editor
            if (Math.abs(diff) > minSwipeDistance && diff < 0 && this.currentTab === 'preview') {
                this.switchTab('editor');
            }
        }, { passive: true });
    },

    /**
     * Handler de mudança de viewport
     */
    handleViewportChange() {
        const editor = document.querySelector('.editor');
        const preview = document.querySelector('.preview-container');

        if (!this.isMobile) {
            // Desktop: mostra tudo
            editor.classList.remove('hidden-mobile');
            editor.style.display = '';

            preview.classList.remove('active-mobile', 'fullscreen-mobile');
            preview.style.display = '';
            preview.style.visibility = '';
            preview.style.opacity = '';

            this.mobileNav?.classList.remove('hidden');
            this.isFullscreen = false;
        } else {
            // Mobile: respeita tab atual
            this.switchTab(this.currentTab);
        }

        Preview.render();
    },

    /**
     * API pública
     */
    getState() {
        return {
            isMobile: this.isMobile,
            currentTab: this.currentTab,
            isFullscreen: this.isFullscreen
        };
    }
};
