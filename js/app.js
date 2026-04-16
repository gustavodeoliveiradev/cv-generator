/**
 * Ponto de entrada da aplicação
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ordem de inicialização importante
    Preview.init();
    Validations.init();
    DataManager.init();
    FormHandler.init();
    Themes.init();
    Mobile.init();
    PDFExport.init();

    console.log('🚀 CV Generator v0.3.0 - Mobile Ready!');
    console.log('🚀 CV Generator v0.4.0 - PDF Ready!');
    console.log('🚀 CV Generator v0.5.0 - Validations Ready!');
    console.log('🚀 CV Generator v0.6.0 - Data Portability Ready!');
    console.log('📱 Mobile:', Mobile.getState().isMobile ? 'Sim' : 'Não');
    console.log('🎨 Tema:', Themes.currentTheme);
    console.log('🔤 Fonte:', Themes.currentFont);
});