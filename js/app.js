/**
 * Ponto de entrada da aplicação
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa módulos na ordem correta
    Preview.init();
    FormHandler.init();
    Themes.init(); // NOVO: Inicializa temas
    
    console.log('🚀 CV Generator inicializado!');
    console.log('🎨 Temas disponíveis:', Themes.availableThemes.length);
    console.log('🔤 Fontes disponíveis:', Themes.availableFonts.length);
});