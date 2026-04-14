/**
 * Exportação PDF Profissional - VERSÃO TAMANHO AUMENTADO
 */

const PDFExport = {
    A4_WIDTH: 210,
    A4_HEIGHT: 297,

    init() {
        console.log('📄 PDF Export v2.1 (tamanho aumentado)');
    },

    async export() {
        if (!this.hasContent()) {
            Utils.showToast('❌ Preencha seu currículo antes de exportar!');
            return;
        }

        Utils.showToast('📄 Gerando PDF... Aguarde', 3000);

        try {
            const cleanContainer = this.createCleanContainer();
            document.body.appendChild(cleanContainer);
            await this.wait(500);

            const canvas = await html2canvas(cleanContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 800,
                height: Math.max(cleanContainer.offsetHeight, 600)
            });

            document.body.removeChild(cleanContainer);

            if (!canvas || canvas.width < 100 || canvas.height < 100) {
                throw new Error('Canvas inválido');
            }

            const pdf = this.canvasToPDF(canvas);
            const fileName = this.generateFileName();
            pdf.save(fileName);

            Utils.showToast('✅ PDF baixado!');

        } catch (error) {
            console.error('❌ Erro PDF:', error);
            Utils.showToast('❌ Erro: ' + error.message);
        }
    },

    createCleanContainer() {
        const data = State.data;
        const theme = Themes.currentTheme;

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
            padding: 50px 60px;
            font-family: ${Themes.currentFont === 'playfair' ? 'Georgia, serif' : 'Inter, Arial, sans-serif'};
            color: ${colors.text};
            line-height: 1.6;
            box-sizing: border-box;
        `;

        container.innerHTML = this.buildCleanHTML(data, colors);
        return container;
    },

    buildCleanHTML(data, colors) {
        const p = data.personal;

        let html = `
            <div style="text-align: center; margin-bottom: 35px; padding-bottom: 25px; border-bottom: 3px solid ${colors.primary};">
                <h1 style="font-size: 48px; margin: 0 0 12px 0; color: ${colors.text}; font-weight: 700; letter-spacing: -0.5px;">${p.fullName || 'Seu Nome'}</h1>
                <p style="font-size: 22px; margin: 0 0 18px 0; color: ${colors.primary}; font-weight: 500;">${p.jobTitle || ''}</p>
                <div style="font-size: 15px; color: #666; line-height: 1.8;">
                    ${p.email ? `<span style="margin: 0 12px;">📧 ${p.email}</span>` : ''}
                    ${p.phone ? `<span style="margin: 0 12px;">📱 ${p.phone}</span>` : ''}
                    ${p.location ? `<span style="margin: 0 12px;">📍 ${p.location}</span>` : ''}
                </div>
            </div>
        `;

        if (p.summary) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 16px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 18px 0; padding-bottom: 10px; border-bottom: 2px solid #eee; font-weight: 700;">Resumo Profissional</h2>
                    <p style="margin: 0; color: #555; line-height: 1.8; font-size: 15px;">${p.summary}</p>
                </div>
            `;
        }

        if (data.experience.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 16px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 18px 0; padding-bottom: 10px; border-bottom: 2px solid #eee; font-weight: 700;">Experiência Profissional</h2>
            `;

            data.experience.forEach(exp => {
                html += `
                    <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                            <h3 style="font-size: 18px; margin: 0; color: ${colors.text}; font-weight: 600;">${exp.title || 'Cargo'}</h3>
                            <span style="font-size: 14px; color: #888; font-weight: 500;">${exp.date || ''}</span>
                        </div>
                        <p style="font-size: 15px; color: ${colors.primary}; margin: 0 0 10px 0; font-weight: 600;">${exp.company || ''}</p>
                        <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.7;">${exp.description || ''}</p>
                    </div>
                `;
            });

            html += '</div>';
        }

        if (data.education.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 16px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 18px 0; padding-bottom: 10px; border-bottom: 2px solid #eee; font-weight: 700;">Educação</h2>
            `;

            data.education.forEach(edu => {
                html += `
                    <div style="margin-bottom: 18px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h3 style="font-size: 17px; margin: 0; color: ${colors.text}; font-weight: 600;">${edu.degree || 'Curso'}</h3>
                            <span style="font-size: 14px; color: #888; font-weight: 500;">${edu.date || ''}</span>
                        </div>
                        <p style="font-size: 15px; color: ${colors.primary}; margin: 6px 0 0 0; font-weight: 600;">${edu.school || ''}</p>
                    </div>
                `;
            });

            html += '</div>';
        }

        if (data.skills.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 16px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 18px 0; padding-bottom: 10px; border-bottom: 2px solid #eee; font-weight: 700;">Habilidades</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            `;

            data.skills.forEach(skill => {
                if (skill.trim()) {
                    html += `<span style="background: ${colors.primary}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">${skill.trim()}</span>`;
                }
            });

            html += '</div></div>';
        }

        return html;
    },

    /**
     * 🎯 AJUSTE PRINCIPAL: PDF ocupa quase toda a página A4
     */
    canvasToPDF(canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');

        // Dimensões do canvas
        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;

        // Área útil do A4 (com margens pequenas)
        const marginMm = 8; // margem de 8mm ao redor
        const maxWidthMm = this.A4_WIDTH - (marginMm * 2);  // 194mm
        const maxHeightMm = this.A4_HEIGHT - (marginMm * 2); // 281mm

        // Converte pixels para mm (96 DPI: 1px = 0.264583mm)
        // Mas como usamos scale=2 no html2canvas, dividimos por 2
        const pxToMm = 0.264583;
        const imgWidthMm = (imgWidthPx / 2) * pxToMm;
        const imgHeightMm = (imgHeightPx / 2) * pxToMm;

        // Calcula escala para caber na página, mas ocupando MÁXIMO de espaço
        const scaleX = maxWidthMm / imgWidthMm;
        const scaleY = maxHeightMm / imgHeightMm;
        const scale = Math.min(scaleX, scaleY);

        // Dimensões finais (ocupa máximo possível mantendo proporção)
        let finalWidth = imgWidthMm * scale;
        let finalHeight = imgHeightMm * scale;

        // Fallbacks de segurança
        if (!Number.isFinite(finalWidth) || finalWidth <= 0) finalWidth = 190;
        if (!Number.isFinite(finalHeight) || finalHeight <= 0) finalHeight = 270;

        // Centraliza na página
        const x = (this.A4_WIDTH - finalWidth) / 2;
        const y = marginMm; // margem superior

        console.log('PDF:', { 
            canvas: `${imgWidthPx}x${imgHeightPx}px`, 
            mm: `${imgWidthMm.toFixed(1)}x${imgHeightMm.toFixed(1)}mm`,
            final: `${finalWidth.toFixed(1)}x${finalHeight.toFixed(1)}mm`,
            scale: scale.toFixed(2)
        });

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
