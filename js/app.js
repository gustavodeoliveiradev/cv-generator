/**
 * Ponto de entrada da aplicação
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa módulos na ordem correta
    Preview.init();
    FormHandler.init();
    
    console.log('🚀 CV Generator inicializado com sucesso!');
    console.log('📁 Arquitetura: Modular com Separação de Responsabilidades');
});