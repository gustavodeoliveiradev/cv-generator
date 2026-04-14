/**
 * Exportação PDF Profissional - VERSÃO DEFINITIVA
 * Estratégia: Renderização em container isolado sem CSS complexo
 */

const PDFExport = {
    A4_WIDTH: 210,
    A4_HEIGHT: 297,
    MARGIN: 10,

    init() {
        console.log('📄 PDF Export v2.0 initialized');
    },

    async export() {
        if (!this.hasContent()) {
            Utils.showToast('❌ Preencha seu currículo antes de exportar!');
            return;
        }

        Utils.showToast('📄 Gerando PDF... Aguarde', 3000);

        try {
            // 🚨 NOVA ESTRATÉGIA: Cria container limpo para renderização
            const cleanContainer = this.createCleanContainer();
            document.body.appendChild(cleanContainer);

            // Aguarda renderização
            await this.wait(500);

            // Captura do container limpo
            const canvas = await html2canvas(cleanContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 800,
                windowHeight: 1000,
                width: 800,
                height: Math.max(cleanContainer.offsetHeight, 600)
            });

            // Remove container temporário
            document.body.removeChild(cleanContainer);

            // Valida canvas
            if (!canvas || canvas.width < 100 || canvas.height < 100) {
                throw new Error('Canvas inválido gerado');
            }

            console.log('✅ Canvas gerado:', canvas.width, 'x', canvas.height);

            // Converte para PDF
            const pdf = this.canvasToPDF(canvas);
            const fileName = this.generateFileName();
            pdf.save(fileName);

            Utils.showToast('✅ PDF baixado com sucesso!');

        } catch (error) {
            console.error('❌ Erro PDF:', error);
            Utils.showToast('❌ Erro: ' + error.message);
        }
    },

    /**
     * 🎯 CRIA CONTAINER LIMPO SEM CSS PROBLEMATICO
     */
    createCleanContainer() {
        const data = State.data;
        const theme = Themes.currentTheme;

        // Cores por tema (sólidas, sem gradientes)
        const themeColors = {
            minimal: { primary: '#2563eb', text: '#1f2937', bg: '#ffffff' },
            modern: { primary: '#6366f1', text: '#0f172a', bg: '#ffffff' },
            creative: { primary: '#d97706', text: '#451a03', bg: '#fffbeb' }
        };

        const colors = themeColors[theme] || themeColors.minimal;

        const container = document.createElement('div');
        container.id = 'pdf-temp-container';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 800px;
            background: ${colors.bg};
            padding: 60px;
            font-family: ${Themes.currentFont === 'playfair' ? 'Georgia, serif' : 'Inter, Arial, sans-serif'};
            color: ${colors.text};
            line-height: 1.6;
            box-sizing: border-box;
            z-index: -9999;
        `;

        // Monta HTML limpo do CV
        container.innerHTML = this.buildCleanHTML(data, colors);

        return container;
    },

    /**
     * 📝 CONSTRÓI HTML LIMPO DO CV
     */
    buildCleanHTML(data, colors) {
        const p = data.personal;

        // Header
        let html = `
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid ${colors.primary};">
                <h1 style="font-size: 42px; margin: 0 0 10px 0; color: ${colors.text}; font-weight: 700;">${p.fullName || 'Seu Nome'}</h1>
                <p style="font-size: 20px; margin: 0 0 15px 0; color: ${colors.primary}; font-weight: 500;">${p.jobTitle || ''}</p>
                <div style="font-size: 14px; color: #666;">
                    ${p.email ? `<span style="margin: 0 10px;">📧 ${p.email}</span>` : ''}
                    ${p.phone ? `<span style="margin: 0 10px;">📱 ${p.phone}</span>` : ''}
                    ${p.location ? `<span style="margin: 0 10px;">📍 ${p.location}</span>` : ''}
                </div>
            </div>
        `;

        // Resumo
        if (p.summary) {
            html += `
                <div style="margin-bottom: 25px;">
                    <h2 style="font-size: 14px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #ddd;">Resumo Profissional</h2>
                    <p style="margin: 0; color: #555; line-height: 1.7;">${p.summary}</p>
                </div>
            `;
        }

        // Experiência
        if (data.experience.length > 0) {
            html += `
                <div style="margin-bottom: 25px;">
                    <h2 style="font-size: 14px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #ddd;">Experiência Profissional</h2>
            `;

            data.experience.forEach(exp => {
                html += `
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                            <h3 style="font-size: 16px; margin: 0; color: ${colors.text}; font-weight: 600;">${exp.title || 'Cargo'}</h3>
                            <span style="font-size: 13px; color: #888;">${exp.date || ''}</span>
                        </div>
                        <p style="font-size: 14px; color: ${colors.primary}; margin: 0 0 8px 0; font-weight: 500;">${exp.company || ''}</p>
                        <p style="font-size: 13px; color: #666; margin: 0; line-height: 1.6;">${exp.description || ''}</p>
                    </div>
                `;
            });

            html += '</div>';
        }

        // Educação
        if (data.education.length > 0) {
            html += `
                <div style="margin-bottom: 25px;">
                    <h2 style="font-size: 14px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #ddd;">Educação</h2>
            `;

            data.education.forEach(edu => {
                html += `
                    <div style="margin-bottom: 15px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h3 style="font-size: 16px; margin: 0; color: ${colors.text}; font-weight: 600;">${edu.degree || 'Curso'}</h3>
                            <span style="font-size: 13px; color: #888;">${edu.date || ''}</span>
                        </div>
                        <p style="font-size: 14px; color: ${colors.primary}; margin: 5px 0 0 0; font-weight: 500;">${edu.school || ''}</p>
                    </div>
                `;
            });

            html += '</div>';
        }

        // Habilidades
        if (data.skills.length > 0) {
            html += `
                <div style="margin-bottom: 25px;">
                    <h2 style="font-size: 14px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #ddd;">Habilidades</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            `;

            data.skills.forEach(skill => {
                if (skill.trim()) {
                    html += `<span style="background: ${colors.primary}; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 500;">${skill.trim()}</span>`;
                }
            });

            html += '</div></div>';
        }

        return html;
    },

    canvasToPDF(canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');

        // Cálculos de dimensão seguros
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(190 / imgWidth, 277 / imgHeight) * 0.264583;

        let finalWidth = imgWidth * ratio;
        let finalHeight = imgHeight * ratio;

        // Fallbacks
        if (!Number.isFinite(finalWidth) || finalWidth <= 0) finalWidth = 190;
        if (!Number.isFinite(finalHeight) || finalHeight <= 0) finalHeight = 250;

        finalWidth = Math.min(finalWidth, 190);
        finalHeight = Math.min(finalHeight, 277);

        const x = (210 - finalWidth) / 2;
        const y = 10;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        return pdf;
    },

    hasContent() {
        const data = State.data;
        return data.personal.fullName || data.experience.length > 0 || data.education.length > 0;
    },

    generateFileName() {
        const name = State.data.personal.fullName || 'Curriculo';
        const cleanName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const date = new Date().toISOString().split('T')[0];
        return `CV_${cleanName}_${date}.pdf`;
    },

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
