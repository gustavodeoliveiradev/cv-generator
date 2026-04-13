/**
 * Ponto de entrada da aplicação
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ordem de inicialização importante
    Preview.init();
    FormHandler.init();
    Themes.init();
    Mobile.init(); // NOVO: Inicializa mobile navigation
    
    console.log('🚀 CV Generator v0.3.0 - Mobile Ready!');
    console.log('📱 Mobile:', Mobile.getState().isMobile ? 'Sim' : 'Não');
    console.log('🎨 Tema:', Themes.currentTheme);
    console.log('🔤 Fonte:', Themes.currentFont);
});