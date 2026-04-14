/**
 * Exportação PDF Profissional
 * html2canvas + jsPDF integration
 */

const PDFExport = {
    // Configurações A4
    A4_WIDTH: 210,  // mm
    A4_HEIGHT: 297, // mm
    MARGIN: 10,     // mm
    
    /**
     * Inicializa o módulo
     */
    init() {
        this.setupEventListeners();
        console.log('📄 PDF Export initialized');
    },

    /**
     * Setup do botão de exportação
     */
    setupEventListeners() {
        // O botão já existe no HTML com data-action="export"
        // O FormHandler chama handleExport, que agora vai usar este módulo
    },

    /**
     * Exporta o CV para PDF
     */
    async export() {
        const preview = document.getElementById('preview');
        
        // Verifica se há conteúdo
        if (!this.hasContent()) {
            Utils.showToast('❌ Preencha seu currículo antes de exportar!');
            return;
        }

        Utils.showToast('📄 Gerando PDF... Aguarde', 2000);

        try {
            // 1. Prepara o preview para captura (remove scroll, etc)
            const originalStyles = this.prepareForCapture(preview);
            
            // 2. Renderiza com html2canvas em alta qualidade
            const canvas = await html2canvas(preview, {
                scale: 2, // Retina quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: preview.scrollWidth,
                windowHeight: preview.scrollHeight
            });

            // 3. Restaura estilos originais
            this.restoreStyles(preview, originalStyles);

            // 4. Converte para PDF
            const pdf = this.canvasToPDF(canvas);
            
            // 5. Download
            const fileName = this.generateFileName();
            pdf.save(fileName);
            
            Utils.showToast('✅ PDF baixado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            Utils.showToast('❌ Erro ao gerar PDF. Tente novamente.');
        }
    },

    /**
     * Verifica se há conteúdo para exportar
     */
    hasContent() {
        const data = State.data;
        return data.personal.fullName || 
               data.experience.length > 0 || 
               data.education.length > 0;
    },

    /**
     * Prepara o elemento para captura limpa
     */
    prepareForCapture(element) {
        const original = {
            maxHeight: element.style.maxHeight,
            overflow: element.style.overflow,
            transform: element.style.transform
        };

        // Remove limitações de scroll para capturar tudo
        element.style.maxHeight = 'none';
        element.style.overflow = 'visible';
        
        // Garante que o tema atual esteja aplicado
        element.classList.add(`theme-${Themes.currentTheme}`);

        return original;
    },

    /**
     * Restaura estilos originais
     */
    restoreStyles(element, styles) {
        Object.assign(element.style, styles);
    },

    /**
     * Converte canvas para PDF A4
     */
    canvasToPDF(canvas) {
        const { jsPDF } = window.jspdf;
        
        // Cria PDF A4
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Calcula dimensões
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = this.A4_WIDTH - (this.MARGIN * 2);
        const pdfHeight = this.A4_HEIGHT - (this.MARGIN * 2);
        
        // Proporção da imagem
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        // Dimensões finais
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;
        
        // Centraliza na página
        const x = (this.A4_WIDTH - finalWidth) / 2;
        const y = (this.A4_HEIGHT - finalHeight) / 2;
        
        // Adiciona imagem ao PDF
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        
        return pdf;
    },

    /**
     * Gera nome do arquivo baseado no nome do usuário
     */
    generateFileName() {
        const name = State.data.personal.fullName || 'Curriculo';
        const cleanName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const date = new Date().toISOString().split('T')[0];
        return `CV_${cleanName}_${date}.pdf`;
    },

    /**
     * Versão mobile otimizada (preview em tela cheia antes de capturar)
     */
    async exportMobile() {
        if (Mobile.isMobile && Mobile.currentTab !== 'preview') {
            // Muda para preview primeiro
            Mobile.switchTab('preview');
            await this.wait(500); // Aguarda transição
        }
        return this.export();
    },

    /**
     * Util: aguarda ms
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};